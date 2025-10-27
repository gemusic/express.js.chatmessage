// ============================================
// LUMINARA EXPRESS SERVER - SYSTÈME COMPLET AVEC PAIEMENTS
// ============================================

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURATION LINDY - WEBHOOKS
// ============================================
const LINDY_WEBHOOKS = {
  BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/a77d3f14-2ae7-4dd6-9862-16a0bcbc182b',
  CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/b37b9919-cd88-44d0-8d7c-a6b9c1f2975a',
  CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/a52e8822-76f6-4775-bab2-c523d49568b5',
  PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/fa1b7f8e-7d6b-4740-9e26-e9180ffe303d'
};

const LINDY_WEBHOOK_TOKENS = {
  BEHAVIORAL_ANALYSIS: 'b485b30708af35cacf531464d3958c0f2e571dfba26d142a4a595a53e851acc1',
  CHAT_MESSAGE: 'ccfc2755eedd30d02f4ec096517c06e95cc25e5ad4afe8de4f53ee1d3d30299a', // NOUVEAU TOKEN
  CONVERSION: 'd004737d70efaaab01d8984a41a0248f89e747fa638c371f061a5847c760c0c0',
  PRODUCT_SYNC: '5a86dedf6795e9c45e637de3fb02c3e1a3a1d813c27e919c33808a3fba2c3f12'
};

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: ['https://ebusinessag.com', 'http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================
// BASE DE DONNÉES PRODUITS COMPLÈTE
// ============================================
const allProducts = [
  { id: 1, name: "Quantum Earbuds Pro", price: 249, category: "audio", description: "Immersive sound with adaptive noise cancellation and 30-hour battery life.", image: "quantum-earbuds-pro.jpeg" },
  { id: 2, name: "Nexus Smart Watch", price: 399, category: "wearables", description: "Advanced health monitoring with ECG and 7-day battery life.", image: "nexus-smart-watch.jpeg" },
  { id: 3, name: "Aura AR Glasses", price: 599, category: "wearables", description: "Augmented reality display with voice control and all-day comfort.", image: "aura-ar-glasses.jpeg" },
  { id: 4, name: "Lumina Wireless Charger", price: 89, category: "accessories", description: "Fast wireless charging with adaptive power delivery up to 30W.", image: "lumina-wireless-charger.jpeg" },
  { id: 5, name: "Nova Smart Speaker", price: 199, category: "audio", description: "360-degree immersive sound with voice assistant integration.", image: "nova-smart-speaker.jpeg" },
  { id: 6, name: "Pulse Fitness Tracker", price: 149, category: "wearables", description: "Advanced fitness tracking with built-in GPS and heart rate monitoring.", image: "pulse-fitness-tracker.jpeg" },
  { id: 7, name: "Echo Wireless Earbuds", price: 179, category: "audio", description: "Crystal clear audio with 24-hour battery life and premium comfort.", image: "echo-wireless-earbuds.jpeg" },
  { id: 8, name: "Orbit Smart Ring", price: 299, category: "wearables", description: "Discreet health monitoring and gesture control in elegant titanium.", image: "orbit-smart-ring.jpeg" },
  { id: 9, name: "Zen Meditation Headband", price: 249, category: "wellness", description: "Brainwave monitoring for enhanced meditation and focus.", image: "zen-meditation-headband.jpeg" },
  { id: 10, name: "Apex Gaming Headset", price: 349, category: "audio", description: "Immersive 3D audio with noise-canceling microphone.", image: "apex-gaming-headset.jpeg" }
];

// ============================================
// STOCKAGE DES DONNÉES
// ============================================
const visitorBehaviorData = {};
const chatResponses = {};
const conversationHistory = {};
const processedVisitors = {};
const purchaseFlows = {};
const analyticsData = {
  visitors: {},
  conversions: [],
  products: {},
  chats: [],
  page_views: []
};

// ============================================
// ENDPOINTS PRINCIPAUX - FLOW COMPLET
// ============================================

// [1] ENDPOINT: RECEIVE BEHAVIORAL DATA (Début du flow)
app.post('/api/behavioral-data', async (req, res) => {
  try {
    const behavioralData = req.body;
    const visitorId = behavioralData.visitor_id;

    console.log('📊 Received behavioral data for:', visitorId);

    // Déduplication
    if (processedVisitors[visitorId]) {
      return res.json({
        success: true,
        message: 'Visitor already processed',
        duplicate: true
      });
    }

    // Stocker les données
    visitorBehaviorData[visitorId] = {
      ...behavioralData,
      received_at: new Date().toISOString(),
      flow_status: 'behavior_analysis_started'
    };

    processedVisitors[visitorId] = new Date().toISOString();

    // Envoyer à Lindy AI pour analyse comportementale
    await axios.post(LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS, behavioralData, {
      headers: { 
        'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.BEHAVIORAL_ANALYSIS}`,
        'Content-Type': 'application/json' 
      },
      timeout: 30000
    });

    visitorBehaviorData[visitorId].flow_status = 'behavior_analysis_completed';

    res.json({
      success: true,
      message: 'Behavioral data processed and sent for AI analysis',
      visitor_id: visitorId,
      flow_status: 'analysis_complete'
    });

  } catch (error) {
    console.error('❌ Error processing behavioral data:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [2] ENDPOINT: SEND CHAT MESSAGE (From Lindy AI)
app.post('/api/send-chat-message', (req, res) => {
  try {
    const { visitor_id, message, techniques_used, recommended_products, confidence_score, message_type, payment_product } = req.body;

    console.log(`🤖 AI Chat message for ${visitor_id}:`, message);

    // Stocker la réponse AI
    chatResponses[visitor_id] = {
      message: message,
      techniques_used: techniques_used || [],
      recommended_products: recommended_products || [],
      confidence_score: confidence_score || 0,
      timestamp: new Date().toISOString(),
      read: false,
      message_type: message_type || 'response',
      payment_product: payment_product || null
    };

    // Sauvegarder dans l'historique
    if (!conversationHistory[visitor_id]) {
      conversationHistory[visitor_id] = [];
    }

    conversationHistory[visitor_id].push({
      role: 'assistant',
      message: message,
      techniques_used: techniques_used,
      recommended_products: recommended_products,
      timestamp: new Date().toISOString(),
      message_type: message_type || 'response',
      payment_product: payment_product || null
    });

    res.json({ 
      success: true, 
      message: 'AI chat message stored successfully',
      visitor_id: visitor_id
    });

  } catch (error) {
    console.error('❌ Error storing AI chat message:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [3] ENDPOINT: GET CHAT RESPONSE (For Frontend)
app.get('/api/chat-response/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  if (chatResponses[visitor_id] && !chatResponses[visitor_id].read) {
    const response = chatResponses[visitor_id];
    chatResponses[visitor_id].read = true;

    // Si un produit de paiement est associé, générer un lien de paiement
    let payment_data = null;
    if (response.payment_product) {
      const product = response.payment_product;
      const cartData = [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }];
      
      const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true`;
      
      payment_data = {
        product: product,
        payment_url: paymentUrl
      };
    }

    res.json({
      success: true,
      message: response.message,
      techniques_used: response.techniques_used,
      recommended_products: response.recommended_products,
      confidence_score: response.confidence_score,
      timestamp: response.timestamp,
      payment_data: payment_data
    });
  } else {
    res.json({ success: true, message: null });
  }
});

// [4] ENDPOINT: VISITOR MESSAGE (From Frontend)
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

    // Envoyer à Lindy AI pour génération de réponse
    await axios.post(LINDY_WEBHOOKS.CHAT_MESSAGE, {
      visitor_id: visitor_id,
      message: message,
      conversation_history: conversationHistory[visitor_id],
      behavioral_data: visitorBehaviorData[visitor_id],
      timestamp: new Date().toISOString()
    }, {
      headers: { 
        'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CHAT_MESSAGE}`,
        'Content-Type': 'application/json' 
      },
      timeout: 30000
    });

    res.json({ 
      success: true, 
      message: 'Visitor message sent for AI response generation'
    });

  } catch (error) {
    console.error('❌ Error processing visitor message:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [5] ENDPOINT: CONVERSION TRACKING
app.post('/api/analytics/conversion', async (req, res) => {
  try {
    const conversionData = req.body;
    console.log('💰 Conversion tracked:', conversionData);

    // Stocker localement
    analyticsData.conversions.push({
      ...conversionData,
      recorded_at: new Date().toISOString()
    });

    // Envoyer à Lindy AI
    await axios.post(LINDY_WEBHOOKS.CONVERSION, conversionData, {
      headers: { 
        'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CONVERSION}`,
        'Content-Type': 'application/json' 
      },
      timeout: 15000
    });

    res.json({ 
      success: true, 
      message: 'Conversion tracked and synced with AI'
    });

  } catch (error) {
    console.error('❌ Error tracking conversion:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [6] ENDPOINT: GENERATE PAYMENT LINK
app.post('/api/generate-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, description, image } = req.body;

    console.log('💰 Generating payment link for:', visitor_id, product_name);

    // Construire les données du panier
    const cartData = [{
      id: product_id,
      name: product_name,
      price: price,
      quantity: 1,
      image: image
    }];

    // Construire l'URL de paiement
    const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true`;

    // Stocker la session de paiement
    if (!purchaseFlows[visitor_id]) {
      purchaseFlows[visitor_id] = {};
    }

    purchaseFlows[visitor_id].current_payment = {
      product_id: product_id,
      product_name: product_name,
      price: price,
      payment_url: paymentUrl,
      generated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      payment_url: paymentUrl,
      product: {
        id: product_id,
        name: product_name,
        price: price,
        description: description,
        image: image
      },
      message: `🎉 **Excellent choix !** Votre produit ${product_name} est prêt. \n\n**Prix :** $${price}\n\nCliquez sur le bouton ci-dessous pour procéder au paiement sécurisé.`
    });

  } catch (error) {
    console.error('❌ Error generating payment link:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [7] ENDPOINT: SEND PAYMENT LINK
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, description, image } = req.body;

    console.log('💰 Sending payment link for:', visitor_id, product_name);

    // Générer le lien de paiement
    const cartData = [{
      id: product_id,
      name: product_name,
      price: price,
      quantity: 1,
      image: image
    }];

    const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true`;

    // Stocker comme message de chat avec produit de paiement
    const productInfo = {
      id: product_id,
      name: product_name,
      price: price,
      description: description,
      image: image
    };

    chatResponses[visitor_id] = {
      message: `🎉 **Excellent choix !** Votre produit ${product_name} est prêt. \n\n**Prix :** $${price}\n\nCliquez sur le bouton ci-dessous pour procéder au paiement sécurisé.`,
      payment_product: productInfo,
      timestamp: new Date().toISOString(),
      read: false,
      message_type: 'payment_link'
    };

    // Ajouter à l'historique
    if (!conversationHistory[visitor_id]) {
      conversationHistory[visitor_id] = [];
    }

    conversationHistory[visitor_id].push({
      role: 'assistant',
      message: `🎉 **Excellent choix !** Votre produit ${product_name} est prêt. \n\n**Prix :** $${price}\n\nCliquez sur le bouton ci-dessous pour procéder au paiement sécurisé.`,
      payment_product: productInfo,
      timestamp: new Date().toISOString(),
      message_type: 'payment_link'
    });

    // Track conversion
    await axios.post(LINDY_WEBHOOKS.CONVERSION, {
      visitor_id: visitor_id,
      event_type: 'payment_link_sent',
      product: productInfo,
      timestamp: new Date().toISOString()
    }, {
      headers: { 
        'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CONVERSION}`,
        'Content-Type': 'application/json' 
      }
    });

    res.json({
      success: true,
      message: 'Payment link sent successfully',
      visitor_id: visitor_id,
      payment_url: paymentUrl
    });

  } catch (error) {
    console.error('❌ Error sending payment link:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [8] ENDPOINT: DASHBOARD ANALYTICS
app.get('/api/dashboard/analytics', (req, res) => {
  try {
    const totalVisitors = Object.keys(visitorBehaviorData).length;
    const totalConversations = Object.keys(conversationHistory).length;
    const totalConversions = analyticsData.conversions.length;
    const conversionRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) : '0';

    // Visiteurs récents
    const recentVisitors = Object.values(visitorBehaviorData)
      .sort((a, b) => new Date(b.received_at) - new Date(a.received_at))
      .slice(0, 10)
      .map(v => ({
        visitor_id: v.visitor_id,
        page_url: v.page_url,
        time_on_page: v.time_tracking?.total_time ? Math.round(v.time_tracking.total_time / 1000) : 0,
        scroll_depth: v.scroll_behavior?.depth_percentage || 0,
        products_viewed: v.product_views?.length || 0,
        flow_status: v.flow_status || 'unknown',
        timestamp: v.received_at
      }));

    // Conversations récentes
    const recentConversations = [];
    Object.entries(conversationHistory).forEach(([visitor_id, messages]) => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const userMessages = messages.filter(m => m.role === 'user');
        const lastUserMessage = userMessages[userMessages.length - 1];

        recentConversations.push({
          visitor_id: visitor_id,
          message_from_user: lastUserMessage?.message || 'N/A',
          response_from_luminara: lastMessage.role === 'assistant' ? lastMessage.message : 'N/A',
          techniques_used: lastMessage.techniques_used || [],
          products_recommended: lastMessage.recommended_products || [],
          timestamp: lastMessage.timestamp
        });
      }
    });

    recentConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Conversions récentes
    const recentConversions = analyticsData.conversions
      .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
      .slice(0, 10)
      .map(c => ({
        visitor_id: c.visitor_id,
        product_purchased: c.product_name || 'Unknown Product',
        price: c.price || '0',
        revenue: c.revenue || c.price || '0',
        timestamp: c.recorded_at
      }));

    res.json({
      success: true,
      data: {
        summary: {
          totalVisitors,
          totalConversations,
          totalConversions,
          conversionRate
        },
        visitors: recentVisitors,
        conversations: recentConversations.slice(0, 10),
        conversions: recentConversions
      }
    });

  } catch (error) {
    console.error('Error generating dashboard analytics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [9] ENDPOINT: GET VISITOR DATA
app.get('/api/visitor-data/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  res.json({
    success: true,
    visitor_id: visitor_id,
    behavior_data: visitorBehaviorData[visitor_id],
    conversation_history: conversationHistory[visitor_id] || [],
    chat_response: chatResponses[visitor_id],
    processed: !!processedVisitors[visitor_id]
  });
});

// [10] ENDPOINT: INITIATE CHAT FLOW
app.post('/api/initiate-chat-flow', async (req, res) => {
  try {
    const { visitor_id, initial_context } = req.body;

    console.log('🚀 Initiating chat flow for:', visitor_id);

    if (!visitorBehaviorData[visitor_id]) {
      return res.status(404).json({
        success: false,
        error: 'Visitor behavioral data not found'
      });
    }

    // Initialiser le flux d'achat
    purchaseFlows[visitor_id] = {
      visitor_id: visitor_id,
      status: 'conversation_started',
      conversation_steps: [],
      products_recommended: [],
      purchase_intent_detected: false,
      payment_link_sent: false,
      started_at: new Date().toISOString()
    };

    // Envoyer le contexte à Lindy AI pour premier message
    await axios.post(LINDY_WEBHOOKS.CHAT_MESSAGE, {
      visitor_id: visitor_id,
      message_type: 'initial_message',
      behavioral_context: visitorBehaviorData[visitor_id],
      initial_context: initial_context,
      timestamp: new Date().toISOString()
    }, {
      headers: { 
        'Authorization': `Bearer ${LINDY_WEBHOOK_TOKENS.CHAT_MESSAGE}`,
        'Content-Type': 'application/json' 
      },
      timeout: 30000
    });

    res.json({
      success: true,
      message: 'Chat flow initiated successfully',
      visitor_id: visitor_id,
      flow_status: 'chat_initiated'
    });

  } catch (error) {
    console.error('❌ Error initiating chat flow:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// SERVIR LES FICHIERS STATIQUES
// ============================================

// Servir le dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Servir le script de tracking
app.get('/tracking.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'tracking.js'));
});

// Servir le widget du chatbot
app.get('/chatbot-widget.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'chatbot-widget.js'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Luminara Express Server running optimally',
    timestamp: new Date().toISOString(),
    statistics: {
      total_visitors: Object.keys(visitorBehaviorData).length,
      total_conversations: Object.keys(conversationHistory).length,
      total_conversions: analyticsData.conversions.length,
      total_products: allProducts.length
    },
    endpoints: {
      behavioral_data: 'POST /api/behavioral-data',
      chat_message: 'POST /api/send-chat-message',
      chat_response: 'GET /api/chat-response/:visitor_id',
      visitor_message: 'POST /api/visitor-message',
      conversion: 'POST /api/analytics/conversion',
      payment_link: 'POST /api/send-payment-link',
      dashboard: 'GET /api/dashboard/analytics',
      visitor_data: 'GET /api/visitor-data/:visitor_id',
      initiate_chat: 'POST /api/initiate-chat-flow'
    }
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Luminara Express Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📈 Tracking: http://localhost:${PORT}/tracking.js`);
  console.log(`🤖 Chatbot: http://localhost:${PORT}/chatbot-widget.js`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
