// ========================================
// LUMINARA EXPRESS.JS SERVER - LINDY AI INTEGRATION
// ========================================

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// LINDY WEBHOOK URLS (TO BE CONFIGURED)
// ========================================

const LINDY_WEBHOOKS = {
  // Webhook for 30-second behavioral data analysis
  BEHAVIORAL_ANALYSIS: 'https://webhook.lindy.ai/webhook/7acf721d-ccf0-4ae2-8327-ad991d9488a5',
  
  // Webhook for chat messages
  CHAT_MESSAGE: 'https://webhook.lindy.ai/webhook/44632419-b9cb-4f41-b3aa-3af1e4c1ebac',
  
  // Webhook for conversions
  CONVERSION: 'https://webhook.lindy.ai/webhook/ca1b6566-66a2-4aa2-a0db-4ab70704fa2c',
  
  // Webhook for product sync
  PRODUCT_SYNC: 'https://webhook.lindy.ai/webhook/e54f9924-989f-42b1-9c19-816e7594cbaf'
};

// ========================================
// CONVERSATION MEMORY STORAGE
// ========================================

const conversationHistory = new Map();

// ========================================
// NOTIFICATION QUEUE (PER VISITOR)
// ========================================

const notificationQueue = new Map();

// ========================================
// ANALYTICS STORAGE (IN-MEMORY)
// ========================================

const analytics = {
  visitors: [],
  chats: [],
  conversions: [],
  products: []
};

// ========================================
// CONVERSATION ENDPOINTS
// ========================================

// GET conversation history for a specific visitor
app.get('/api/conversation/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;
  const history = conversationHistory.get(visitor_id) || [];
  
  console.log(`📖 Retrieved conversation history for ${visitor_id}: ${history.length} messages`);
  
  res.json({
    success: true,
    visitor_id: visitor_id,
    message_count: history.length,
    history: history
  });
});

// SAVE a message to conversation history
app.post('/api/conversation/save', (req, res) => {
  const { visitor_id, role, message } = req.body;
  
  if (!visitor_id || !role || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: visitor_id, role, message'
    });
  }
  
  const history = conversationHistory.get(visitor_id) || [];
  
  history.push({
    role: role,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  conversationHistory.set(visitor_id, history);
  
  console.log(`💬 Conversation saved for ${visitor_id} (${history.length} messages)`);
  
  res.json({
    success: true,
    visitor_id: visitor_id,
    message_count: history.length
  });
});

// ========================================
// BEHAVIORAL ANALYSIS ENDPOINT
// ========================================

// Receive 30-second accumulated behavioral data from tracking script
app.post('/api/analyze-behavior', async (req, res) => {
  const behavioralData = req.body;
  
  console.log(`🧠 Received behavioral data for visitor: ${behavioralData.visitor_id}`);
  
  try {
    // Send to Lindy AI Webhook for 4-AI analysis
    const lindyResponse = await fetch(LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(behavioralData)
    });
    
    if (!lindyResponse.ok) {
      throw new Error(`Lindy webhook failed: ${lindyResponse.status}`);
    }
    
    console.log(`✅ Behavioral data sent to Lindy AI for analysis`);
    
    res.json({
      success: true,
      message: 'Behavioral data sent to Lindy AI for analysis'
    });
    
  } catch (error) {
    console.error(`❌ Error sending to Lindy AI:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to send data to Lindy AI'
    });
  }
});

// ========================================
// NOTIFICATION ENDPOINTS
// ========================================

// SEND notification (called by Lindy AI after 4-AI analysis)
app.post('/api/send-notification', (req, res) => {
  const { visitor_id, message } = req.body;
  
  if (!visitor_id || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing visitor_id or message'
    });
  }
  
  // Store notification in queue
  const notifications = notificationQueue.get(visitor_id) || [];
  notifications.push({
    message: message,
    timestamp: new Date().toISOString(),
    read: false
  });
  
  notificationQueue.set(visitor_id, notifications);
  
  console.log(`🔔 Notification queued for ${visitor_id}: ${message}`);
  
  res.json({
    success: true,
    message: 'Notification queued successfully'
  });
});

// GET pending notifications for a visitor
app.get('/api/notifications/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;
  const notifications = notificationQueue.get(visitor_id) || [];
  
  // Get unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  
  if (unreadNotifications.length > 0) {
    // Mark first unread notification as read
    const notification = unreadNotifications[0];
    notification.read = true;
    
    console.log(`📬 Notification retrieved for ${visitor_id}: ${notification.message}`);
    
    res.json({
      success: true,
      notification: notification
    });
  } else {
    res.json({
      success: true,
      notification: null
    });
  }
});

// ========================================
// CHAT MESSAGE ENDPOINTS
// ========================================

// Receive chat message from visitor
app.post('/api/chat', async (req, res) => {
  const { visitor_id, message } = req.body;
  
  if (!visitor_id || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing visitor_id or message'
    });
  }
  
  console.log(`💬 Chat message from ${visitor_id}: ${message}`);
  
  // Save user message to conversation history
  const history = conversationHistory.get(visitor_id) || [];
  history.push({
    role: 'user',
    message: message,
    timestamp: new Date().toISOString()
  });
  conversationHistory.set(visitor_id, history);
  
  try {
    // Send to Lindy AI Webhook for neuro-selling response
    const lindyResponse = await fetch(LINDY_WEBHOOKS.CHAT_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitor_id: visitor_id,
        message: message,
        conversation_history: history
      })
    });
    
    if (!lindyResponse.ok) {
      throw new Error(`Lindy webhook failed: ${lindyResponse.status}`);
    }
    
    console.log(`✅ Chat message sent to Lindy AI`);
    
    res.json({
      success: true,
      message: 'Message sent to Lindy AI, response will be delivered via /api/send-chat-message'
    });
    
  } catch (error) {
    console.error(`❌ Error sending to Lindy AI:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message to Lindy AI'
    });
  }
});

// SEND chat response (called by Lindy AI after generating response)
app.post('/api/send-chat-message', (req, res) => {
  const { visitor_id, message } = req.body;
  
  if (!visitor_id || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing visitor_id or message'
    });
  }
  
  // Save AI response to conversation history
  const history = conversationHistory.get(visitor_id) || [];
  history.push({
    role: 'assistant',
    message: message,
    timestamp: new Date().toISOString()
  });
  conversationHistory.set(visitor_id, history);
  
  console.log(`🤖 AI response saved for ${visitor_id}: ${message}`);
  
  res.json({
    success: true,
    message: 'AI response saved to conversation history'
  });
});

// GET latest chat response for visitor (polled by chatbot)
app.get('/api/chat-response/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;
  const history = conversationHistory.get(visitor_id) || [];
  
  // Get last assistant message
  const lastAssistantMessage = [...history].reverse().find(msg => msg.role === 'assistant');
  
  if (lastAssistantMessage) {
    res.json({
      success: true,
      message: lastAssistantMessage.message,
      timestamp: lastAssistantMessage.timestamp
    });
  } else {
    res.json({
      success: true,
      message: null
    });
  }
});

// ========================================
// ANALYTICS ENDPOINTS
// ========================================

app.post('/api/analytics/visitor', (req, res) => {
  const data = req.body;
  analytics.visitors.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📊 Visitor analytics logged for ${data.visitor_id}`);
  
  res.json({ success: true, message: 'Visitor analytics logged' });
});

app.post('/api/analytics/chat', (req, res) => {
  const data = req.body;
  analytics.chats.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`💬 Chat analytics logged for ${data.visitor_id}`);
  
  res.json({ success: true, message: 'Chat analytics logged' });
});

app.post('/api/analytics/conversion', async (req, res) => {
  const data = req.body;
  analytics.conversions.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`💰 Conversion logged: ${data.product_purchased} - $${data.price}`);
  
  // Send to Lindy AI Webhook
  try {
    await fetch(LINDY_WEBHOOKS.CONVERSION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log(`✅ Conversion sent to Lindy AI`);
  } catch (error) {
    console.error(`❌ Error sending conversion to Lindy AI:`, error);
  }
  
  res.json({ success: true, message: 'Conversion logged' });
});

app.post('/api/analytics/product-update', async (req, res) => {
  const data = req.body;
  analytics.products.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📦 Product update logged: ${data.product_name}`);
  
  // Send to Lindy AI Webhook
  try {
    await fetch(LINDY_WEBHOOKS.PRODUCT_SYNC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log(`✅ Product update sent to Lindy AI`);
  } catch (error) {
    console.error(`❌ Error sending product update to Lindy AI:`, error);
  }
  
  res.json({ success: true, message: 'Product update logged' });
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      total_visitors: analytics.visitors.length,
      total_chats: analytics.chats.length,
      total_conversions: analytics.conversions.length,
      total_revenue: analytics.conversions.reduce((sum, c) => sum + (c.price || 0), 0),
      recent_visitors: analytics.visitors.slice(-10),
      recent_chats: analytics.chats.slice(-10),
      recent_conversions: analytics.conversions.slice(-5)
    }
  });
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    conversations_stored: conversationHistory.size,
    pending_notifications: notificationQueue.size,
    lindy_webhooks_configured: Object.keys(LINDY_WEBHOOKS).length
  });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 LUMINARA EXPRESS.JS SERVER - LINDY AI INTEGRATION   ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Conversation memory enabled                            ║
║   Notification system enabled                            ║
║   Lindy AI webhooks configured                           ║
║                                                           ║
║   Endpoints:                                             ║
║   • POST /api/analyze-behavior (from tracking script)   ║
║   • POST /api/send-notification (from Lindy AI)         ║
║   • GET  /api/notifications/:visitor_id (chatbot poll)  ║
║   • POST /api/chat (from chatbot)                       ║
║   • POST /api/send-chat-message (from Lindy AI)         ║
║   • GET  /api/chat-response/:visitor_id (chatbot poll)  ║
║   • GET  /api/conversation/:visitor_id                  ║
║   • POST /api/conversation/save                         ║
║   • POST /api/analytics/visitor                         ║
║   • POST /api/analytics/chat                            ║
║   • POST /api/analytics/conversion                      ║
║   • POST /api/analytics/product-update                  ║
║   • GET  /api/analytics/dashboard                       ║
║   • GET  /health                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

