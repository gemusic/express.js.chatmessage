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
// CONFIGURATION LINDY - WEBHOOKS (NOUVEAUX)
// ============================================
const LINDY_WEBHOOKS = {
  BEHAVIORAL_ANALYSIS: 'https://public.lindy.ai/api/v1/webhooks/lindy/e9bea5d0-3895-43b8-a64e-ba51c9999e32',
  CHAT_MESSAGE: 'https://public.lindy.ai/api/v1/webhooks/lindy/3f08a05f-9e35-4993-90c0-e309fa950177',
  CONVERSION: 'https://public.lindy.ai/api/v1/webhooks/lindy/f9945949-f896-4fa9-9511-4d8ce2ae2917',
  PRODUCT_SYNC: 'https://public.lindy.ai/api/v1/webhooks/lindy/4ecac6f6-a229-4a2e-af5e-435f765213c1'
};

const LINDY_WEBHOOK_TOKENS = {
  BEHAVIORAL_ANALYSIS: 'c2463ef62a148fdc24695f7263086a980eaa5d74b355d272638af5730fe41779',
  CHAT_MESSAGE: '61c02a372c6c8d189a65e68f6cb9e4458bfede32082536641e56a333b7c0e344',
  CONVERSION: '060701a1bcfa0fd9fb7d89adf075e6fa8ec179d2023d796219e880d0fb2b8b49',
  PRODUCT_SYNC: '004d9c1c2a77ea938e2479b909b1de130ed81177217a53c7266851fa0ce1cb48'
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
// BASE DE DONNÉES PRODUITS COMPLÈTE (50 PRODUITS)
// ============================================
const allProducts = [
  { id: 1, name: "Quantum Earbuds Pro", price: 249, category: "audio", description: "Immersive sound with adaptive noise cancellation and 30-hour battery life. Features spatial audio technology and wireless charging case with premium aluminum finish.", image: "https://ebusinessag.com/quantum-earbuds-pro.jpeg" },
  { id: 2, name: "Nexus Smart Watch", price: 399, category: "wearable", description: "Advanced health monitoring with ECG, blood oxygen tracking, and seamless smartphone connectivity. 7-day battery life with aerospace-grade titanium casing.", image: "https://ebusinessag.com/nexus-smart-watch.jpeg" },
  { id: 3, name: "Aura AR Glasses", price: 599, category: "wearable", description: "Augmented reality display with voice control and all-day comfort. Projects holographic interfaces directly into your field of view with crystal-clear optics.", image: "https://ebusinessag.com/aura-ar-glasses.jpeg" },
  { id: 4, name: "Lumina Wireless Charger", price: 89, category: "accessory", description: "Fast wireless charging with adaptive power delivery up to 30W. Features intelligent cooling and multi-device compatibility with premium glass and aluminum construction.", image: "https://ebusinessag.com/lumina-wireless-charger.jpeg" },
  { id: 5, name: "Nova Smart Speaker", price: 199, category: "audio", description: "360-degree immersive sound with voice assistant integration. Delivers room-filling audio with deep bass and crystal-clear highs through advanced acoustic engineering.", image: "https://ebusinessag.com/nova-smart-speaker.jpeg" },
  { id: 6, name: "Pulse Fitness Tracker", price: 149, category: "wearable", description: "Advanced fitness tracking with built-in GPS and heart rate monitoring. Tracks over 50 activities with detailed sleep analysis and stress monitoring.", image: "https://ebusinessag.com/pulse-fitness-tracker.jpeg" },
  { id: 7, name: "Echo Wireless Earbuds", price: 179, category: "audio", description: "Crystal clear audio with 24-hour battery life and premium comfort. Features environmental noise reduction and secure-fit ergonomic design for active lifestyles.", image: "https://ebusinessag.com/echo-wireless-earbuds.jpeg" },
  { id: 8, name: "Orbit Smart Ring", price: 299, category: "wearable", description: "Discreet health monitoring and gesture control in elegant titanium. Tracks sleep quality, activity levels, and provides subtle notifications with premium craftsmanship.", image: "https://ebusinessag.com/orbit-smart-ring.jpeg" },
  { id: 9, name: "Zen Meditation Headband", price: 249, category: "wellness", description: "Brainwave monitoring for enhanced meditation and focus. Uses EEG sensors to provide real-time feedback and guided meditation sessions for mental clarity.", image: "https://ebusinessag.com/zen-meditation-headband.jpeg" },
  { id: 10, name: "Apex Gaming Headset", price: 349, category: "audio", description: "Immersive 3D audio with noise-canceling microphone. Features professional-grade surround sound and memory foam ear cushions for extended gaming sessions.", image: "https://ebusinessag.com/apex-gaming-headset.jpeg" },
  { id: 11, name: "Quantum Laptop Pro", price: 2199, category: "computing", description: "Professional workstation with quantum-level processing power and stunning 4K display. Ideal for creators and developers with unparalleled performance.", image: "https://ebusinessag.com/quantum-laptop-pro.jpeg" },
  { id: 12, name: "Nexus Tablet Ultra", price: 899, category: "computing", description: "Slim and powerful tablet with OLED display and professional creative tools. Perfect for digital art, note-taking, and mobile productivity.", image: "https://ebusinessag.com/nexus-tablet-ultra.jpeg" },
  { id: 13, name: "Aura Smart Bulbs", price: 79, category: "smart home", description: "Color-changing smart bulbs with voice control and scheduling. Creates perfect ambiance for any occasion with millions of color options.", image: "https://ebusinessag.com/aura-smart-bulbs.jpeg" },
  { id: 14, name: "Lumina Desk Lamp Pro", price: 129, category: "smart home", description: "Smart desk lamp with adjustable color temperature and brightness. Features built-in wireless charging and ambient light sensors for optimal illumination.", image: "https://ebusinessag.com/lumina-desk-lamp-pro.jpeg" },
  { id: 15, name: "Nova Security Camera", price: 199, category: "smart home", description: "4K security camera with AI-powered person detection and night vision. Provides complete home monitoring with cloud storage and real-time alerts.", image: "https://ebusinessag.com/nova-security-camera.jpeg" },
  { id: 16, name: "Pulse Smart Scale", price: 89, category: "wellness", description: "Advanced body composition analyzer with smartphone integration. Measures weight, body fat, muscle mass, and tracks progress over time.", image: "https://ebusinessag.com/pulse-smart-scale.jpeg" },
  { id: 17, name: "Echo Smart Plug", price: 39, category: "smart home", description: "Wi-Fi smart plug with energy monitoring and voice control. Transform any appliance into a smart device with scheduling and remote control.", image: "https://ebusinessag.com/echo-smart-plug.jpeg" },
  { id: 18, name: "Orbit Drone Pro", price: 1299, category: "photography", description: "Professional drone with 8K camera and obstacle avoidance. Features extended flight time and advanced stabilization for cinematic footage.", image: "https://ebusinessag.com/orbit-drone-pro.jpeg" },
  { id: 19, name: "Zen Air Purifier", price: 299, category: "wellness", description: "HEPA air purifier with smart sensors and quiet operation. Removes 99.97% of airborne particles and provides real-time air quality monitoring.", image: "https://ebusinessag.com/zen-air-purifier.jpeg" },
  { id: 20, name: "Apex Monitor Ultra", price: 799, category: "computing", description: "32-inch 4K professional monitor with color accuracy and ergonomic design. Perfect for creative professionals and competitive gamers.", image: "https://ebusinessag.com/apex-monitor-ultra.jpeg" },
  { id: 21, name: "Quantum Keyboard", price: 199, category: "computing", description: "Mechanical keyboard with customizable RGB lighting and wireless connectivity. Features premium switches and durable construction for typing enthusiasts.", image: "https://ebusinessag.com/quantum-keyboard.jpeg" },
  { id: 22, name: "Nexus Mouse Pro", price: 129, category: "computing", description: "Ergonomic wireless mouse with precision tracking and customizable buttons. Designed for comfort during extended use with long battery life.", image: "https://ebusinessag.com/nexus-mouse-pro.jpeg" },
  { id: 23, name: "Aura Projector Mini", price: 349, category: "entertainment", description: "Portable HD projector with built-in battery and streaming apps. Transform any surface into a 100-inch screen with crystal-clear projection.", image: "https://ebusinessag.com/aura-projector-mini.jpeg" },
  { id: 24, name: "Lumina Power Bank", price: 79, category: "accessory", description: "High-capacity power bank with fast charging and multiple ports. Provides multiple device charges with compact, travel-friendly design.", image: "https://ebusinessag.com/lumina-power-bank.jpeg" },
  { id: 25, name: "Nova Streaming Stick", price: 69, category: "entertainment", description: "4K streaming stick with voice remote and extensive app support. Access all your favorite content in stunning high definition.", image: "https://ebusinessag.com/nova-streaming-stick.jpeg" },
  { id: 26, name: "Pulse Massage Gun", price: 199, category: "wellness", description: "Professional percussion massager with multiple attachments. Relieves muscle tension and improves recovery with variable speed control.", image: "https://ebusinessag.com/pulse-massage-gun.jpeg" },
  { id: 27, name: "Echo Bluetooth Speaker", price: 149, category: "audio", description: "Waterproof Bluetooth speaker with 360-degree sound and party lights. Perfect for outdoor adventures and social gatherings with robust construction.", image: "https://ebusinessag.com/echo-bluetooth-speaker.jpeg" },
  { id: 28, name: "Orbit Action Camera", price: 399, category: "photography", description: "4K action camera with image stabilization and waterproof housing. Capture adventures in stunning detail with professional-grade features.", image: "https://ebusinessag.com/orbit-action-camera.jpeg" },
  { id: 29, name: "Zen Humidifier Pro", price: 129, category: "wellness", description: "Smart humidifier with essential oil diffusion and humidity control. Creates perfect room conditions with silent operation and auto-shutoff.", image: "https://ebusinessag.com/zen-humidifier-pro.jpeg" },
  { id: 30, name: "Apex Router Pro", price: 299, category: "networking", description: "Wi-Fi 6 router with mesh capability and advanced security. Provides whole-home coverage with blazing-fast speeds and parental controls.", image: "https://ebusinessag.com/apex-router-pro.jpeg" },
  { id: 31, name: "Quantum SSD 2TB", price: 299, category: "computing", description: "High-speed NVMe SSD with 2TB capacity and heat dissipation. Dramatically improves system performance for gaming and professional applications.", image: "https://ebusinessag.com/quantum-ssd-2tb.jpeg" },
  { id: 32, name: "Nexus Webcam Pro", price: 159, category: "computing", description: "4K webcam with AI-powered auto-framing and noise cancellation. Perfect for video conferences and content creation with studio-quality video.", image: "https://ebusinessag.com/nexus-webcam-pro.jpeg" },
  { id: 33, name: "Aura Smart Lock", price: 249, category: "smart home", description: "Keyless smart lock with fingerprint recognition and remote access. Secure your home with advanced encryption and temporary access codes.", image: "https://ebusinessag.com/aura-smart-lock.jpeg" },
  { id: 34, name: "Lumina Laptop Stand", price: 89, category: "accessory", description: "Adjustable aluminum laptop stand with ergonomic design. Improves posture and cooling with sturdy construction and portable foldable design.", image: "https://ebusinessag.com/lumina-laptop-stand.jpeg" },
  { id: 35, name: "Nova E-Reader", price: 179, category: "entertainment", description: "High-resolution e-reader with eye comfort display and weeks of battery life. Store thousands of books with waterproof design and adjustable lighting.", image: "https://ebusinessag.com/nova-e-reader.jpeg" },
  { id: 36, name: "Pulse Blood Pressure Monitor", price: 99, category: "wellness", description: "Digital blood pressure monitor with smartphone connectivity. Track and share health data with your doctor through intuitive mobile app.", image: "https://ebusinessag.com/pulse-blood-pressure-monitor.jpeg" },
  { id: 37, name: "Echo Phone Case Pro", price: 49, category: "accessory", description: "Protective phone case with military-grade drop protection and wireless charging compatibility. Available for all major smartphone models.", image: "https://ebusinessag.com/echo-phone-case-pro.jpeg" },
  { id: 38, name: "Orbit VR Headset", price: 499, category: "entertainment", description: "Virtual reality headset with 4K displays and 6DOF tracking. Immerse yourself in virtual worlds with precision controllers and extensive content library.", image: "https://ebusinessag.com/orbit-vr-headset.jpeg" },
  { id: 39, name: "Zen Weighted Blanket", price: 129, category: "wellness", description: "Therapeutic weighted blanket with glass beads and breathable fabric. Promotes relaxation and better sleep through deep pressure stimulation.", image: "https://ebusinessag.com/zen-weighted-blanket.jpeg" },
  { id: 40, name: "Apex Microphone Pro", price: 299, category: "audio", description: "Studio condenser microphone with USB-C connectivity and premium shock mount. Perfect for streaming, podcasting, and professional recordings.", image: "https://ebusinessag.com/apex-microphone-pro.jpeg" },
  { id: 41, name: "Quantum Gaming Mouse", price: 149, category: "computing", description: "Esports gaming mouse with optical switches and customizable weights. Features precision tracking and ergonomic design for competitive gaming.", image: "https://ebusinessag.com/quantum-gaming-mouse.jpeg" },
  { id: 42, name: "Nexus Portable Monitor", price: 349, category: "computing", description: "15.6-inch portable 4K monitor with USB-C connectivity. Extend your workspace anywhere with slim design and built-in stand.", image: "https://ebusinessag.com/nexus-portable-monitor.jpeg" },
  { id: 43, name: "Aura Smart Garden", price: 199, category: "smart home", description: "Indoor smart garden with automated lighting and watering. Grow fresh herbs and vegetables year-round with soil-free technology.", image: "https://ebusinessag.com/aura-smart-garden.jpeg" },
  { id: 44, name: "Lumina Cable Organizer", price: 29, category: "accessory", description: "Smart cable organizer with wireless charging and multiple ports. Keep your workspace tidy while charging all your devices efficiently.", image: "https://ebusinessag.com/lumina-cable-organizer.jpeg" },
  { id: 45, name: "Nova Smart Blinds", price: 199, category: "smart home", description: "Automated window blinds with voice control and scheduling. Save energy and enhance privacy with remote operation and light sensors.", image: "https://ebusinessag.com/nova-smart-blinds.jpeg" },
  { id: 46, name: "Pulse Oximeter Pro", price: 59, category: "wellness", description: "Medical-grade pulse oximeter with OLED display and smartphone sync. Monitor blood oxygen levels and heart rate with clinical accuracy.", image: "https://ebusinessag.com/pulse-oximeter-pro.jpeg" },
  { id: 47, name: "Echo Car Charger", price: 39, category: "accessory", description: "Fast car charger with dual USB-C ports and digital display. Charge multiple devices simultaneously with intelligent power distribution.", image: "https://ebusinessag.com/echo-car-charger.jpeg" },
  { id: 48, name: "Orbit Camera Gimbal", price: 299, category: "photography", description: "3-axis camera stabilizer with object tracking and time-lapse. Create smooth professional video content with intuitive controls and long battery life.", image: "https://ebusinessag.com/orbit-camera-gimbal.jpeg" },
  { id: 49, name: "Zen Aromatherapy Diffuser", price: 79, category: "wellness", description: "Ultrasonic essential oil diffuser with color-changing lights and timer. Create relaxing atmospheres with large capacity and auto-shutoff safety.", image: "https://ebusinessag.com/zen-aromatherapy-diffuser.jpeg" },
  { id: 50, name: "Echo Wireless Charger Pad", price: 49, category: "accessory", description: "Fast wireless charging with intelligent cooling fan and foreign object detection. Charges through cases up to 5mm thick with premium finish.", image: "https://ebusinessag.com/echo-wireless-charger-pad.jpeg" }
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

// [3] ENDPOINT: GET CHAT RESPONSE (For Frontend) - OPTIMISÉ POUR L'AFFICHAGE DES CARTES DE PAIEMENT
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
      message: `🎉 **Excellent choice!** Your ${product_name} is ready. \n\n**Price:** $${price}\n\nClick the button below to proceed with secure payment.`
    });

  } catch (error) {
    console.error('❌ Error generating payment link:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// [7] ENDPOINT: SEND PAYMENT LINK - CORRIGÉ ET OPTIMISÉ
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { visitor_id, product_id, product_name, price, description } = req.body;

    console.log('💰 Sending payment link for:', visitor_id, product_name);

    // Trouver le produit dans la base de données pour obtenir l'image complète
    const product = allProducts.find(p => p.id == product_id) || {
      id: product_id || `p_${Date.now()}`,
      name: product_name,
      price: price,
      description: description,
      image: `https://ebusinessag.com/${product_name.toLowerCase().replace(/\s+/g, '-')}.jpeg`
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
      message: `🎉 **Excellent choice!** Your ${product.name} is ready. \n\n**Price:** $${product.price}\n\nClick the button below to proceed with secure payment.`,
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
      message: `🎉 **Excellent choice!** Your ${product.name} is ready. \n\n**Price:** $${product.price}\n\nClick the button below to proceed with secure payment.`,
      payment_product: productInfo,
      timestamp: new Date().toISOString(),
      message_type: 'payment_link'
    });

    // Track conversion via Lindy webhook
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
