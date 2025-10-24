// ========================================
// LUMINARA EXPRESS.JS SERVER
// ========================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// ========================================
// IN-MEMORY DATA STORAGE
// ========================================
const dataStore = {
  visitors: [],
  chatMessages: [],
  conversions: [],
  productUpdates: [],
  analytics: {
    totalVisitors: 0,
    totalConversations: 0,
    totalConversions: 0,
    conversionRate: 0
  }
};

// ========================================
// HELPER FUNCTIONS
// ========================================
function updateAnalytics() {
  dataStore.analytics.totalVisitors = dataStore.visitors.length;
  dataStore.analytics.totalConversations = dataStore.chatMessages.filter(m => m.type === 'conversation').length;
  dataStore.analytics.totalConversions = dataStore.conversions.length;
  dataStore.analytics.conversionRate = dataStore.analytics.totalVisitors > 0 
    ? ((dataStore.analytics.totalConversions / dataStore.analytics.totalVisitors) * 100).toFixed(2)
    : 0;
}

// ========================================
// ROUTE 1: SEND NOTIFICATION (FROM LINDY)
// ========================================
app.post('/api/send-notification', (req, res) => {
  console.log('📩 Notification received from Lindy:', req.body);
  
  const notification = {
    id: Date.now().toString(),
    visitor_id: req.body.visitor_id || 'unknown',
    message: req.body.message || '',
    techniques_used: req.body.techniques_used || [],
    recommended_products: req.body.recommended_products || [],
    confidence_score: req.body.confidence_score || 0,
    timestamp: new Date().toISOString(),
    type: 'notification'
  };
  
  dataStore.chatMessages.push(notification);
  
  res.status(200).json({
    success: true,
    message: 'Notification received and stored',
    notification_id: notification.id
  });
});

// ========================================
// ROUTE 2: SEND CHAT MESSAGE (FROM LINDY)
// ========================================
app.post('/api/send-chat-message', (req, res) => {
  console.log('💬 Chat message received from Lindy:', req.body);
  
  const chatMessage = {
    id: Date.now().toString(),
    visitor_id: req.body.visitor_id || 'unknown',
    message: req.body.message || '',
    techniques_used: req.body.techniques_used || [],
    recommended_products: req.body.recommended_products || [],
    products: req.body.products || [],
    timestamp: new Date().toISOString(),
    type: 'chat_response'
  };
  
  dataStore.chatMessages.push(chatMessage);
  
  res.status(200).json({
    success: true,
    message: 'Chat message received and stored',
    message_id: chatMessage.id
  });
});

// ========================================
// ROUTE 3: GET CHAT MESSAGES (FOR CHATBOT)
// ========================================
app.get('/api/get-chat-messages', (req, res) => {
  const visitorId = req.query.visitor_id;
  
  if (!visitorId) {
    return res.status(400).json({
      success: false,
      error: 'visitor_id is required'
    });
  }
  
  const messages = dataStore.chatMessages
    .filter(m => m.visitor_id === visitorId && m.type === 'chat_response')
    .slice(-5)
    .map(m => ({
      id: m.id,
      message: m.message,
      products: m.products || [],
      timestamp: m.timestamp
    }));
  
  res.status(200).json({
    success: true,
    messages: messages
  });
});

// ========================================
// ROUTE 4: LOG ANALYTICS - VISITOR
// ========================================
app.post('/api/analytics/visitor', (req, res) => {
  console.log('📊 Visitor analytics received:', req.body);
  
  const visitorData = {
    id: Date.now().toString(),
    visitor_id: req.body.visitor_id || 'unknown',
    page_url: req.body.page_url || '',
    time_on_page: req.body.time_on_page || 0,
    scroll_depth: req.body.scroll_depth || 0,
    action_taken: req.body.action_taken || 'none',
    techniques_used: req.body.techniques_used || [],
    timestamp: new Date().toISOString()
  };
  
  dataStore.visitors.push(visitorData);
  updateAnalytics();
  
  res.status(200).json({
    success: true,
    message: 'Visitor analytics logged'
  });
});

// ========================================
// ROUTE 5: LOG ANALYTICS - CHAT
// ========================================
app.post('/api/analytics/chat', (req, res) => {
  console.log('💬 Chat analytics received:', req.body);
  
  const chatData = {
    id: Date.now().toString(),
    visitor_id: req.body.visitor_id || 'unknown',
    message_from_user: req.body.message_from_user || '',
    response_from_luminara: req.body.response_from_luminara || '',
    techniques_used: req.body.techniques_used || [],
    products_recommended: req.body.products_recommended || [],
    cart_link_sent: req.body.cart_link_sent || false,
    timestamp: new Date().toISOString(),
    type: 'conversation'
  };
  
  dataStore.chatMessages.push(chatData);
  updateAnalytics();
  
  res.status(200).json({
    success: true,
    message: 'Chat analytics logged'
  });
});

// ========================================
// ROUTE 6: LOG ANALYTICS - CONVERSION
// ========================================
app.post('/api/analytics/conversion', (req, res) => {
  console.log('🎉 Conversion received:', req.body);
  
  const conversionData = {
    id: Date.now().toString(),
    visitor_id: req.body.visitor_id || 'unknown',
    product_purchased: req.body.product_purchased || '',
    price: req.body.price || 0,
    timestamp: new Date().toISOString()
  };
  
  dataStore.conversions.push(conversionData);
  updateAnalytics();
  
  res.status(200).json({
    success: true,
    message: 'Conversion logged'
  });
});

// ========================================
// ROUTE 7: LOG ANALYTICS - PRODUCT UPDATE
// ========================================
app.post('/api/analytics/product-update', (req, res) => {
  console.log('📦 Product update received:', req.body);
  
  const productData = {
    id: Date.now().toString(),
    product_id: req.body.product_id || '',
    product_name: req.body.product_name || '',
    price: req.body.price || 0,
    stock_status: req.body.stock_status || 'in_stock',
    timestamp: new Date().toISOString()
  };
  
  dataStore.productUpdates.push(productData);
  
  res.status(200).json({
    success: true,
    message: 'Product update logged'
  });
});

// ========================================
// ROUTE 8: GET ALL ANALYTICS (FOR DASHBOARD)
// ========================================
app.get('/api/dashboard/analytics', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      summary: dataStore.analytics,
      visitors: dataStore.visitors.slice(-50),
      conversations: dataStore.chatMessages.filter(m => m.type === 'conversation').slice(-50),
      conversions: dataStore.conversions.slice(-50),
      notifications: dataStore.chatMessages.filter(m => m.type === 'notification').slice(-50)
    }
  });
});

// ========================================
// ROUTE 9: GET REAL-TIME VISITORS
// ========================================
app.get('/api/dashboard/visitors/realtime', (req, res) => {
  const now = Date.now();
  const fiveMinutesAgo = now - (5 * 60 * 1000);
  
  const realtimeVisitors = dataStore.visitors.filter(v => {
    const visitorTime = new Date(v.timestamp).getTime();
    return visitorTime > fiveMinutesAgo;
  });
  
  res.status(200).json({
    success: true,
    count: realtimeVisitors.length,
    visitors: realtimeVisitors
  });
});

// ========================================
// ROUTE 10: HEALTH CHECK
// ========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Luminara Express Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`✅ Luminara Express Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/analytics`);
});

module.exports = app;

