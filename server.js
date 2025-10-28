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
  CHAT_MESSAGE: 'ccfc2755eedd30d02f4ec096517c06e95cc25e5ad4afe8de4f53ee1d3d30299a',
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
// BASE DE DONNÉES PRODUITS COMPLÈTE (50 items)
// ============================================
const allProducts = [
  { id: 1, name: "Quantum Earbuds Pro", price: 249, category: "audio", description: "Immersive sound with adaptive noise cancellation and 30-hour battery life.", image: "https://ebusinessag.com/quantum-earbuds-pro.jpeg" },
  { id: 2, name: "Nexus Smart Watch", price: 399, category: "wearables", description: "Advanced health monitoring with ECG and 7-day battery life.", image: "https://ebusinessag.com/nexus-smart-watch.jpeg" },
  { id: 3, name: "Aura AR Glasses", price: 599, category: "wearables", description: "Augmented reality display with voice control and all-day comfort.", image: "https://ebusinessag.com/aura-ar-glasses.jpeg" },
  { id: 4, name: "Lumina Wireless Charger", price: 89, category: "accessories", description: "Fast wireless charging with adaptive power delivery up to 30W.", image: "https://ebusinessag.com/lumina-wireless-charger.jpeg" },
  { id: 5, name: "Nova Smart Speaker", price: 199, category: "audio", description: "360-degree immersive sound with voice assistant integration.", image: "https://ebusinessag.com/nova-smart-speaker.jpeg" },
  { id: 6, name: "Pulse Fitness Tracker", price: 149, category: "wearables", description: "Advanced fitness tracking with built-in GPS and heart rate monitoring.", image: "https://ebusinessag.com/pulse-fitness-tracker.jpeg" },
  { id: 7, name: "Echo Wireless Earbuds", price: 179, category: "audio", description: "Crystal clear audio with 24-hour battery life and premium comfort.", image: "https://ebusinessag.com/echo-wireless-earbuds.jpeg" },
  { id: 8, name: "Orbit Smart Ring", price: 299, category: "wearables", description: "Discreet health monitoring and gesture control in elegant titanium.", image: "https://ebusinessag.com/orbit-smart-ring.jpeg" },
  { id: 9, name: "Zen Meditation Headband", price: 249, category: "wellness", description: "Brainwave monitoring for enhanced meditation and focus.", image: "https://ebusinessag.com/zen-meditation-headband.jpeg" },
  { id: 10, name: "Apex Gaming Headset", price: 349, category: "audio", description: "Immersive 3D audio with noise-canceling microphone.", image: "https://ebusinessag.com/apex-gaming-headset.jpeg" },
  { id: 11, name: "Vista Smart Glasses", price: 449, category: "wearables", description: "Heads-up display with navigation, notifications, and augmented reality overlays.", image: "https://ebusinessag.com/vista-smart-glasses.jpeg" },
  { id: 12, name: "Bloom Smart Planter", price: 129, category: "smart-home", description: "Automated plant care with soil moisture monitoring and automatic watering.", image: "https://ebusinessag.com/bloom-smart-planter.jpeg" },
  { id: 13, name: "Fusion Power Bank", price: 79, category: "accessories", description: "20,000mAh capacity with 65W fast charging and solar backup capability.", image: "https://ebusinessag.com/fusion-power-bank.jpeg" },
  { id: 14, name: "Harmony Sleep Mask", price: 159, category: "wellness", description: "Smart sleep tracking with gentle wake-up light therapy.", image: "https://ebusinessag.com/harmony-sleep-mask.jpeg" },
  { id: 15, name: "Sonic Bluetooth Speaker", price: 129, category: "audio", description: "Portable 360-degree sound with 20-hour battery life and IP67 waterproof rating.", image: "https://ebusinessag.com/sonic-bluetooth-speaker.jpeg" },
  { id: 16, name: "Infinity Smart Mirror", price: 499, category: "smart-home", description: "Interactive mirror with weather, news, calendar, and fitness coaching.", image: "https://ebusinessag.com/infinity-smart-mirror.jpeg" },
  { id: 17, name: "Quantum Phone Case", price: 59, category: "accessories", description: "Military-grade drop protection with built-in 5000mAh battery and card storage.", image: "https://ebusinessag.com/quantum-phone-case.jpeg" },
  { id: 18, name: "Nebula Smart Lamp", price: 89, category: "smart-home", description: "Adjustable color temperature and brightness with circadian rhythm sync.", image: "https://ebusinessag.com/nebula-smart-lamp.jpeg" },
  { id: 19, name: "Pulse Smart Scale", price: 99, category: "wellness", description: "Comprehensive body composition analysis with weight, BMI, body fat, and muscle mass tracking.", image: "https://ebusinessag.com/pulse-smart-scale.jpeg" },
  { id: 20, name: "Echo Pro Headphones", price: 299, category: "audio", description: "Studio-quality sound with active noise cancellation and 40-hour battery life.", image: "https://ebusinessag.com/echo-pro-headphones.jpeg" },
  { id: 21, name: "Lumina Desk Lamp", price: 119, category: "office", description: "Adjustable brightness and color temperature with task lighting optimization.", image: "https://ebusinessag.com/lumina-desk-lamp.jpeg" },
  { id: 22, name: "Nova Smart Thermostat", price: 179, category: "smart-home", description: "AI-powered climate control with energy savings up to 23%.", image: "https://ebusinessag.com/nova-smart-thermostat.jpeg" },
  { id: 23, name: "Orbit Smart Wallet", price: 89, category: "accessories", description: "RFID protection with item tracking, battery backup, and digital card storage.", image: "https://ebusinessag.com/orbit-smart-wallet.jpeg" },
  { id: 24, name: "Zen Air Purifier", price: 249, category: "smart-home", description: "Medical-grade HEPA filtration with real-time air quality monitoring.", image: "https://ebusinessag.com/zen-air-purifier.jpeg" },
  { id: 25, name: "Apex Gaming Mouse", price: 129, category: "gaming", description: "Precision optical sensor with customizable RGB lighting and programmable buttons.", image: "https://ebusinessag.com/apex-gaming-mouse.jpeg" },
  { id: 26, name: "Vista Security Camera", price: 199, category: "security", description: "4K resolution with night vision, motion detection, and two-way audio.", image: "https://ebusinessag.com/vista-security-camera.jpeg" },
  { id: 27, name: "Bloom Smart Water Bottle", price: 69, category: "wellness", description: "Tracks hydration and reminds you to drink with gentle LED notifications.", image: "https://ebusinessag.com/bloom-smart-water-bottle.jpeg" },
  { id: 28, name: "Fusion Laptop Stand", price: 79, category: "office", description: "Ergonomic aluminum stand with integrated cooling fans and cable management.", image: "https://ebusinessag.com/fusion-laptop-stand.jpeg" },
  { id: 29, name: "Harmony Meditation Cushion", price: 89, category: "wellness", description: "Memory foam cushion with posture support and alignment guides.", image: "https://ebusinessag.com/harmony-meditation-cushion.jpeg" },
  { id: 30, name: "Sonic Shower Speaker", price: 59, category: "audio", description: "Waterproof Bluetooth speaker with powerful suction cup mount and 10-hour battery life.", image: "https://ebusinessag.com/sonic-shower-speaker.jpeg" },
  { id: 31, name: "Infinity Smart Clock", price: 149, category: "smart-home", description: "Ambient display with weather, calendar, news, and smart home controls.", image: "https://ebusinessag.com/infinity-smart-clock.jpeg" },
  { id: 32, name: "Quantum USB-C Hub", price: 69, category: "accessories", description: "8-in-1 hub with HDMI 4K, USB 3.1, SD card, and 100W power delivery.", image: "https://ebusinessag.com/quantum-usb-c-hub.jpeg" },
  { id: 33, name: "Nebula Projector", price: 399, category: "home-entertainment", description: "Portable 1080p projector with built-in speakers and 4-hour battery life.", image: "https://ebusinessag.com/nebula-projector.jpeg" },
  { id: 34, name: "Pulse Heart Rate Monitor", price: 79, category: "wearables", description: "Chest strap monitor with smartphone connectivity and advanced analytics.", image: "https://ebusinessag.com/pulse-heart-rate-monitor.jpeg" },
  { id: 35, name: "Echo Studio Microphone", price: 199, category: "audio", description: "Professional condenser microphone with USB connectivity and real-time monitoring.", image: "https://ebusinessag.com/echo-studio-microphone.jpeg" },
  { id: 36, name: "Lumina Wireless Keyboard", price: 129, category: "office", description: "Mechanical keys with customizable RGB backlighting and multi-device connectivity.", image: "https://ebusinessag.com/lumina-wireless-keyboard.jpeg" },
  { id: 37, name: "Nova Smart Doorbell", price: 159, category: "security", description: "HD video doorbell with two-way audio, motion detection, and cloud recording.", image: "https://ebusinessag.com/nova-smart-doorbell.jpeg" },
  { id: 38, name: "Orbit GPS Tracker", price: 99, category: "security", description: "Real-time location tracking with geofencing alerts and 30-day battery life.", image: "https://ebusinessag.com/orbit-gps-tracker.jpeg" },
  { id: 39, name: "Zen Yoga Mat", price: 79, category: "wellness", description: "Eco-friendly non-slip mat with alignment guides and carrying strap.", image: "https://ebusinessag.com/zen-yoga-mat.jpeg" },
  { id: 40, name: "Apex Mechanical Keyboard", price: 159, category: "gaming", description: "Tactile mechanical switches with customizable backlighting and programmable macros.", image: "https://ebusinessag.com/apex-mechanical-keyboard.jpeg" },
  { id: 41, name: "Vista Smart Lock", price: 249, category: "security", description: "Keyless entry with fingerprint, PIN code, and app control.", image: "https://ebusinessag.com/vista-smart-lock.jpeg" },
  { id: 42, name: "Bloom Smart Garden", price: 199, category: "smart-home", description: "Indoor hydroponic system with full-spectrum LED grow lights.", image: "https://ebusinessag.com/bloom-smart-garden.jpeg" },
  { id: 43, name: "Fusion Travel Adapter", price: 49, category: "accessories", description: "Universal travel adapter with USB-C PD charging and surge protection.", image: "https://ebusinessag.com/fusion-travel-adapter.jpeg" },
  { id: 44, name: "Harmony Sleep Tracker", price: 129, category: "wellness", description: "Non-wearable sleep monitoring with detailed analytics and personalized recommendations.", image: "https://ebusinessag.com/harmony-sleep-tracker.jpeg" },
  { id: 45, name: "Sonic Bass Headphones", price: 229, category: "audio", description: "Deep bass response with comfortable over-ear design and 30-hour battery life.", image: "https://ebusinessag.com/sonic-bass-headphones.jpeg" },
  { id: 46, name: "Infinity Smart Display", price: 299, category: "smart-home", description: "10-inch touchscreen with video calling, smart home control, and photo frame mode.", image: "https://ebusinessag.com/infinity-smart-display.jpeg" },
  { id: 47, name: "Quantum Phone Stand", price: 39, category: "accessories", description: "Adjustable aluminum stand with wireless charging and cable management.", image: "https://ebusinessag.com/quantum-phone-stand.jpeg" },
  { id: 48, name: "Nebula Smart Bulb", price: 29, category: "smart-home", description: "Full color spectrum with millions of colors and tunable white light.", image: "https://ebusinessag.com/nebula-smart-bulb.jpeg" },
  { id: 49, name: "Pulse Running Watch", price: 249, category: "wearables", description: "GPS running watch with advanced metrics, coaching, and 2-week battery life.", image: "https://ebusinessag.com/pulse-running-watch.jpeg" },
  { id: 50, name: "Echo Wireless Charger Pad", price: 49, category: "accessories", description: "Fast wireless charging with intelligent cooling fan and foreign object detection.", image: "https://ebusinessag.com/echo-wireless-charger-pad.jpeg" }
];

// ============================================
// STOCKAGE DES DONNÉES (EN MÉMOIRE)
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

    // Envoyer à Lindy AI pour analyse comportementale (fire-and-forget but await to catch errors)
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

// [3] ENDPOINT: GET CHAT RESPONSE (For Frontend) - CORRIGÉ
app.get('/api/chat-response/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  if (chatResponses[visitor_id] && !chatResponses[visitor_id].read) {
    const response = chatResponses[visitor_id];
    chatResponses[visitor_id].read = true;

    // Si un produit de paiement est associé, générer un lien de paiement
    let payment_data = null;
    if (response.payment_product) {
      const product = { ...response.payment_product };

      // S'assurer que l'image a le bon chemin (URL complet si nécessaire)
      if (product.image && !product.image.startsWith('http')) {
        product.image = `https://ebusinessag.com/${product.image}`;
      }

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

// [7] ENDPOINT: SEND PAYMENT LINK - CORRIGÉ (recherche produit dans allProducts + fallback image + track conversion)
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, description } = req.body;

    console.log('💰 Sending payment link for:', visitor_id, product_name);

    // Trouver le produit dans la base de données pour obtenir l'image (si product_id fourni)
    const product = allProducts.find(p => p.id == product_id) || {
      id: product_id || `p_${Date.now()}`,
      name: product_name,
      price: price,
      description: description,
      image: product_name ? `https://ebusinessag.com/${product_name.toLowerCase().replace(/\s+/g, '-')}.jpeg` : (req.body.image || null)
    };

    // Construire les données du panier
    const cartData = [{
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }];

    // Construire l'URL de paiement
    const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true`;

    // Stocker comme message de chat avec produit de paiement
    const productInfo = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    };

    chatResponses[visitor_id] = {
      message: `🎉 **Excellent choix !** Votre produit ${product.name} est prêt. \n\n**Prix :** $${product.price}\n\nCliquez sur le bouton ci-dessous pour procéder au paiement sécurisé.`,
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
      message: `🎉 **Excellent choix !** Votre produit ${product.name} est prêt. \n\n**Prix :** $${product.price}\n\nCliquez sur le bouton ci-dessous pour procéder au paiement sécurisé.`,
      payment_product: productInfo,
      timestamp: new Date().toISOString(),
      message_type: 'payment_link'
    });

    // Track conversion via Lindy webhook (non-blocking but awaited to check status)
    try {
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
    } catch (webhookErr) {
      console.warn('⚠️ Lindy conversion webhook failed (non-fatal):', webhookErr.message);
      // continue even if webhook fails
    }

    res.json({
      success: true,
      message: 'Payment link sent successfully',
      visitor_id: visitor_id,
      payment_url: paymentUrl,
      product: productInfo
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
