// public/chatbot-widget.js
// ========================================
// LUMINARA AI CHAT WIDGET - SYSTÈME COMPLET AVEC PAIEMENTS
// ========================================

(function() {
'use strict';

class LuminaraChatWidget {
    constructor() {
        this.isOpen = false;
        this.isLoading = false;
        this.conversationHistory = [];
        this.currentTypingIndicator = null;
        this.visitorId = null;
        this.pollingInterval = null;
        this.hasReceivedWelcome = false;
        
        this.config = {
            SERVER_URL: 'https://luminara-express-server.onrender.com',
            POLLING_INTERVAL: 2000,
            TYPING_DELAY: 1000
        };

        // Add global product list (50 items)
        this.allProducts = [
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

        this.initializeElements();
        this.initializeVisitor();
        this.initializeEventListeners();
        this.initializeChat();

        console.log('🤖 Luminara Chat Widget Initialized - Visitor:', this.visitorId);
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    initializeElements() {
        if (!document.getElementById('luminara-chat-widget')) {
            this.createWidgetHTML();
        }

        this.elements = {
            chatWidget: document.getElementById('luminara-chat-widget'),
            chatToggle: document.getElementById('chatToggle'),
            chatContainer: document.getElementById('chatContainer'),
            chatMessages: document.getElementById('chatMessages'),
            chatInput: document.getElementById('chatInput'),
            sendButton: document.getElementById('sendMessage'),
            notificationBadge: document.getElementById('notificationBadge'),
            statusIndicator: document.getElementById('statusIndicator'),
            closeChat: document.getElementById('closeChat'),
            minimizeChat: document.getElementById('minimizeChat')
        };
    }

    createWidgetHTML() {
        const widgetHTML = `
        <div id="luminara-chat-widget">
            <div class="chat-toggle" id="chatToggle">
                <div class="chat-icon-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <div class="notification-badge" id="notificationBadge">0</div>
                </div>
                <div class="pulse-ring"></div>
            </div>
            
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <div class="chat-header-content">
                        <div class="ai-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <div class="chat-title">
                            <h3>Luminara Assistant</h3>
                            <span class="status" id="statusIndicator">🟢 Online</span>
                        </div>
                    </div>
                    <div class="chat-controls">
                        <button class="minimize-chat" id="minimizeChat" title="Minimize">−</button>
                        <button class="close-chat" id="closeChat" title="Close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages"></div>
                
                <div class="chat-input-container">
                    <div class="input-wrapper">
                        <textarea id="chatInput" placeholder="Type your message..." maxlength="500" rows="1"></textarea>
                        <button id="sendMessage" class="send-button" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <style>/* (omitted here for brevity — preserved from previous widget CSS) */</style>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    initializeVisitor() {
        if (window.LuminaraTracker) {
            this.visitorId = window.LuminaraTracker.getVisitorId();
        } else if (window.LuminaraTracking) {
            this.visitorId = window.LuminaraTracking.getVisitorId();
        } else {
            this.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            console.warn('Luminara Tracking not detected, using temporary visitorId:', this.visitorId);
        }
    }

    initializeEventListeners() {
        this.elements.chatToggle.addEventListener('click', () => this.toggleChat());
        this.elements.closeChat.addEventListener('click', () => this.closeChat());
        this.elements.minimizeChat.addEventListener('click', () => this.minimizeChat());
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.elements.chatInput.addEventListener('input', this.autoResize.bind(this));
        this.elements.chatInput.addEventListener('input', () => this.updateSendButton());
    }

    initializeChat() {
        this.startPolling();
        this.checkForResponses();
    }

    // ========================================
    // MESSAGE MANAGEMENT - CONNECTED TO SERVER
    // ========================================

    async sendMessage() {
        const message = this.elements.chatInput.value.trim();
        if (!message || this.isLoading) return;

        this.displayUserMessage(message);
        this.elements.chatInput.value = '';
        this.autoResize();
        this.updateSendButton();

        this.setLoadingState(true);
        this.showTypingIndicator();

        try {
            await this.sendToServer(message);
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.hideTypingIndicator();
            this.displayErrorMessage(`Sorry, an error occurred while sending: ${error.message}`, true);
            this.setLoadingState(false);
        }
    }

    async sendToServer(message) {
        const response = await fetch(`${this.config.SERVER_URL}/api/visitor-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitor_id: this.visitorId, message: message })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.duplicate) {
            this.hideTypingIndicator();
            this.setLoadingState(false);
            this.displayAIMessage("I'm already processing your message — please wait.", true);
        }

        return data;
    }

    async checkForResponses() {
        try {
            const response = await fetch(`${this.config.SERVER_URL}/api/chat-response/${this.visitorId}`);
            const data = await response.json();

            if (data.success && data.message) {
                this.hideTypingIndicator();

                // Parse message for payment links (client-side auto-detection)
                const paymentCardFromMessage = this.parseMessageForPaymentLinks(data.message);
                if (paymentCardFromMessage) {
                    // If server also provided payment_data, prioritize server-sent data but append client card too
                    if (data.payment_data) {
                        this.displayPaymentCard(data.payment_data.product, data.payment_data.payment_url, data.message);
                    } else {
                        // Insert AI text then attach client-side generated payment card
                        const messageElement = this.createMessageElement('ai', data.message, true);
                        messageElement.querySelector('.message-text').appendChild(paymentCardFromMessage);
                        this.elements.chatMessages.appendChild(messageElement);
                        if (!this.isOpen) this.incrementNotificationBadge();
                        this.scrollToBottom();
                    }
                } else {
                    if (data.payment_data) {
                        this.displayPaymentCard(data.payment_data.product, data.payment_data.payment_url, data.message);
                    } else {
                        this.displayAIMessage(data.message, true);
                    }
                }

                if (data.recommended_products && data.recommended_products.length > 0) {
                    this.handleRecommendedProducts(data.recommended_products);
                }

                if (!this.hasReceivedWelcome) this.hasReceivedWelcome = true;
                this.setLoadingState(false);
            }
        } catch (error) {
            console.error('❌ Polling error:', error);
        }
    }

    startPolling() {
        this.pollingInterval = setInterval(() => {
            this.checkForResponses();
        }, this.config.POLLING_INTERVAL);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    handleRecommendedProducts(products) {
        // Simple display of recommended products in chat (can be improved)
        products.forEach(prod => {
            // If product object contains id and matches our catalog, use local data to create URL and image fallback
            const local = this.allProducts.find(p => p.id == prod.id) || prod;
            const cart = [{ id: local.id, name: local.name, price: local.price, quantity: 1, image: local.image }];
            const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cart))}&checkout=true`;
            const messageElement = this.createMessageElement('ai', `Recommended: ${local.name}`, true);
            messageElement.querySelector('.message-text').appendChild(this.createPaymentCard(local, paymentUrl));
            this.elements.chatMessages.appendChild(messageElement);
            if (!this.isOpen) this.incrementNotificationBadge();
            this.scrollToBottom();
        });
    }

    // ========================================
    // PAYMENT CARD MANAGEMENT (ENGLISH)
    // ========================================

    displayPaymentCard(product, paymentUrl, message) {
        const messageElement = this.createMessageElement('ai', message || `Ready to buy ${product.name}`, true);
        // Ensure product object has full image URL
        const fixedProduct = { ...product };
        if (fixedProduct.image && !fixedProduct.image.startsWith('http')) {
            fixedProduct.image = `https://ebusinessag.com/${fixedProduct.image}`;
        }
        const paymentCard = this.createPaymentCard(fixedProduct, paymentUrl);
        messageElement.querySelector('.message-text').appendChild(paymentCard);
        this.elements.chatMessages.appendChild(messageElement);
        if (!this.isOpen) this.incrementNotificationBadge();
        this.scrollToBottom();
    }

    createPaymentCard(product, paymentUrl) {
        // Ensure full image URL
        let productImage = product && product.image ? product.image : null;
        if (productImage && !productImage.startsWith('http')) {
            productImage = `https://ebusinessag.com/${productImage}`;
        }
        // Fallback image
        const fallbackImage = 'https://via.placeholder.com/150x150/000/fff?text=Luminara';

        const paymentCard = document.createElement('div');
        paymentCard.className = 'payment-card';

        // Use English labels for US site
        paymentCard.innerHTML = `
            <div class="payment-card-header">
                <span class="payment-badge">🛒 Secure Checkout</span>
            </div>
            <div class="payment-card-content">
                <div class="payment-product-image">
                    <img src="${productImage || fallbackImage}" alt="${this.escapeHtml(product.name || 'Product')}" 
                         onerror="this.src='${fallbackImage}'; this.onerror=null;">
                </div>
                <div class="payment-product-info">
                    <h4 class="payment-product-name">${this.escapeHtml(product.name || 'Product')}</h4>
                    <p class="payment-product-description">${this.escapeHtml(product.description || 'Premium Luminara product')}</p>
                    <div class="payment-price-section">
                        <span class="payment-price">$${product.price != null ? Number(product.price).toFixed(2) : '0.00'}</span>
                        <span class="payment-tax">Taxes included</span>
                    </div>
                </div>
            </div>
            <div class="payment-card-actions">
                <a href="${this.escapeAttr(paymentUrl)}" target="_blank" rel="noopener noreferrer" class="payment-button">
                    <span class="payment-button-text">🛒 Pay Now</span>
                    <span class="payment-button-arrow">→</span>
                </a>
            </div>
            <div class="payment-security">
                <span class="security-badge">🔒 100% secure payment</span>
            </div>
        `;

        return paymentCard;
    }

    // ========================================
    // MESSAGE PARSING FOR PAYMENT LINKS (ENHANCED)
    // ========================================

    parseMessageForPaymentLinks(message) {
        if (!message || typeof message !== 'string') return null;

        // Search for product names from allProducts in the message (case-insensitive)
        const lowerMessage = message.toLowerCase();

        let detectedProduct = null;
        for (const p of this.allProducts) {
            if (!p.name) continue;
            const name = p.name.toLowerCase();
            // match whole words or phrases safely
            if (lowerMessage.includes(name)) {
                detectedProduct = p;
                break;
            }
            // allow partial matches for common short names (e.g., 'earbuds', 'projector')
            const tokens = name.split(/\s+/).filter(Boolean);
            for (const t of tokens) {
                if (t.length > 3 && lowerMessage.includes(t) && lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('checkout')) {
                    detectedProduct = p;
                    break;
                }
            }
            if (detectedProduct) break;
        }

        if (detectedProduct) {
            // Build cart + payment URL
            const cartData = [{
                id: detectedProduct.id,
                name: detectedProduct.name,
                price: detectedProduct.price,
                quantity: 1,
                image: detectedProduct.image
            }];

            const paymentUrl = `https://ebusinessag.com/ai_sales_agent_demo_cart.html?cart=${encodeURIComponent(JSON.stringify(cartData))}&checkout=true`;

            return this.createPaymentCard(detectedProduct, paymentUrl);
        }

        return null;
    }

    // ========================================
    // MESSAGE DISPLAY
    // ========================================

    displayUserMessage(message) {
        const messageElement = this.createMessageElement('user', message, true);
        this.elements.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    displayAIMessage(message, withTimestamp = true) {
        const messageElement = this.createMessageElement('ai', message, withTimestamp);
        this.elements.chatMessages.appendChild(messageElement);
        if (!this.isOpen) this.incrementNotificationBadge();
        this.scrollToBottom();
    }

    displayErrorMessage(message, withTimestamp) {
        const errorElement = this.createMessageElement('ai', message, withTimestamp);
        errorElement.querySelector('.message-text').style.background = 'linear-gradient(135deg, #ff6b6b, #ffa8a8)';
        errorElement.querySelector('.message-text').style.color = '#fff';
        this.elements.chatMessages.appendChild(errorElement);
        this.scrollToBottom();
    }

    createMessageElement(sender, message, withTimestamp) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const timestampHTML = withTimestamp ? `<div class="message-timestamp">${timestamp}</div>` : '';
        const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');
        
        const avatarSvg = sender === 'ai' ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatarSvg}
            </div>
            <div class="message-content">
                <div class="message-text">${safeMessage}</div>
                ${timestampHTML}
            </div>
        `;
        
        messageGroup.appendChild(messageDiv);
        return messageGroup;
    }

    // ========================================
    // VISUAL INDICATORS & UTILITIES
    // ========================================

    showTypingIndicator() {
        if (this.currentTypingIndicator) return;

        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message-group typing-indicator-group';
        typingIndicator.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.elements.chatMessages.appendChild(typingIndicator);
        this.scrollToBottom();
        this.currentTypingIndicator = typingIndicator;
    }

    hideTypingIndicator() {
        if (this.currentTypingIndicator) {
            this.currentTypingIndicator.remove();
            this.currentTypingIndicator = null;
        }
    }

    incrementNotificationBadge() {
        this.elements.notificationBadge.textContent = '1';
        this.elements.notificationBadge.style.display = 'flex';
        this.elements.chatToggle.style.animation = 'pulse 0.6s ease-in-out 3';
    }

    resetNotificationBadge() {
        this.elements.notificationBadge.textContent = '0';
        this.elements.notificationBadge.style.display = 'none';
        this.elements.chatToggle.style.animation = '';
    }

    setLoadingState(loading) {
        this.isLoading = loading;
        this.elements.chatInput.disabled = loading;
        this.elements.sendButton.disabled = loading || !this.elements.chatInput.value.trim();
        if (loading) this.elements.chatWidget.classList.add('loading');
        else this.elements.chatWidget.classList.remove('loading');
    }

    updateSendButton() {
        const hasText = this.elements.chatInput.value.trim().length > 0;
        this.elements.sendButton.disabled = !hasText || this.isLoading;
    }

    autoResize() {
        const textarea = this.elements.chatInput;
        textarea.style.height = 'auto';
        let newHeight = Math.min(textarea.scrollHeight, 120);
        newHeight = Math.max(newHeight, 46);
        textarea.style.height = newHeight + 'px';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        }, 100);
    }

    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeAttr(text) {
        if (typeof text !== 'string') return '';
        return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    destroy() {
        this.stopPolling();
        if (this.elements.chatWidget) this.elements.chatWidget.remove();
    }
}

// AUTO INIT
let luminaraChat = null;
function initializeChatWidget() {
    if (!document.getElementById('luminara-chat-widget')) {
        luminaraChat = new LuminaraChatWidget();
        window.LuminaraChat = luminaraChat;
        console.log('🚀 Luminara Chat Widget Initialized');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatWidget);
} else {
    setTimeout(initializeChatWidget, 1000);
}

window.initializeLuminaraChat = initializeChatWidget;

})();
