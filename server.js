const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (in production, use Redis or PostgreSQL)
const pendingMessages = new Map();
const visitorSessions = new Map();

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'Luminara AI Sales Agent',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Endpoint to receive chat messages from Lindy
app.post('/api/send-chat-message', (req, res) => {
    const { visitor_id, message, payment_link, neuro_techniques_applied } = req.body;
    
    console.log('📨 Received chat message from Lindy:', {
        visitor_id,
        message: message?.substring(0, 50) + '...',
        has_payment_link: !!payment_link
    });
    
    // Store message for visitor
    pendingMessages.set(visitor_id, {
        message,
        payment_link,
        neuro_techniques_applied,
        timestamp: Date.now()
    });
    
    // Auto-cleanup after 60 seconds
    setTimeout(() => {
        pendingMessages.delete(visitor_id);
    }, 60000);
    
    res.json({ success: true, visitor_id });
});

// Endpoint to receive notifications from Lindy
app.post('/api/send-notification', (req, res) => {
    const { visitor_id, action, message, timing } = req.body;
    
    console.log('🔔 Received notification from Lindy:', {
        visitor_id,
        action,
        timing
    });
    
    // Store notification for visitor
    pendingMessages.set(visitor_id, {
        message,
        action,
        timing,
        timestamp: Date.now()
    });
    
    res.json({ success: true, visitor_id });
});

// Endpoint for widget to poll for responses
app.get('/api/get-chat-response', (req, res) => {
    const { visitor_id } = req.query;
    
    if (!visitor_id) {
        return res.status(400).json({ error: 'visitor_id required' });
    }
    
    const response = pendingMessages.get(visitor_id);
    
    if (response) {
        // Delete message after retrieval
        pendingMessages.delete(visitor_id);
        
        console.log('✅ Sending response to visitor:', visitor_id);
        res.json(response);
    } else {
        res.json({ message: null });
    }
});

// Endpoint to track visitor sessions
app.post('/api/track-session', (req, res) => {
    const { visitor_id, page_url, session_data } = req.body;
    
    visitorSessions.set(visitor_id, {
        page_url,
        session_data,
        last_activity: Date.now()
    });
    
    res.json({ success: true });
});

// Endpoint to get visitor session data
app.get('/api/get-session', (req, res) => {
    const { visitor_id } = req.query;
    
    const session = visitorSessions.get(visitor_id);
    
    if (session) {
        res.json(session);
    } else {
        res.json({ session: null });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Luminara Express Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/send-chat-message`);
});

