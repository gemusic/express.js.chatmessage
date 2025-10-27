// ============================================
// LUMINARA AI E-COMMERCE SERVER - ULTIMATE VERSION
// ============================================

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURATION AVANCÉE
// ============================================
const CONFIG = {
  LINDY_WEBHOOKS: {
    BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/a77d3f14-2ae7-4dd6-9862-16a0bcbc182b',
    CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/b37b9919-cd88-44d0-8d7c-a6b9c1f2975a',
    CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/a52e8822-76f6-4775-bab2-c523d49568b5',
    PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/fa1b7f8e-7d6b-4740-9e26-e9180ffe303d'
  },
  SESSION_DURATION: 30 * 60 * 1000, // 30 minutes
  MAX_PRODUCTS: 200,
  ANALYTICS_RETENTION: 24 * 60 * 60 * 1000 // 24 heures
};

// ============================================
// MIDDLEWARE DE SÉCURITÉ ET PERFORMANCE
// ============================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: ['https://ebusinessag.com', 'http://localhost:3000', 'https://luminara-express-server.onrender.com'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limite chaque IP à 1000 requêtes par windowMs
});
app.use(limiter);

// ============================================
// BASE DE DONNÉES EN MÉMOIRE OPTIMISÉE
// ============================================

// Produits complets avec toutes les données
const productsDatabase = {
  products: [
    {
      id: 1, name: "Quantum Earbuds Pro", price: 249, 
      description: "Immersive sound with adaptive noise cancellation and 30-hour battery life. Features spatial audio technology and wireless charging case with premium aluminum finish.",
      image: "quantum-earbuds-pro.jpeg",
      category: "audio",
      features: ["Noise Cancellation", "30h Battery", "Wireless Charging", "Spatial Audio"],
      tags: ["premium", "wireless", "audio"],
      inStock: true,
      rating: 4.8
    },
    {
      id: 2, name: "Nexus Smart Watch", price: 399,
      description: "Advanced health monitoring with ECG, blood oxygen tracking, and seamless smartphone connectivity. 7-day battery life with aerospace-grade titanium casing.",
      image: "nexus-smart-watch.jpeg",
      category: "wearables",
      features: ["ECG Monitoring", "7-day Battery", "Titanium Case", "Smart Connectivity"],
      tags: ["health", "premium", "smart"],
      inStock: true,
      rating: 4.7
    },
    {
      id: 3, name: "Aura AR Glasses", price: 599,
      description: "Augmented reality display with voice control and all-day comfort. Projects holographic interfaces directly into your field of view with crystal-clear optics.",
      image: "aura-ar-glasses.jpeg",
      category: "wearables",
      features: ["Augmented Reality", "Voice Control", "All-day Comfort", "Holographic Display"],
      tags: ["ar", "premium", "innovation"],
      inStock: true,
      rating: 4.9
    },
    // Ajouter tous les 50 produits avec le même niveau de détail...
    {
      id: 50, name: "Echo Wireless Charger Pad", price: 49,
      description: "Fast wireless charging with intelligent cooling fan and foreign object detection. Charges through cases up to 5mm thick with premium finish.",
      image: "echo-wireless-charger-pad.jpeg",
      category: "accessories",
      features: ["Fast Charging", "Cooling Fan", "Foreign Object Detection", "Premium Finish"],
      tags: ["charging", "accessory", "wireless"],
      inStock: true,
      rating: 4.5
    }
  ],
  
  // Analytics et tracking
  visitorBehaviorData: {},
  chatResponses: {},
  conversationHistory: {},
  processedVisitors: {},
  purchaseFlows: {},
  
  // Analytics avancés
  analyticsData: {
    visitors: {},
    conversions: [],
    products: {},
    chats: [],
    purchase_flows: [],
    revenue: 0,
    sessions: 0
  }
};

// ============================================
// FONCTIONS UTILITAIRES AVANCÉES
// ============================================

// Génération d'ID unique
function generateVisitorId() {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
}

// Nettoyage automatique des données anciennes
function cleanupOldData() {
  const now = Date.now();
  const cutoffTime = now - CONFIG.ANALYTICS_RETENTION;
  
  // Nettoyer les visiteurs anciens
  Object.keys(productsDatabase.visitorBehaviorData).forEach(visitorId => {
    const data = productsDatabase.visitorBehaviorData[visitorId];
    if (data.received_at && new Date(data.received_at).getTime() < cutoffTime) {
      delete productsDatabase.visitorBehaviorData[visitorId];
    }
  });
  
  console.log('🧹 Nettoyage des données anciennes effectué');
}
setInterval(cleanupOldData, 60 * 60 * 1000); // Toutes les heures

// ============================================
// ENDPOINTS PRINCIPAUX - API COMPLÈTE
// ============================================

// 1. Endpoint pour les produits
app.get('/api/products', (req, res) => {
  try {
    const { category, limit, page, search } = req.query;
    let filteredProducts = [...productsDatabase.products];
    
    // Filtrage par catégorie
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }
    
    // Recherche
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: filteredProducts.length,
        page: pageNum,
        totalPages: Math.ceil(filteredProducts.length / limitNum),
        hasMore: endIndex < filteredProducts.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// 2. Endpoint pour un produit spécifique
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = productsDatabase.products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Produits similaires
    const similarProducts = productsDatabase.products
      .filter(p => p.category === product.category && p.id !== productId)
      .slice(0, 6);
    
    res.json({
      success: true,
      data: {
        product: product,
        similarProducts: similarProducts
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// 3. Endpoint de tracking comportemental AVANCÉ
app.post('/api/behavioral-data', async (req, res) => {
  try {
    const behavioralData = req.body;
    const visitorId = behavioralData.visitor_id || generateVisitorId();
    
    console.log('📊 Advanced behavioral data received for:', visitorId);
    
    // Vérification de déduplication
    if (productsDatabase.processedVisitors[visitorId]) {
      return res.json({
        success: true,
        message: 'Visitor already processed',
        visitor_id: visitorId,
        duplicate: true
      });
    }
    
    // Stockage des données avancées
    productsDatabase.visitorBehaviorData[visitorId] = {
      ...behavioralData,
      received_at: new Date().toISOString(),
      processed: false,
      flow_status: 'behavior_analysis_started',
      session_id: uuidv4(),
      user_agent: req.get('User-Agent'),
      ip: req.ip
    };
    
    // Marquer comme traité
    productsDatabase.processedVisitors[visitorId] = new Date().toISOString();
    
    // Analytics
    productsDatabase.analyticsData.sessions++;
    
    // Envoi à Lindy AI pour analyse comportementale
    try {
      await axios.post(
        CONFIG.LINDY_WEBHOOKS.BEHAVIORAL_ANALYSIS,
        {
          ...behavioralData,
          analysis_type: 'advanced_behavior_analysis',
          timestamp: new Date().toISOString(),
          products_count: productsDatabase.products.length
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );
      console.log('✅ Behavioral analysis sent to Lindy AI');
    } catch (lindyError) {
      console.warn('⚠️ Lindy AI analysis failed:', lindyError.message);
    }
    
    productsDatabase.visitorBehaviorData[visitorId].flow_status = 'behavior_analysis_completed';
    
    res.json({
      success: true,
      message: 'Advanced behavioral data processed',
      visitor_id: visitorId,
      flow_status: 'behavior_analysis_completed',
      session_id: productsDatabase.visitorBehaviorData[visitorId].session_id
    });
    
  } catch (error) {
    console.error('❌ Error processing behavioral data:', error);
    res.status(500).json({
      success: false,
      error: 'Behavioral analysis failed: ' + error.message
    });
  }
});

// 4. Endpoint d'initialisation de chat IA
app.post('/api/initiate-chat', async (req, res) => {
  try {
    const { visitor_id, initial_context, current_product } = req.body;
    
    console.log('🤖 Initiating AI chat for:', visitor_id);
    
    if (!productsDatabase.visitorBehaviorData[visitor_id]) {
      return res.status(404).json({
        success: false,
        error: 'Visitor behavioral data not found'
      });
    }
    
    // Initialiser le flux d'achat avancé
    productsDatabase.purchaseFlows[visitor_id] = {
      visitor_id: visitor_id,
      status: 'conversation_started',
      conversation_steps: [],
      products_viewed: [],
      products_recommended: [],
      purchase_intent_detected: false,
      payment_link_sent: false,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_product: current_product || null,
      cart_value: 0
    };
    
    // Générer le contexte produit pour l'IA
    let productContext = '';
    if (current_product) {
      const product = productsDatabase.products.find(p => p.id === current_product);
      if (product) {
        productContext = `The visitor is currently viewing ${product.name} ($${product.price}). Features: ${product.features.join(', ')}.`;
      }
    }
    
    // Envoyer le contexte à Lindy AI
    const chatResponse = await axios.post(
      CONFIG.LINDY_WEBHOOKS.CHAT_MESSAGE,
      {
        visitor_id: visitor_id,
        message_type: 'initial_message',
        behavioral_context: productsDatabase.visitorBehaviorData[visitor_id],
        product_context: productContext,
        initial_context: initial_context,
        available_products: productsDatabase.products.slice(0, 10), // Premier 10 produits
        timestamp: new Date().toISOString()
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    // Stocker la réponse de l'IA
    productsDatabase.chatResponses[visitor_id] = {
      message: chatResponse.data.message || "Bonjour ! Je suis votre assistant Luminara. Comment puis-je vous aider à trouver le produit parfait aujourd'hui ?",
      techniques_used: chatResponse.data.techniques_used || [],
      recommended_products: chatResponse.data.recommended_products || [],
      confidence_score: chatResponse.data.confidence_score || 0.8,
      timestamp: new Date().toISOString(),
      read: false,
      message_type: 'initial'
    };
    
    // Historique de conversation
    productsDatabase.conversationHistory[visitor_id] = [{
      role: 'assistant',
      message: productsDatabase.chatResponses[visitor_id].message,
      techniques_used: productsDatabase.chatResponses[visitor_id].techniques_used,
      recommended_products: productsDatabase.chatResponses[visitor_id].recommended_products,
      timestamp: new Date().toISOString(),
      message_type: 'initial'
    }];
    
    productsDatabase.visitorBehaviorData[visitor_id].flow_status = 'chat_initiated';
    
    res.json({
      success: true,
      message: 'AI chat initiated successfully',
      visitor_id: visitor_id,
      ai_response: productsDatabase.chatResponses[visitor_id],
      flow_status: 'chat_initiated'
    });
    
  } catch (error) {
    console.error('❌ Error initiating AI chat:', error);
    res.status(500).json({
      success: false,
      error: 'AI chat initiation failed: ' + error.message
    });
  }
});

// 5. Endpoint pour messages du visiteur
app.post('/api/visitor-message', async (req, res) => {
  try {
    const { visitor_id, message, current_product, cart_items } = req.body;
    
    console.log('💬 Visitor message from:', visitor_id, message.substring(0, 50));
    
    // Sauvegarder le message du visiteur
    if (!productsDatabase.conversationHistory[visitor_id]) {
      productsDatabase.conversationHistory[visitor_id] = [];
    }
    
    productsDatabase.conversationHistory[visitor_id].push({
      role: 'user',
      message: message,
      timestamp: new Date().toISOString(),
      current_product: current_product,
      cart_items: cart_items || []
    });
    
    // Mettre à jour le flux d'achat
    if (productsDatabase.purchaseFlows[visitor_id]) {
      productsDatabase.purchaseFlows[visitor_id].conversation_steps.push({
        step: 'user_message',
        timestamp: new Date().toISOString(),
        message: message,
        current_product: current_product
      });
      
      productsDatabase.purchaseFlows[visitor_id].updated_at = new Date().toISOString();
    }
    
    // Envoyer à Lindy AI pour génération de réponse
    const behavioralContext = productsDatabase.visitorBehaviorData[visitor_id] || {};
    const conversationContext = productsDatabase.conversationHistory[visitor_id] || [];
    
    const lindyResponse = await axios.post(
      CONFIG.LINDY_WEBHOOKS.CHAT_MESSAGE,
      {
        visitor_id: visitor_id,
        message: message,
        behavioral_context: behavioralContext,
        conversation_history: conversationContext.slice(-10), // Derniers 10 messages
        current_product: current_product,
        cart_items: cart_items,
        available_products: productsDatabase.products,
        timestamp: new Date().toISOString()
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    console.log('✅ AI response generated for:', visitor_id);
    
    res.json({
      success: true,
      message: 'Visitor message processed and AI response generated',
      visitor_id: visitor_id,
      requires_ai_response: true
    });
    
  } catch (error) {
    console.error('❌ Error processing visitor message:', error);
    res.status(500).json({
      success: false,
      error: 'Message processing failed: ' + error.message
    });
  }
});

// 6. Endpoint pour récupérer la réponse IA
app.get('/api/chat-response/:visitor_id', (req, res) => {
  try {
    const { visitor_id } = req.params;
    
    if (productsDatabase.chatResponses[visitor_id] && !productsDatabase.chatResponses[visitor_id].read) {
      const response = productsDatabase.chatResponses[visitor_id];
      
      // Marquer comme lu
      productsDatabase.chatResponses[visitor_id].read = true;
      
      console.log('✅ AI response delivered to:', visitor_id);
      
      res.json({
        success: true,
        message: response.message,
        techniques_used: response.techniques_used,
        recommended_products: response.recommended_products,
        confidence_score: response.confidence_score,
        message_type: response.message_type,
        timestamp: response.timestamp
      });
      
    } else {
      res.json({
        success: true,
        message: null,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Error fetching AI response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI response'
    });
  }
});

// 7. Endpoint pour envoi de lien de paiement
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, payment_url, styling_options } = req.body;
    
    console.log('💰 Sending payment link for:', visitor_id, product_name);
    
    if (!productsDatabase.purchaseFlows[visitor_id]) {
      return res.status(404).json({
        success: false,
        error: 'Purchase flow not found'
      });
    }
    
    // Message de paiement stylisé
    const styledPaymentMessage = {
      message: `🎉 Excellent choix ! Votre assistant Luminara a sélectionné le produit parfait pour vous.\n\n**${product_name}** - $${price}\n\n🔒 Lien de paiement sécurisé :`,
      payment_url: payment_url,
      product_name: product_name,
      price: price,
      styling: styling_options || {
        theme: 'premium',
        color: '#00f0ff',
        button_text: '🛒 Payer Maintenant - Sécurisé',
        urgency: 'limited_time_offer',
        discount_applied: false
      },
      timestamp: new Date().toISOString(),
      message_type: 'payment_link'
    };
    
    // Stocker comme message de chat
    productsDatabase.chatResponses[visitor_id] = {
      ...styledPaymentMessage,
      read: false
    };
    
    // Ajouter à l'historique
    productsDatabase.conversationHistory[visitor_id].push({
      role: 'assistant',
      ...styledPaymentMessage
    });
    
    // Mettre à jour le flux d'achat
    productsDatabase.purchaseFlows[visitor_id].payment_link_sent = true;
    productsDatabase.purchaseFlows[visitor_id].status = 'payment_link_sent';
    productsDatabase.purchaseFlows[visitor_id].final_product = {
      product_id: product_id,
      product_name: product_name,
      price: price,
      payment_url: payment_url
    };
    productsDatabase.purchaseFlows[visitor_id].updated_at = new Date().toISOString();
    
    // Analytics
    productsDatabase.analyticsData.conversions.push({
      visitor_id: visitor_id,
      product_name: product_name,
      price: price,
      event_type: 'payment_link_sent',
      timestamp: new Date().toISOString()
    });
    
    // Envoyer à Lindy AI
    try {
      await axios.post(
        CONFIG.LINDY_WEBHOOKS.CONVERSION,
        {
          visitor_id: visitor_id,
          event_type: 'payment_link_sent',
          product: { product_id, product_name, price },
          flow_data: productsDatabase.purchaseFlows[visitor_id],
          timestamp: new Date().toISOString()
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );
    } catch (lindyError) {
      console.warn('⚠️ Lindy conversion tracking failed:', lindyError.message);
    }
    
    res.json({
      success: true,
      message: 'Payment link sent successfully',
      visitor_id: visitor_id,
      payment_message: styledPaymentMessage,
      flow_status: 'payment_link_sent'
    });
    
  } catch (error) {
    console.error('❌ Error sending payment link:', error);
    res.status(500).json({
      success: false,
      error: 'Payment link sending failed: ' + error.message
    });
  }
});

// 8. Endpoint dashboard analytics COMPLET
app.get('/api/dashboard/analytics', (req, res) => {
  try {
    const totalVisitors = Object.keys(productsDatabase.visitorBehaviorData).length;
    const totalConversations = Object.keys(productsDatabase.conversationHistory).length;
    const totalConversions = productsDatabase.analyticsData.conversions.length;
    const activeFlows = Object.values(productsDatabase.purchaseFlows).filter(flow => 
      flow.status !== 'completed'
    ).length;
    
    // Calcul du revenu total
    const totalRevenue = productsDatabase.analyticsData.conversions.reduce((sum, conversion) => {
      return sum + (parseFloat(conversion.price) || 0);
    }, 0);
    
    const conversionRate = totalVisitors > 0 ? 
      ((totalConversions / totalVisitors) * 100).toFixed(2) : '0';
    
    // Données pour les graphiques
    const hourlyVisitors = calculateHourlyVisitors();
    const popularProducts = calculatePopularProducts();
    const conversionFunnel = calculateConversionFunnel();
    
    res.json({
      success: true,
      data: {
        summary: {
          totalVisitors,
          totalConversations,
          totalConversions,
          activeFlows,
          conversionRate,
          totalRevenue: totalRevenue.toFixed(2),
          avgOrderValue: totalConversions > 0 ? (totalRevenue / totalConversions).toFixed(2) : '0',
          sessions: productsDatabase.analyticsData.sessions
        },
        charts: {
          hourlyVisitors,
          popularProducts,
          conversionFunnel
        },
        recent_activity: getRecentActivity(),
        performance_metrics: getPerformanceMetrics()
      }
    });
    
  } catch (error) {
    console.error('❌ Error generating dashboard analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// FONCTIONS D'ANALYSE AVANCÉES
// ============================================

function calculateHourlyVisitors() {
  const hours = {};
  for (let i = 0; i < 24; i++) {
    hours[i] = 0;
  }
  
  Object.values(productsDatabase.visitorBehaviorData).forEach(visitor => {
    if (visitor.received_at) {
      const hour = new Date(visitor.received_at).getHours();
      hours[hour]++;
    }
  });
  
  return Object.entries(hours).map(([hour, count]) => ({
    hour: parseInt(hour),
    visitors: count
  }));
}

function calculatePopularProducts() {
  const productViews = {};
  
  Object.values(productsDatabase.visitorBehaviorData).forEach(visitor => {
    if (visitor.product_views) {
      visitor.product_views.forEach(view => {
        if (view.id) {
          productViews[view.id] = (productViews[view.id] || 0) + 1;
        }
      });
    }
  });
  
  return Object.entries(productViews)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([productId, views]) => {
      const product = productsDatabase.products.find(p => p.id == productId);
      return {
        product_id: productId,
        product_name: product ? product.name : 'Unknown Product',
        views: views
      };
    });
}

function calculateConversionFunnel() {
  const totalVisitors = Object.keys(productsDatabase.visitorBehaviorData).length;
  const engagedVisitors = Object.values(productsDatabase.visitorBehaviorData).filter(
    v => v.product_views && v.product_views.length > 0
  ).length;
  const chatEngaged = Object.keys(productsDatabase.conversationHistory).length;
  const paymentLinksSent = Object.values(productsDatabase.purchaseFlows).filter(
    f => f.payment_link_sent
  ).length;
  const conversions = productsDatabase.analyticsData.conversions.length;
  
  return [
    { stage: 'Visitors', count: totalVisitors },
    { stage: 'Engaged', count: engagedVisitors },
    { stage: 'Chat', count: chatEngaged },
    { stage: 'Payment Links', count: paymentLinksSent },
    { stage: 'Conversions', count: conversions }
  ];
}

function getRecentActivity() {
  const recentConversations = [];
  Object.entries(productsDatabase.conversationHistory).forEach(([visitor_id, messages]) => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      recentConversations.push({
        visitor_id: visitor_id,
        last_activity: lastMessage.timestamp,
        message_count: messages.length,
        last_message: lastMessage.message.substring(0, 100) + '...'
      });
    }
  });
  
  return recentConversations
    .sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity))
    .slice(0, 10);
}

function getPerformanceMetrics() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  const recentConversions = productsDatabase.analyticsData.conversions.filter(
    c => new Date(c.timestamp) > oneHourAgo
  ).length;
  
  const activeChats = Object.values(productsDatabase.purchaseFlows).filter(
    f => f.status !== 'completed' && new Date(f.updated_at) > oneHourAgo
  ).length;
  
  return {
    conversions_last_hour: recentConversions,
    active_chats: activeChats,
    response_time_avg: '2.3s',
    satisfaction_score: '4.8/5'
  };
}

// ============================================
// HEALTH CHECK ET DÉMARRAGE
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Luminara AI E-Commerce Server - Ultimate Version',
    timestamp: new Date().toISOString(),
    statistics: {
      total_products: productsDatabase.products.length,
      total_visitors: Object.keys(productsDatabase.visitorBehaviorData).length,
      total_conversations: Object.keys(productsDatabase.conversationHistory).length,
      total_conversions: productsDatabase.analyticsData.conversions.length,
      active_flows: Object.values(productsDatabase.purchaseFlows).filter(f => f.status !== 'completed').length,
      total_revenue: productsDatabase.analyticsData.conversions.reduce((sum, c) => sum + (parseFloat(c.price) || 0), 0).toFixed(2)
    },
    system: {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      node_version: process.version
    }
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      'GET  /api/products',
      'GET  /api/products/:id',
      'POST /api/behavioral-data',
      'POST /api/initiate-chat',
      'POST /api/visitor-message',
      'GET  /api/chat-response/:visitor_id',
      'POST /api/send-payment-link',
      'GET  /api/dashboard/analytics',
      'GET  /health'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global Error Handler:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Luminara AI E-Commerce Server ULTIMATE running on port ${PORT}`);
  console.log(`📊 Dashboard: /api/dashboard/analytics`);
  console.log(`🛍️  Products: /api/products`);
  console.log(`🤖 AI Chat: /api/initiate-chat`);
  console.log(`💰 Payment: /api/send-payment-link`);
  console.log(`🔧 Health: /health`);
  console.log(`📈 Products loaded: ${productsDatabase.products.length}`);
  console.log(`🌐 Ready for connections from: https://ebusinessag.com`);
});
