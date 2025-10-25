// ========================================
// LUMINARA EXPRESS.JS SERVER V2
// WITH CONVERSATION MEMORY
// ========================================

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// CONVERSATION MEMORY STORAGE
// ========================================

const conversationHistory = new Map();
// Structure: conversationHistory.set(visitor_id, [
//   { role: 'user', message: 'Hi', timestamp: '...' },
//   { role: 'assistant', message: 'Hello!', timestamp: '...' }
// ])

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
// SOCKET.IO CONNECTION
// ========================================

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

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
  
  // Get existing history or create new
  const history = conversationHistory.get(visitor_id) || [];
  
  // Add new message
  history.push({
    role: role, // 'user' or 'assistant'
    message: message,
    timestamp: new Date().toISOString()
  });
  
  // Save back to memory
  conversationHistory.set(visitor_id, history);
  
  console.log(`💬 Conversation saved for ${visitor_id} (${history.length} messages)`);
  console.log(`   Role: ${role}`);
  console.log(`   Message: ${message.substring(0, 50)}...`);
  
  res.json({
    success: true,
    visitor_id: visitor_id,
    message_count: history.length
  });
});

// ========================================
// NOTIFICATION ENDPOINT
// ========================================

app.post('/api/send-notification', (req, res) => {
  const { visitor_id, message } = req.body;
  
  if (!visitor_id || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing visitor_id or message'
    });
  }
  
  console.log(`🔔 Notification for ${visitor_id}: ${message}`);
  
  // Emit notification via Socket.IO
  io.emit('notification', {
    visitor_id: visitor_id,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    message: 'Notification sent'
  });
});

// ========================================
// CHAT MESSAGE ENDPOINT
// ========================================

app.post('/api/send-chat-message', (req, res) => {
  const { visitor_id, message } = req.body;
  
  if (!visitor_id || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing visitor_id or message'
    });
  }
  
  console.log(`💬 Chat message from ${visitor_id}: ${message}`);
  
  // Emit chat message via Socket.IO
  io.emit('chat-message', {
    visitor_id: visitor_id,
    message: message,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    success: true,
    message: 'Chat message sent'
  });
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

app.post('/api/analytics/conversion', (req, res) => {
  const data = req.body;
  analytics.conversions.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`💰 Conversion logged: ${data.product_purchased} - $${data.price}`);
  
  res.json({ success: true, message: 'Conversion logged' });
});

app.post('/api/analytics/product-update', (req, res) => {
  const data = req.body;
  analytics.products.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  console.log(`📦 Product update logged: ${data.product_name}`);
  
  res.json({ success: true, message: 'Product update logged' });
});

// GET analytics dashboard data
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
    conversations_stored: conversationHistory.size
  });
});

// ========================================
// START SERVER
// ========================================

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 LUMINARA EXPRESS.JS SERVER V2 (WITH MEMORY)         ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Socket.IO enabled for real-time communication          ║
║   Conversation memory enabled                            ║
║                                                           ║
║   Endpoints:                                             ║
║   • GET  /api/conversation/:visitor_id                   ║
║   • POST /api/conversation/save                          ║
║   • POST /api/send-notification                          ║
║   • POST /api/send-chat-message                          ║
║   • POST /api/analytics/visitor                          ║
║   • POST /api/analytics/chat                             ║
║   • POST /api/analytics/conversion                       ║
║   • POST /api/analytics/product-update                   ║
║   • GET  /api/analytics/dashboard                        ║
║   • GET  /health                                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

