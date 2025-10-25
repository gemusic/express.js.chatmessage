

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// STORAGE (In-Memory)
// ============================================

const notifications = {};
const chatResponses = {};
const conversationHistory = {};

// ============================================
// LINDY AI WEBHOOK ENDPOINTS (CORRECTED)
// ============================================

const LINDY_WEBHOOKS = {
  BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/7acf721d-ccf0-4ae2-8327-ad991d9488a5',
  CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/44632419-b9cb-4f41-b3aa-3af1e4c1ebac',
  CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/ca1b6566-66a2-4aa2-a0db-4ab70704fa2c',
  PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/e54f9924-989f-42b1-9c19-816e7594cbaf'
};

const WEBHOOK_TOKENS = {
  BEHAVIORAL_ANALYSIS: 'fd17e82e6fe51ea0a6d1043ec2ad9425adfd358f9628227207a6a0eea9a951e3',
  CHAT_MESSAGE: '27e496453b0e20b07725145876e696c91be4ac9beb6d359ab70e449a7e110a30',
  CONVERSION: 'cd6cc7a7ec3ab1358e0013f31cca0ffba2b94390e89534acb76d622812b0acb6',
  PRODUCT_SYNC: 'db44f3ca53a1292184c2af5d87ec87b6ce32c4993b5f84d5a25ff763919c9490'
};

// ============================================
// 1. BEHAVIORAL ANALYSIS ENDPOINT
// ============================================

app.post('/api/analyze-behavior', async (req, res) => {
  try {
    const behavioralData = req.body;
    
    console.log(' Received behavioral data:', behavioralData);

    // Forward to Lindy AI with authentication
    const lindyResponse = await axios.post(
      LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS,
      behavioralData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WEBHOOK_TOKENS.BEHAVIORAL_ANALYSIS}`
        }
      }
    );

    console.log(' Sent to Lindy AI for analysis');

    res.json({
      success: true,
      message: 'Behavioral data sent to Lindy AI for analysis'
    });

  } catch (error) {
    console.error(' Error analyzing behavior:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 2. NOTIFICATION ENDPOINT (FROM LINDY AI)
// ============================================

app.post('/api/send-notification', (req, res) => {
  try {
    const { visitor_id, message } = req.body;

    console.log(` Notification for ${visitor_id}:`, message);

    notifications[visitor_id] = {
      message: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    res.json({
      success: true,
      message: 'Notification stored successfully'
    });

  } catch (error) {
    console.error(' Error storing notification:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 3. GET NOTIFICATIONS (POLLED BY CHATBOT)
// ============================================

app.get('/api/notifications/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  if (notifications[visitor_id] && !notifications[visitor_id].read) {
    const notification = notifications[visitor_id];
    
    notifications[visitor_id].read = true;

    console.log(` Notification retrieved for ${visitor_id}`);

    res.json({
      success: true,
      notification: notification.message
    });
  } else {
    res.json({
      success: true,
      notification: null
    });
  }
});

// ============================================
// 4. CHAT MESSAGE ENDPOINT (FROM VISITOR)
// ============================================

app.post('/api/chat', async (req, res) => {
  try {
    const { visitor_id, message } = req.body;

    console.log(` Chat message from ${visitor_id}:`, message);

    // Save user message to conversation history
    if (!conversationHistory[visitor_id]) {
      conversationHistory[visitor_id] = [];
    }

    conversationHistory[visitor_id].push({
      role: 'user',
      message: message,
      timestamp: new Date().toISOString()
    });

    // Forward to Lindy AI with authentication
    const lindyResponse = await axios.post(
      LINDY_WEBHOOKS.CHAT_MESSAGE,
      {
        visitor_id: visitor_id,
        message: message
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WEBHOOK_TOKENS.CHAT_MESSAGE}`
        }
      }
    );

    console.log(' Chat message sent to Lindy AI');

    res.json({
      success: true,
      message: 'Message sent to Lindy AI'
    });

  } catch (error) {
    console.error(' Error sending chat message:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 5. CHAT RESPONSE ENDPOINT (FROM LINDY AI)
// ============================================

app.post('/api/send-chat-message', (req, res) => {
  try {
    const { visitor_id, message } = req.body;

    console.log(` AI response for ${visitor_id}:`, message);

    chatResponses[visitor_id] = {
      message: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (!conversationHistory[visitor_id]) {
      conversationHistory[visitor_id] = [];
    }

    conversationHistory[visitor_id].push({
      role: 'assistant',
      message: message,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'AI response stored successfully'
    });

  } catch (error) {
    console.error(' Error storing AI response:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 6. GET CHAT RESPONSE (POLLED BY CHATBOT)
// ============================================

app.get('/api/chat-response/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  if (chatResponses[visitor_id] && !chatResponses[visitor_id].read) {
    const response = chatResponses[visitor_id];
    
    chatResponses[visitor_id].read = true;

    console.log(` AI response retrieved for ${visitor_id}`);

    res.json({
      success: true,
      message: response.message
    });
  } else {
    res.json({
      success: true,
      message: null
    });
  }
});

// ============================================
// 7. GET CONVERSATION HISTORY (FOR LINDY AI)
// ============================================

app.get('/api/conversation/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;
  
  if (!conversationHistory[visitor_id]) {
    return res.json({
      success: true,
      history: []
    });
  }
  
  res.json({
    success: true,
    history: conversationHistory[visitor_id]
  });
});

// ============================================
// 8. SAVE MESSAGE TO CONVERSATION HISTORY
// ============================================

app.post('/api/conversation/save', (req, res) => {
  const { visitor_id, role, message } = req.body;
  
  if (!conversationHistory[visitor_id]) {
    conversationHistory[visitor_id] = [];
  }
  
  conversationHistory[visitor_id].push({
    role: role,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  console.log(` Saved ${role} message for ${visitor_id}:`, message);
  
  res.json({
    success: true,
    message: 'Message saved to conversation history'
  });
});

// ============================================
// 9. CONVERSION TRACKING ENDPOINT
// ============================================

app.post('/api/analytics/conversion', async (req, res) => {
  try {
    const conversionData = req.body;
    
    console.log(' Conversion tracked:', conversionData);

    await axios.post(
      LINDY_WEBHOOKS.CONVERSION,
      conversionData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WEBHOOK_TOKENS.CONVERSION}`
        }
      }
    );

    res.json({
      success: true,
      message: 'Conversion tracked successfully'
    });

  } catch (error) {
    console.error(' Error tracking conversion:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 10. PRODUCT SYNC ENDPOINT
// ============================================

app.post('/api/analytics/product-update', async (req, res) => {
  try {
    const productData = req.body;
    
    console.log(' Product update:', productData);

    await axios.post(
      LINDY_WEBHOOKS.PRODUCT_SYNC,
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WEBHOOK_TOKENS.PRODUCT_SYNC}`
        }
      }
    );

    res.json({
      success: true,
      message: 'Product update synced successfully'
    });

  } catch (error) {
    console.error(' Error syncing product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 11. ANALYTICS ENDPOINTS
// ============================================

app.post('/api/analytics/visitor', (req, res) => {
  console.log(' Visitor analytics:', req.body);
  res.json({ success: true });
});

app.post('/api/analytics/chat', (req, res) => {
  console.log(' Chat analytics:', req.body);
  res.json({ success: true });
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Luminara Express Server is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(` Luminara Express Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});

