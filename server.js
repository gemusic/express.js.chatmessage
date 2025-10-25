📄 server.js (Version Complète et Finale)

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// STORAGE (In-Memory - Replace with Database in Production)
// ============================================

// Store notifications per visitor
const notifications = {};

// Store chat responses per visitor
const chatResponses = {};

// Store conversation history per visitor
const conversationHistory = {};

// ============================================
// LINDY AI WEBHOOK ENDPOINTS
// ============================================

const LINDY_WEBHOOKS = {
  BEHAVIORAL_ANALYSIS: 'https://webhook.lindy.ai/webhook/7acf721d-ccf0-4ae2-8327-ad991d9488a5',
  CHAT_MESSAGE: 'https://webhook.lindy.ai/webhook/44632419-b9cb-4f41-b3aa-3af1e4c1ebac',
  CONVERSION: 'https://webhook.lindy.ai/webhook/ca1b6566-66a2-4aa2-a0db-4ab70704fa2c',
  PRODUCT_SYNC: 'https://webhook.lindy.ai/webhook/e54f9924-989f-42b1-9c19-816e7594cbaf'
};

// ============================================
// 1. BEHAVIORAL ANALYSIS ENDPOINT
// ============================================

app.post('/api/analyze-behavior', async (req, res) => {
  try {
    const behavioralData = req.body;
    
    console.log('📊 Received behavioral data:', behavioralData);

    // Forward to Lindy AI for 4-AI analysis
    const lindyResponse = await axios.post(LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS, behavioralData);

    console.log('✅ Sent to Lindy AI for analysis');

    res.json({
      success: true,
      message: 'Behavioral data sent to Lindy AI for analysis'
    });

  } catch (error) {
    console.error('❌ Error analyzing behavior:', error.message);
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

    console.log(`📬 Notification for ${visitor_id}:`, message);

    // Store notification for this visitor
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
    console.error('❌ Error storing notification:', error.message);
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
    
    // Mark as read
    notifications[visitor_id].read = true;

    console.log(`✅ Notification retrieved for ${visitor_id}`);

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

    console.log(`💬 Chat message from ${visitor_id}:`, message);

    // Save user message to conversation history
    if (!conversationHistory[visitor_id]) {
      conversationHistory[visitor_id] = [];
    }

    conversationHistory[visitor_id].push({
      role: 'user',
      message: message,
      timestamp: new Date().toISOString()
    });

    // Forward to Lindy AI
    const lindyResponse = await axios.post(LINDY_WEBHOOKS.CHAT_MESSAGE, {
      visitor_id: visitor_id,
      message: message
    });

    console.log('✅ Chat message sent to Lindy AI');

    res.json({
      success: true,
      message: 'Message sent to Lindy AI'
    });

  } catch (error) {
    console.error('❌ Error sending chat message:', error.message);
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

    console.log(`🤖 AI response for ${visitor_id}:`, message);

    // Store AI response for this visitor
    chatResponses[visitor_id] = {
      message: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Save assistant message to conversation history
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
    console.error('❌ Error storing AI response:', error.message);
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
    
    // Mark as read
    chatResponses[visitor_id].read = true;

    console.log(`✅ AI response retrieved for ${visitor_id}`);

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
    role: role, // 'user' or 'assistant'
    message: message,
    timestamp: new Date().toISOString()
  });
  
  console.log(`💾 Saved ${role} message for ${visitor_id}:`, message);
  
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
    
    console.log('💰 Conversion tracked:', conversionData);

    // Forward to Lindy AI
    await axios.post(LINDY_WEBHOOKS.CONVERSION, conversionData);

    res.json({
      success: true,
      message: 'Conversion tracked successfully'
    });

  } catch (error) {
    console.error('❌ Error tracking conversion:', error.message);
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
    
    console.log('📦 Product update:', productData);

    // Forward to Lindy AI
    await axios.post(LINDY_WEBHOOKS.PRODUCT_SYNC, productData);

    res.json({
      success: true,
      message: 'Product update synced successfully'
    });

  } catch (error) {
    console.error('❌ Error syncing product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// 11. ANALYTICS ENDPOINTS (OPTIONAL)
// ============================================

app.post('/api/analytics/visitor', (req, res) => {
  console.log('📊 Visitor analytics:', req.body);
  res.json({ success: true });
});

app.post('/api/analytics/chat', (req, res) => {
  console.log('💬 Chat analytics:', req.body);
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
  console.log(`🚀 Luminara Express Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

