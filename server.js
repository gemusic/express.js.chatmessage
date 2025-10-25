// ============================================
// LUMINARA EXPRESS SERVER - VERSION OPTIMISÉE
// Parfaitement aligné avec Lindy + Tracking + Site E-commerce
// ============================================

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE OPTIMISÉ
// ============================================
app.use(cors({
    origin: ['https://ebusinessag.com', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Augmenté pour les données de tracking
app.use(express.urlencoded({ extended: true }));

// ============================================
// CONFIGURATION LINDY - NOUVELLES URLs
// ============================================
const LINDY_WEBHOOKS = {
    BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/0de777e3-9723-48c7-9fd4-6456774e4428',
    CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/1a292d2a-eeb9-48a2-a4a5-00d5596253ee',
    CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/99829fec-a3bf-427b-84ac-deef7cfdfa6b',
    PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/4b27b7a5-6690-4fcc-a81d-a23780ef27fe'
};

const LINDY_WEBHOOK_TOKENS = {
    BEHAVIORAL_ANALYSIS: '75e40c6949e8d5f5041150e501cc23e60dbbf95b4e783d436ba108cfce1bdbe8',
    CHAT_MESSAGE: '84c8dff9662aaf0d9fc6550bc0445d831d429411b78027c589420871ff368e0c',
    CONVERSION: '5d3591fe4f9f968615b6e234e4a2a5cd70c7fca0532bd6249c2a46d05b373086',
    PRODUCT_SYNC: '51bb612c9456d46fdc2b11436216c73669124a43580edc7f99a62aa8d2109efa'
};

// ============================================
// STORAGE OPTIMISÉ (Adapté à votre structure HTML)
// ============================================

// Store visitor behavioral data (adapté au nouveau tracking)
const visitorBehaviorData = {};

// Store chat responses per visitor (structure alignée avec votre chat)
const chatResponses = {};

// Store conversation history (format cohérent avec votre site)
const conversationHistory = {};

// Analytics storage (pour dashboard futur)
const analyticsData = {
    visitors: {},
    conversions: [],
    products: {},
    chats: []
};

// ============================================
// 1. ENDPOINT: RECEIVE BEHAVIORAL DATA (NOUVEAU)
// ============================================
app.post('/api/behavioral-data', async (req, res) => {
    try {
        const behavioralData = req.body;
        
        console.log('📊 Received behavioral data for:', behavioralData.visitor_id);
        
        // Stocker les données pour analyse immédiate
        visitorBehaviorData[behavioralData.visitor_id] = {
            ...behavioralData,
            received_at: new Date().toISOString(),
            processed: false
        };

        // Forward to Lindy AI pour analyse comportementale
        const lindyResponse = await axios.post(
            LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS, 
            behavioralData,
            {
                headers: {
                    'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.BEHAVIORAL_ANALYSIS}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('✅ Behavioral data sent to Lindy AI');

        // Réponse immédiate au tracking
        res.json({
            success: true,
            message: 'Behavioral data received and sent for analysis',
            visitor_id: behavioralData.visitor_id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error processing behavioral data:', error.message);
        
        // Même en cas d'erreur, on stocke les données
        if (req.body.visitor_id) {
            visitorBehaviorData[req.body.visitor_id] = {
                ...req.body,
                received_at: new Date().toISOString(),
                error: error.message,
                processed: false
            };
        }

        res.status(500).json({
            success: false,
            error: 'Data stored but analysis failed: ' + error.message,
            visitor_id: req.body.visitor_id
        });
    }
});

// ============================================
// 2. ENDPOINT: SEND CHAT MESSAGE (FROM LINDY AI)
// ============================================
app.post('/api/send-chat-message', (req, res) => {
    try {
        const { visitor_id, message, techniques_used, recommended_products, confidence_score } = req.body;

        console.log(`🤖 AI Chat message for ${visitor_id}:`, message);

        // Stocker la réponse AI avec TOUTES les métriques
        chatResponses[visitor_id] = {
            message: message,
            techniques_used: techniques_used || [],
            recommended_products: recommended_products || [],
            confidence_score: confidence_score || 0,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Sauvegarder dans l'historique de conversation
        if (!conversationHistory[visitor_id]) {
            conversationHistory[visitor_id] = [];
        }

        conversationHistory[visitor_id].push({
            role: 'assistant',
            message: message,
            techniques_used: techniques_used,
            recommended_products: recommended_products,
            timestamp: new Date().toISOString()
        });

        // Analytics
        if (!analyticsData.chats[visitor_id]) {
            analyticsData.chats[visitor_id] = [];
        }
        analyticsData.chats[visitor_id].push({
            type: 'ai_message',
            message: message,
            techniques_used: techniques_used,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'AI chat message stored successfully',
            visitor_id: visitor_id
        });

    } catch (error) {
        console.error('❌ Error storing AI chat message:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// 3. ENDPOINT: GET CHAT RESPONSE (FOR FRONTEND)
// ============================================
app.get('/api/chat-response/:visitor_id', (req, res) => {
    const { visitor_id } = req.params;

    if (chatResponses[visitor_id] && !chatResponses[visitor_id].read) {
        const response = chatResponses[visitor_id];
        
        // Marquer comme lu
        chatResponses[visitor_id].read = true;

        console.log(`✅ AI response delivered to ${visitor_id}`);

        res.json({
            success: true,
            message: response.message,
            techniques_used: response.techniques_used,
            recommended_products: response.recommended_products,
            confidence_score: response.confidence_score,
            timestamp: response.timestamp
        });
    } else {
        res.json({
            success: true,
            message: null,
            timestamp: new Date().toISOString()
        });
    }
});

// ============================================
// 4. ENDPOINT: SAVE VISITOR MESSAGE (FROM FRONTEND)
// ============================================
app.post('/api/visitor-message', async (req, res) => {
    try {
        const { visitor_id, message } = req.body;

        console.log(`💬 Visitor message from ${visitor_id}:`, message);

        // Sauvegarder le message visiteur
        if (!conversationHistory[visitor_id]) {
            conversationHistory[visitor_id] = [];
        }

        conversationHistory[visitor_id].push({
            role: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });

        // Forward to Lindy AI pour génération de réponse
        const lindyResponse = await axios.post(
            LINDY_WEBHOOKS.CHAT_MESSAGE,
            {
                visitor_id: visitor_id,
                message: message,
                timestamp: new Date().toISOString()
            },
            {
                headers: {
                    'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CHAT_MESSAGE}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('✅ Visitor message sent to Lindy AI');

        res.json({
            success: true,
            message: 'Visitor message saved and sent for AI response'
        });

    } catch (error) {
        console.error('❌ Error processing visitor message:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// 5. ENDPOINT: GET CONVERSATION HISTORY
// ============================================
app.get('/api/conversation/:visitor_id', (req, res) => {
    const { visitor_id } = req.params;
    
    if (!conversationHistory[visitor_id]) {
        return res.json({
            success: true,
            history: [],
            visitor_id: visitor_id
        });
    }
    
    res.json({
        success: true,
        history: conversationHistory[visitor_id],
        visitor_id: visitor_id,
        total_messages: conversationHistory[visitor_id].length
    });
});

// ============================================
// 6. ENDPOINT: SAVE CONVERSATION MESSAGE
// ============================================
app.post('/api/conversation/save', (req, res) => {
    try {
        const { visitor_id, role, message, techniques_used, recommended_products } = req.body;
        
        if (!conversationHistory[visitor_id]) {
            conversationHistory[visitor_id] = [];
        }
        
        conversationHistory[visitor_id].push({
            role: role, // 'user' or 'assistant'
            message: message,
            techniques_used: techniques_used,
            recommended_products: recommended_products,
            timestamp: new Date().toISOString()
        });
        
        console.log(`💾 Saved ${role} message for ${visitor_id}`);
        
        res.json({
            success: true,
            message: 'Message saved to conversation history',
            total_messages: conversationHistory[visitor_id].length
        });
        
    } catch (error) {
        console.error('❌ Error saving conversation:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// 7. ENDPOINT: TRACK CONVERSION
// ============================================
app.post('/api/analytics/conversion', async (req, res) => {
    try {
        const conversionData = req.body;
        
        console.log('💰 Conversion tracked:', conversionData);

        // Stocker localement
        analyticsData.conversions.push({
            ...conversionData,
            recorded_at: new Date().toISOString()
        });

        // Forward to Lindy AI
        await axios.post(
            LINDY_WEBHOOKS.CONVERSION, 
            conversionData,
            {
                headers: {
                    'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CONVERSION}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        res.json({
            success: true,
            message: 'Conversion tracked successfully'
        });

    } catch (error) {
        console.error('❌ Error tracking conversion:', error.message);
        
        // Stocker quand même localement en cas d'erreur
        analyticsData.conversions.push({
            ...req.body,
            recorded_at: new Date().toISOString(),
            error: error.message
        });

        res.status(500).json({
            success: false,
            error: 'Conversion stored locally but sync failed: ' + error.message
        });
    }
});

// ============================================
// 8. ENDPOINT: PRODUCT SYNC
// ============================================
app.post('/api/analytics/product-update', async (req, res) => {
    try {
        const productData = req.body;
        
        console.log('📦 Product update:', productData);

        // Stocker localement
        if (!analyticsData.products[productData.product_id]) {
            analyticsData.products[productData.product_id] = [];
        }
        
        analyticsData.products[productData.product_id].push({
            ...productData,
            updated_at: new Date().toISOString()
        });

        // Forward to Lindy AI
        await axios.post(
            LINDY_WEBHOOKS.PRODUCT_SYNC, 
            productData,
            {
                headers: {
                    'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.PRODUCT_SYNC}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

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
// 9. ENDPOINT: VISITOR ANALYTICS
// ============================================
app.post('/api/analytics/visitor', (req, res) => {
    try {
        const visitorData = req.body;
        
        console.log('📊 Visitor analytics:', visitorData.visitor_id);

        // Stocker les analytics visiteur
        if (!analyticsData.visitors[visitorData.visitor_id]) {
            analyticsData.visitors[visitorData.visitor_id] = [];
        }
        
        analyticsData.visitors[visitorData.visitor_id].push({
            ...visitorData,
            recorded_at: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Visitor analytics recorded',
            visitor_id: visitorData.visitor_id
        });

    } catch (error) {
        console.error('❌ Error recording visitor analytics:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// 10. ENDPOINT: CHAT ANALYTICS
// ============================================
app.post('/api/analytics/chat', (req, res) => {
    try {
        const chatData = req.body;
        
        console.log('💬 Chat analytics for:', chatData.visitor_id);

        if (!analyticsData.chats[chatData.visitor_id]) {
            analyticsData.chats[chatData.visitor_id] = [];
        }
        
        analyticsData.chats[chatData.visitor_id].push({
            ...chatData,
            recorded_at: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Chat analytics recorded'
        });

    } catch (error) {
        console.error('❌ Error recording chat analytics:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// 11. ENDPOINT: GET VISITOR BEHAVIOR DATA (FOR DEBUG)
// ============================================
app.get('/api/visitor-data/:visitor_id', (req, res) => {
    const { visitor_id } = req.params;
    
    const behaviorData = visitorBehaviorData[visitor_id];
    const chatHistory = conversationHistory[visitor_id] || [];
    
    res.json({
        success: true,
        visitor_id: visitor_id,
        behavior_data: behaviorData,
        conversation_history: chatHistory,
        total_behavior_entries: Object.keys(visitorBehaviorData).length,
        total_conversations: Object.keys(conversationHistory).length
    });
});

// ============================================
// 12. HEALTH CHECK & STATUS
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Luminara Express Server is running optimally',
        timestamp: new Date().toISOString(),
        statistics: {
            total_visitors: Object.keys(visitorBehaviorData).length,
            total_conversations: Object.keys(conversationHistory).length,
            total_conversions: analyticsData.conversions.length,
            total_products: Object.keys(analyticsData.products).length
        },
        lindy_webhooks: {
            behavioral: '✅ Configured',
            chat: '✅ Configured', 
            conversion: '✅ Configured',
            product_sync: '✅ Configured'
        }
    });
});

// ============================================
// ERROR HANDLING GLOBAL
// ============================================
app.use((error, req, res, next) => {
    console.error('🚨 Global Error Handler:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        available_endpoints: [
            'POST /api/behavioral-data',
            'POST /api/send-chat-message',
            'GET  /api/chat-response/:visitor_id',
            'POST /api/visitor-message',
            'GET  /api/conversation/:visitor_id',
            'POST /api/conversation/save',
            'POST /api/analytics/conversion',
            'POST /api/analytics/product-update',
            'POST /api/analytics/visitor',
            'POST /api/analytics/chat',
            'GET  /api/visitor-data/:visitor_id',
            'GET  /health'
        ]
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`🚀 Luminara Express Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Ready for connections from: https://ebusinessag.com`);
    console.log(`🤖 Lindy AI Webhooks: ✅ ALL CONFIGURED`);
});
