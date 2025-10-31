// ============================================
// LUMINARA EXPRESS SERVER - SYSTÈME COMPLET AVEC 50 PRODUITS
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
  BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/fbef720c-ecf7-4b12-8e47-856180270d1a',
  CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/883294d1-ed6a-4f63-b86a-48b18be767c9',
  CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/00563e8a-fb09-4178-b6e2-4b209d0a7443',
  PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/006bbc55-d671-4e01-844d-d19a8c982533'
};

const LINDY_WEBHOOK_TOKENS = {
  BEHAVIORAL_ANALYSIS: 'f9c4be051301b028bfbfb3f780c2755211dbf787023bc9bf21b6bfea721d0728',
  CHAT_MESSAGE: 'c25d51a209f42a9db55ee1abb919d160d85c28213e8be023b5ad0a5b97383dee',
  CONVERSION: '045437d89e4070f912c533780583a0bde274d30bc26e5bae394323550a100c96',
  PRODUCT_SYNC: '027947b3e4d62b6c89528e8df46e6bd6b22dd0ffb4927b0b721b13eabfdf749e'
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
// FONCTION POUR CORRIGER LES URLS D'IMAGES
// ============================================
function fixProductImageUrl(product) {
  if (!product.image) {
    const imageName = product.name.toLowerCase().replace(/\s+/g, '-') + '.jpeg';
    return `https://ebusinessag.com/${imageName}`;
  }
  
  if (product.image.startsWith('http')) {
    return product.image;
  }
  
  if (product.image.includes('...') || product.image === 'https://...') {
    const imageName = product.name.toLowerCase().replace(/\s+/g, '-') + '.jpeg';
    return `https://ebusinessag.com/${imageName}`;
  }
  
  return `https://ebusinessag.com/${product.image}`;
}

// ============================================
// BASE DE DONNÉES PRODUITS COMPLÈTE (50 PRODUITS)
// ============================================
const allProducts = [
  { id: 1, name: "Quantum Earbuds Pro", price: 249, category: "audio", description: "Immersive sound with adaptive noise cancellation and 30-hour battery life. Features spatial audio technology and wireless charging case with premium aluminum finish.", image: "quantum-earbuds-pro.jpeg" },
  { id: 2, name: "Nexus Smart Watch", price: 399, category: "wearable", description: "Advanced health monitoring with ECG, blood oxygen tracking, and seamless smartphone connectivity. 7-day battery life with aerospace-grade titanium casing.", image: "nexus-smart-watch.jpeg" },
  { id: 3, name: "Aura AR Glasses", price: 599, category: "wearable", description: "Augmented reality display with voice control and all-day comfort. Projects holographic interfaces directly into your field of view with crystal-clear optics.", image: "aura-ar-glasses.jpeg" },
  { id: 4, name: "Lumina Wireless Charger", price: 89, category: "accessory", description: "Fast wireless charging with adaptive power delivery up to 30W. Compatible with all Qi-enabled devices and features intelligent temperature control.", image: "lumina-wireless-charger.jpeg" },
  { id: 5, name: "Nova Smart Speaker", price: 199, category: "audio", description: "360-degree immersive sound with voice assistant integration. Controls your entire smart home ecosystem with precision voice recognition.", image: "nova-smart-speaker.jpeg" },
  { id: 6, name: "Pulse Fitness Tracker", price: 149, category: "wearable", description: "Advanced fitness tracking with built-in GPS, heart rate monitoring, and sleep analysis. Waterproof design for swimming and all-weather activities.", image: "pulse-fitness-tracker.jpeg" },
  { id: 7, name: "Echo Wireless Earbuds", price: 179, category: "audio", description: "Crystal clear audio with 24-hour battery life and premium comfort. Perfect for calls, music, and voice assistant access on the go.", image: "echo-wireless-earbuds.jpeg" },
  { id: 8, name: "Orbit Smart Ring", price: 299, category: "wearable", description: "Discreet health monitoring and gesture control in an elegant titanium band. Tracks sleep, activity, and vital signs with medical-grade accuracy.", image: "orbit-smart-ring.jpeg" },
  { id: 9, name: "Zen Meditation Headband", price: 249, category: "wellness", description: "Brainwave monitoring for enhanced meditation and focus. Provides real-time feedback and personalized coaching through the companion app.", image: "zen-meditation-headband.jpeg" },
  { id: 10, name: "Apex Gaming Headset", price: 349, category: "audio", description: "Immersive 3D audio with noise-canceling microphone and memory foam ear cushions. Designed for competitive gaming with tournament-grade audio precision.", image: "apex-gaming-headset.jpeg" },
  { id: 11, name: "Vista Smart Glasses", price: 449, category: "wearable", description: "Heads-up display with navigation, notifications, and augmented reality overlays. Lightweight carbon fiber frame for all-day comfort.", image: "vista-smart-glasses.jpeg" },
  { id: 12, name: "Bloom Smart Planter", price: 129, category: "smart home", description: "Automated plant care with soil moisture monitoring, automatic watering, and growth tracking. Perfect for indoor gardening enthusiasts.", image: "bloom-smart-planter.jpeg" },
  { id: 13, name: "Fusion Power Bank", price: 79, category: "accessory", description: "20,000mAh capacity with 65W fast charging and solar backup capability. Charges multiple devices simultaneously with intelligent power distribution.", image: "fusion-power-bank.jpeg" },
  { id: 14, name: "Harmony Sleep Mask", price: 159, category: "wellness", description: "Smart sleep tracking with gentle wake-up light therapy and blue light blocking. Blocks distractions for deeper, more restful sleep.", image: "harmony-sleep-mask.jpeg" },
  { id: 15, name: "Sonic Bluetooth Speaker", price: 129, category: "audio", description: "Portable 360-degree sound with 20-hour battery life and IP67 waterproof rating. Perfect for outdoor adventures and poolside entertainment.", image: "sonic-bluetooth-speaker.jpeg" },
  { id: 16, name: "Infinity Smart Mirror", price: 499, category: "smart home", description: "Interactive mirror with weather, news, calendar, and fitness coaching. Voice-controlled with customizable widgets and ambient lighting.", image: "infinity-smart-mirror.jpeg" },
  { id: 17, name: "Quantum Phone Case", price: 59, category: "accessory", description: "Military-grade drop protection with built-in 5000mAh battery and card storage. Wireless charging compatible with premium materials.", image: "quantum-phone-case.jpeg" },
  { id: 18, name: "Nebula Smart Lamp", price: 89, category: "smart home", description: "Adjustable color temperature and brightness with circadian rhythm sync. Features USB charging ports and wireless charging pad.", image: "nebula-smart-lamp.jpeg" },
  { id: 19, name: "Pulse Smart Scale", price: 99, category: "wellness", description: "Comprehensive body composition analysis with weight, BMI, body fat, and muscle mass tracking. Syncs with all major health apps.", image: "pulse-smart-scale.jpeg" },
  { id: 20, name: "Echo Pro Headphones", price: 299, category: "audio", description: "Studio-quality sound with active noise cancellation and 40-hour battery life. Premium memory foam ear cushions for extended comfort.", image: "echo-pro-headphones.jpeg" },
  { id: 21, name: "Lumina Desk Lamp", price: 119, category: "smart home", description: "Adjustable brightness and color temperature with task lighting optimization. Features USB-C charging and wireless charging pad.", image: "lumina-desk-lamp.jpeg" },
  { id: 22, name: "Nova Smart Thermostat", price: 179, category: "smart home", description: "AI-powered climate control with energy savings up to 23%. Learns your preferences and automatically adjusts for optimal comfort.", image: "nova-smart-thermostat.jpeg" },
  { id: 23, name: "Orbit Smart Wallet", price: 89, category: "accessory", description: "RFID protection with item tracking, battery backup, and digital card storage. Slim design with premium vegan leather finish.", image: "orbit-smart-wallet.jpeg" },
  { id: 24, name: "Zen Air Purifier", price: 249, category: "wellness", description: "Medical-grade HEPA filtration with real-time air quality monitoring. Quiet operation with smart scheduling and filter replacement alerts.", image: "zen-air-purifier.jpeg" },
  { id: 25, name: "Apex Gaming Mouse", price: 129, category: "accessory", description: "Precision optical sensor with customizable RGB lighting and programmable buttons. Ergonomic design for extended gaming sessions.", image: "apex-gaming-mouse.jpeg" },
  { id: 26, name: "Vista Security Camera", price: 199, category: "smart home", description: "4K resolution with night vision, motion detection, and two-way audio. Cloud storage with local backup and AI-powered person detection.", image: "vista-security-camera.jpeg" },
  { id: 27, name: "Bloom Smart Water Bottle", price: 69, category: "wellness", description: "Tracks hydration and reminds you to drink with gentle LED notifications. Temperature control and leak-proof design with eco-friendly materials.", image: "bloom-smart-water-bottle.jpeg" },
  { id: 28, name: "Fusion Laptop Stand", price: 79, category: "accessory", description: "Ergonomic aluminum stand with integrated cooling fans and cable management. Adjustable height and angle for perfect viewing.", image: "fusion-laptop-stand.jpeg" },
  { id: 29, name: "Harmony Meditation Cushion", price: 89, category: "wellness", description: "Memory foam cushion with posture support and alignment guides. Machine washable cover with sustainable, eco-friendly materials.", image: "harmony-meditation-cushion.jpeg" },
  { id: 30, name: "Sonic Shower Speaker", price: 59, category: "audio", description: "Waterproof Bluetooth speaker with powerful suction cup mount and 10-hour battery life. Crystal clear audio even in steamy environments.", image: "sonic-shower-speaker.jpeg" },
  { id: 31, name: "Infinity Smart Clock", price: 149, category: "smart home", description: "Ambient display with weather, calendar, news, and smart home controls. Wireless charging base included with customizable wake-up routines.", image: "infinity-smart-clock.jpeg" },
  { id: 32, name: "Quantum USB-C Hub", price: 69, category: "accessory", description: "8-in-1 hub with HDMI 4K, USB 3.1, SD card, and 100W power delivery. Premium aluminum enclosure with heat dissipation.", image: "quantum-usb-c-hub.jpeg" },
  { id: 33, name: "Nebula Projector", price: 399, category: "entertainment", description: "Portable 1080p projector with built-in speakers and 4-hour battery life. Wireless casting from all devices with auto-focus technology.", image: "nebula-projector.jpeg" },
  { id: 34, name: "Pulse Heart Rate Monitor", price: 79, category: "wellness", description: "Chest strap monitor with smartphone connectivity and advanced analytics. Accurate tracking for serious athletes and fitness enthusiasts.", image: "pulse-heart-rate-monitor.jpeg" },
  { id: 35, name: "Echo Studio Microphone", price: 199, category: "audio", description: "Professional condenser microphone with USB connectivity and real-time monitoring. Perfect for streaming, podcasting, and recording.", image: "echo-studio-microphone.jpeg" },
  { id: 36, name: "Lumina Wireless Keyboard", price: 129, category: "accessory", description: "Mechanical keys with customizable RGB backlighting and multi-device connectivity. 6-month battery life with premium aluminum frame.", image: "lumina-wireless-keyboard.jpeg" },
  { id: 37, name: "Nova Smart Doorbell", price: 159, category: "smart home", description: "HD video doorbell with two-way audio, motion detection, and cloud recording. Easy DIY installation with existing doorbell wiring.", image: "nova-smart-doorbell.jpeg" },
  { id: 38, name: "Orbit GPS Tracker", price: 99, category: "accessory", description: "Real-time location tracking with geofencing alerts and 30-day battery life. Waterproof design for tracking pets, luggage, and valuables.", image: "orbit-gps-tracker.jpeg" },
  { id: 39, name: "Zen Yoga Mat", price: 79, category: "wellness", description: "Eco-friendly non-slip mat with alignment guides and carrying strap. Made from sustainable materials with optimal cushioning.", image: "zen-yoga-mat.jpeg" },
  { id: 40, name: "Apex Mechanical Keyboard", price: 159, category: "accessory", description: "Tactile mechanical switches with customizable backlighting and programmable macros. Aerospace-grade aluminum frame with RGB lighting.", image: "apex-mechanical-keyboard.jpeg" },
  { id: 41, name: "Vista Smart Lock", price: 249, category: "smart home", description: "Keyless entry with fingerprint, PIN code, and app control. Auto-lock feature with guest access and activity monitoring.", image: "vista-smart-lock.jpeg" },
  { id: 42, name: "Bloom Smart Garden", price: 199, category: "smart home", description: "Indoor hydroponic system with full-spectrum LED grow lights. Grows herbs and vegetables year-round with automated care.", image: "bloom-smart-garden.jpeg" },
  { id: 43, name: "Fusion Travel Adapter", price: 49, category: "accessory", description: "Universal travel adapter with USB-C PD charging and surge protection. Works in 150+ countries with compact, foldable design.", image: "fusion-travel-adapter.jpeg" },
  { id: 44, name: "Harmony Sleep Tracker", price: 129, category: "wellness", description: "Non-wearable sleep monitoring with detailed analytics and personalized recommendations. Tracks sleep stages and environmental factors.", image: "harmony-sleep-tracker.jpeg" },
  { id: 45, name: "Sonic Bass Headphones", price: 229, category: "audio", description: "Deep bass response with comfortable over-ear design and 30-hour battery life. Perfect for music lovers who demand premium audio quality.", image: "sonic-bass-headphones.jpeg" },
  { id: 46, name: "Infinity Smart Display", price: 299, category: "smart home", description: "10-inch touchscreen with video calling, smart home control, and photo frame mode. Wall-mountable design with premium fabric finish.", image: "infinity-smart-display.jpeg" },
  { id: 47, name: "Quantum Phone Stand", price: 39, category: "accessory", description: "Adjustable aluminum stand with wireless charging and cable management. Perfect for desk or bedside with premium finish.", image: "quantum-phone-stand.jpeg" },
  { id: 48, name: "Nebula Smart Bulb", price: 29, category: "smart home", description: "Full color spectrum with millions of colors and tunable white light. Voice control with scheduling and music sync capabilities.", image: "nebula-smart-bulb.jpeg" },
  { id: 49, name: "Pulse Running Watch", price: 249, category: "wearable", description: "GPS running watch with advanced metrics, coaching, and 2-week battery life. Tracks performance with precision and durability.", image: "pulse-running-watch.jpeg" },
  { id: 50, name: "Echo Wireless Charger Pad", price: 49, category: "accessory", description: "Fast wireless charging with intelligent cooling fan and foreign object detection. Charges through cases up to 5mm thick with premium finish.", image: "echo-wireless-charger-pad.jpeg" }
];

// Corriger toutes les URLs d'images dans la base de données
allProducts.forEach(product => {
  product.image = fixProductImageUrl(product);
});

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
// ENDPOINTS PRINCIPAUX - FLOW COMPLET CORRIGÉ
// ============================================

// [1] ENDPOINT: RECEIVE BEHAVIORAL DATA
app.post('/api/behavioral-data', async (req, res) => {
  try {
    const behavioralData = req.body;
    const visitorId = behavioralData.visitor_id;

    console.log('📊 Received behavioral data for:', visitorId);

    // Stocker les données
    visitorBehaviorData[visitorId] = {
      ...behavioralData,
      received_at: new Date().toISOString(),
      flow_status: 'behavior_analysis_started'
    };

    processedVisitors[visitorId] = new Date().toISOString();

    // Envoyer à Lindy AI
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

// [2] ENDPOINT: SEND CHAT MESSAGE (From Lindy AI) - VERSION CORRIGÉE
app.post('/api/send-chat-message', (req, res) => {
  try {
    const { visitor_id, message, techniques_used, recommended_products, confidence_score, message_type, payment_product } = req.body;

    console.log(`🤖 AI Chat message for ${visitor_id}:`, message);
    console.log('📦 Payment product received:', payment_product);

    // ✅ CORRECTION CRITIQUE : Réparer l'URL de l'image du produit
    let correctedPaymentProduct = null;
    if (payment_product) {
      correctedPaymentProduct = { ...payment_product };
      
      // CORRIGER L'URL DE L'IMAGE
      correctedPaymentProduct.image = fixProductImageUrl(correctedPaymentProduct);
      
      console.log('✅ Fixed product image URL:', correctedPaymentProduct.image);
    }

    // Stocker la réponse AI
    chatResponses[visitor_id] = {
      message: message,
      techniques_used: techniques_used || [],
      recommended_products: recommended_products || [],
      confidence_score: confidence_score || 0,
      timestamp: new Date().toISOString(),
      read: false,
      message_type: message_type || 'response',
      payment_product: correctedPaymentProduct
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
      payment_product: correctedPaymentProduct
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

// [3] ENDPOINT: GET CHAT RESPONSE (For Frontend) - VERSION CORRIGÉE
app.get('/api/chat-response/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;

  if (chatResponses[visitor_id] && !chatResponses[visitor_id].read) {
    const response = chatResponses[visitor_id];
    chatResponses[visitor_id].read = true;

    // ✅ CORRECTION : Générer le lien de paiement avec URL d'image corrigée
    let payment_data = null;
    if (response.payment_product) {
      const product = { ...response.payment_product };

      // S'assurer que l'image est corrigée
      product.image = fixProductImageUrl(product);

      const cartData = [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: 'Cosmic Black',
        size: 'Standard',
        image: product.image // ✅ URL CORRECTE
      }];

      const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true&visitor_id=${visitor_id}&product_added=true`;

      payment_data = {
        product: product,
        payment_url: paymentUrl,
        cart_data: cartData
      };
    }

    res.json({
      success: true,
      message: response.message,
      techniques_used: response.techniques_used,
      recommended_products: response.recommended_products,
      confidence_score: response.confidence_score,
      timestamp: response.timestamp,
      payment_data: payment_data,
      message_type: response.message_type
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

// [6] ENDPOINT: SEND PAYMENT LINK - VERSION CORRIGÉE
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, description } = req.body;

    console.log('💰 Adding product to cart for:', visitor_id, product_name);

    // Trouver le produit avec URL d'image corrigée
    let product = allProducts.find(p => p.id == product_id);
    if (!product) {
      product = {
        id: product_id,
        name: product_name,
        price: price,
        description: description,
        image: `${product_name.toLowerCase().replace(/\s+/g, '-')}.jpeg`,
        category: 'accessory'
      };
    }

    // ✅ CORRECTION : Utiliser la fonction de correction d'URL
    const productImage = fixProductImageUrl(product);

    // Créer les données du panier
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: 'Cosmic Black',
      size: 'Standard',
      image: productImage // ✅ URL CORRECTE
    };

    const cartData = [cartItem];
    const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true&visitor_id=${visitor_id}&product_added=true`;

    // Préparer la réponse pour le chatbot
    const productInfo = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: productImage // ✅ URL CORRECTE
    };

    // Stocker comme message avec lien de paiement
    chatResponses[visitor_id] = {
      message: `🎉 **Excellent choice!** I've added **${product.name}** to your cart!\n\n**Price:** $${product.price}\n**Ready to checkout?** Click the button below to complete your purchase securely.`,
      payment_product: productInfo,
      payment_url: paymentUrl,
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
      message: `🎉 **Excellent choice!** I've added **${product.name}** to your cart!\n\n**Price:** $${product.price}\n**Ready to checkout?** Click the button below to complete your purchase securely.`,
      payment_product: productInfo,
      payment_url: paymentUrl,
      timestamp: new Date().toISOString(),
      message_type: 'payment_link',
      cart_data: cartData
    });

    console.log('✅ Product added to cart with CORRECT image URL:', productImage);

    res.json({
      success: true,
      message: 'Product successfully added to cart',
      visitor_id: visitor_id,
      payment_url: paymentUrl,
      product: productInfo,
      cart_data: cartData
    });

  } catch (error) {
    console.error('❌ Error adding product to cart:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

// [7] ENDPOINT: GET CONVERSATION HISTORY
app.get('/api/conversation/:visitor_id', (req, res) => {
  const { visitor_id } = req.params;
  
  res.json({
    success: true,
    visitor_id: visitor_id,
    conversation: conversationHistory[visitor_id] || [],
    has_unread: !!(chatResponses[visitor_id] && !chatResponses[visitor_id].read)
  });
});

// [8] ENDPOINT: DASHBOARD ANALYTICS
app.get('/api/dashboard/analytics', (req, res) => {
  try {
    const totalVisitors = Object.keys(visitorBehaviorData).length;
    const totalConversations = Object.keys(conversationHistory).length;
    const totalConversions = analyticsData.conversions.length;
    const conversionRate = totalVisitors > 0 ? ((totalConversions / totalVisitors) * 100).toFixed(2) : '0';

    res.json({
      success: true,
      data: {
        summary: {
          totalVisitors,
          totalConversations,
          totalConversions,
          conversionRate
        },
        recent_visitors: Object.values(visitorBehaviorData).slice(-10),
        recent_conversations: Object.entries(conversationHistory)
          .slice(-10)
          .map(([visitor_id, messages]) => ({
            visitor_id,
            last_message: messages[messages.length - 1]?.message,
            timestamp: messages[messages.length - 1]?.timestamp
          }))
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

// [11] ENDPOINT: FIX PAYMENT PRODUCT IMAGES
app.post('/api/fix-payment-images', async (req, res) => {
  try {
    const { visitor_id, product_id } = req.body;

    console.log('🔧 Fixing payment images for:', visitor_id, product_id);

    // Trouver le produit réel
    const product = allProducts.find(p => p.id == product_id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const productInfo = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: fixProductImageUrl(product) // ✅ URL RÉELLE
    };

    // Mettre à jour la réponse du chatbot
    if (chatResponses[visitor_id]) {
      chatResponses[visitor_id].payment_product = productInfo;
      console.log('✅ Fixed payment product in chat responses');
    }

    res.json({
      success: true,
      message: 'Payment product images fixed successfully',
      product: productInfo,
      fixed_image: productInfo.image
    });

  } catch (error) {
    console.error('❌ Error fixing payment images:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [12] ENDPOINT: GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: allProducts,
    total: allProducts.length
  });
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
      conversation: 'GET /api/conversation/:visitor_id',
      dashboard: 'GET /api/dashboard/analytics',
      visitor_data: 'GET /api/visitor-data/:visitor_id',
      initiate_chat: 'POST /api/initiate-chat-flow',
      products: 'GET /api/products'
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
  console.log(`🛒 Payment System: Ready with ${allProducts.length} products`);
  console.log(`🔗 Webhooks: Connected to Lindy AI`);
  console.log(`🖼️  Image URLs: Automatically corrected to full paths`);
});
