// ============================================
// LUMINARA EXPRESS SERVER - VERSION OPTIMISÉE
// Avec système de déduplication et nouveaux webhooks
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// NOUVELLE CONFIGURATION LINDY - WEBHOOKS MIS À JOUR
// ============================================
const LINDY_WEBHOOKS = {
    BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/a77d3f14-2ae7-4dd6-9862-16a0bcbc182b',
    CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/b37b9919-cd88-44d0-8d7c-a6b9c1f2975a',
    CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/a52e8822-76f6-4775-bab2-c523d49568b5',
    PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/fa1b7f8e-7d6b-4740-9e26-e9180ffe303d'
};

const LINDY_WEBHOOK_TOKENS = {
    BEHAVIORAL_ANALYSIS: 'b485b30708af35cacf531464d3958c0f2e571dfba26d142a4a595a53e851acc1',
    CHAT_MESSAGE: 'c53acc7506a4b8997e31cd6aee2303a9c69ea774ec17db389cebedf8d33d58fe',
    CONVERSION: 'd004737d70efaaab01d8984a41a0248f89e747fa638c371f061a5847c760c0c0',
    PRODUCT_SYNC: '5a86dedf6795e9c45e637de3fb02c3e1a3a1d813c27e919c33808a3fba2c3f12'
};

// ============================================
// STORAGE OPTIMISÉ AVEC DÉDUPLICATION
// ============================================

// Store visitor behavioral data
const visitorBehaviorData = {};

// Store chat responses per visitor
const chatResponses = {};

// Store conversation history
const conversationHistory = {};

// Analytics storage
const analyticsData = {
    visitors: {},
    conversions: [],
    products: {},
    chats: []
};

// NOUVEAU: Stockage pour la déduplication
const processedVisitors = {};

// ============================================
// NOUVEAUX ENDPOINTS: SYSTÈME DE DÉDUPLICATION
// ============================================

// 1. Vérifier si visitor_id déjà traité
app.get('/api/deduplication/check', (req, res) => {
    try {
        const { visitor_id } = req.query;
        
        if (!visitor_id) {
            return res.status(400).json({
                success: false,
                error: 'visitor_id parameter is required'
            });
        }

        const processed = !!processedVisitors[visitor_id];
        
        console.log(`🔍 Deduplication check for ${visitor_id}: ${processed}`);
        
        res.json({
            success: true,
            processed: processed,
            timestamp: processed ? processedVisitors[visitor_id] : null
        });

    } catch (error) {
        console.error('❌ Error in deduplication check:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 2. Marquer visitor_id comme traité
app.post('/api/deduplication/mark', (req, res) => {
    try {
        const { visitor_id, timestamp } = req.body;
        
        if (!visitor_id) {
            return res.status(400).json({
                success: false,
                error: 'visitor_id is required'
            });
        }

        const processTime = timestamp || new Date().toISOString();
        processedVisitors[visitor_id] = processTime;
        
        console.log(`✅ Marked visitor as processed: ${visitor_id} at ${processTime}`);
        
        res.json({
            success: true,
            visitor_id: visitor_id,
            timestamp: processTime,
            message: 'Visitor marked as processed'
        });

    } catch (error) {
        console.error('❌ Error marking visitor as processed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// ENDPOINT: RECEIVE BEHAVIORAL DATA (AVEC DÉDUPLICATION)
// ============================================
app.post('/api/behavioral-data', async (req, res) => {
    try {
        const behavioralData = req.body;
        const visitorId = behavioralData.visitor_id;
        
        console.log('📊 Received behavioral data for:', visitorId);
        
        // VÉRIFICATION DE DÉDUPLICATION
        if (processedVisitors[visitorId]) {
            console.log(`🔄 Visitor ${visitorId} already processed, skipping...`);
            return res.json({
                success: true,
                message: 'Visitor already processed - deduplication active',
                visitor_id: visitorId,
                duplicate: true,
                timestamp: new Date().toISOString()
            });
        }

        // Stocker les données pour analyse immédiate
        visitorBehaviorData[visitorId] = {
            ...behavioralData,
            received_at: new Date().toISOString(),
            processed: false
        };

        // MARQUER COMME TRAITÉ
        processedVisitors[visitorId] = new Date().toISOString();

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

        res.json({
            success: true,
            message: 'Behavioral data received and sent for analysis',
            visitor_id: visitorId,
            timestamp: new Date().toISOString(),
            duplicate: false
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
// ENDPOINT: SEND CHAT MESSAGE (FROM LINDY AI)
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
// ENDPOINT: GET CHAT RESPONSE (FOR FRONTEND)
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
// ENDPOINT: SAVE VISITOR MESSAGE (FROM FRONTEND)
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
// ENDPOINT: GET CONVERSATION HISTORY
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
// ENDPOINT: SAVE CONVERSATION MESSAGE
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
// ENDPOINT: TRACK CONVERSION
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
// ENDPOINT: PRODUCT SYNC
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
// ENDPOINT: VISITOR ANALYTICS
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
// ENDPOINT: CHAT ANALYTICS
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
// ENDPOINT: GET VISITOR BEHAVIOR DATA (FOR DEBUG)
// ============================================
app.get('/api/visitor-data/:visitor_id', (req, res) => {
    const { visitor_id } = req.params;
    
    const behaviorData = visitorBehaviorData[visitor_id];
    const chatHistory = conversationHistory[visitor_id] || [];
    const processed = !!processedVisitors[visitor_id];
    
    res.json({
        success: true,
        visitor_id: visitor_id,
        behavior_data: behaviorData,
        conversation_history: chatHistory,
        processed: processed,
        processed_timestamp: processedVisitors[visitor_id],
        total_behavior_entries: Object.keys(visitorBehaviorData).length,
        total_conversations: Object.keys(conversationHistory).length,
        total_processed_visitors: Object.keys(processedVisitors).length
    });
});

// ============================================
// HEALTH CHECK & STATUS (MIS À JOUR)
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Luminara Express Server with Deduplication is running optimally',
        timestamp: new Date().toISOString(),
        statistics: {
            total_visitors: Object.keys(visitorBehaviorData).length,
            total_conversations: Object.keys(conversationHistory).length,
            total_conversions: analyticsData.conversions.length,
            total_products: Object.keys(analyticsData.products).length,
            total_processed_visitors: Object.keys(processedVisitors).length
        },
        lindy_webhooks: {
            behavioral: '✅ Configured (NEW)',
            chat: '✅ Configured (NEW)', 
            conversion: '✅ Configured (NEW)',
            product_sync: '✅ Configured (NEW)'
        },
        features: {
            deduplication: '✅ Active',
            real_time_tracking: '✅ Active',
            analytics: '✅ Active'
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

// 404 Handler (MIS À JOUR)
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        available_endpoints: [
            'GET  /api/deduplication/check?visitor_id={visitor_id}',
            'POST /api/deduplication/mark',
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
    console.log(`🚀 Luminara Express Server with Deduplication running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Ready for connections from: https://ebusinessag.com`);
    console.log(`🤖 Lindy AI Webhooks: ✅ ALL CONFIGURED (NEW WEBHOOKS)`);
    console.log(`🔄 Deduplication System: ✅ ACTIVE`);
});
