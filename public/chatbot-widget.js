// LUMINARA AI CHATBOT WIDGET - VERSION COMPLÈTE CORRIGÉE
(function() {
    'use strict';

    const SERVER_URL = 'https://luminara-express-server.onrender.com';
    
    // Configuration
    const config = {
        visitorId: null,
        sessionId: null,
        isOpen: false,
        isMinimized: false,
        currentStep: 'welcome'
    };

    // Initialisation
    function init() {
        generateVisitorId();
        createChatWidget();
        loadSession();
        startPolling();
        
        console.log('🤖 Luminara Chatbot initialized for visitor:', config.visitorId);
    }

    // Générer un ID visiteur unique
    function generateVisitorId() {
        config.visitorId = localStorage.getItem('luminara_visitor_id');
        if (!config.visitorId) {
            config.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('luminara_visitor_id', config.visitorId);
        }
        
        config.sessionId = 'session_' + Date.now();
    }

    // Créer le widget de chat
    function createChatWidget() {
        const widgetHTML = `
            <div id="luminaraChatContainer" class="luminara-chat-container">
                <!-- Header du chat -->
                <div class="luminara-chat-header">
                    <div class="luminara-chat-title">
                        <div class="luminara-chat-avatar">🤖</div>
                        <div class="luminara-chat-info">
                            <div class="luminara-chat-name">Luminara Assistant</div>
                            <div class="luminara-chat-status">En ligne • Prêt à vous aider</div>
                        </div>
                    </div>
                    <div class="luminara-chat-actions">
                        <button class="luminara-chat-minimize" id="luminaraChatMinimize">−</button>
                        <button class="luminara-chat-close" id="luminaraChatClose">×</button>
                    </div>
                </div>

                <!-- Messages -->
                <div class="luminara-chat-messages" id="luminaraChatMessages">
                    <div class="luminara-message ai-message">
                        <div class="luminara-message-avatar">🤖</div>
                        <div class="luminara-message-content">
                            <div class="luminara-message-text">
                                Bonjour ! Je suis Luminara, votre assistant shopping IA. 🤖<br><br>
                                Je peux vous aider à :
                                • Trouver des produits adaptés<br>
                                • Comparer les fonctionnalités<br>
                                • Vous guider vers l'achat<br><br>
                                Que recherchez-vous aujourd'hui ?
                            </div>
                            <div class="luminara-message-time">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>

                <!-- Input area -->
                <div class="luminara-chat-input-container">
                    <div class="luminara-chat-input-wrapper">
                        <input 
                            type="text" 
                            class="luminara-chat-input" 
                            id="luminaraChatInput"
                            placeholder="Tapez votre message..."
                            maxlength="500"
                        >
                        <button class="luminara-chat-send" id="luminaraChatSend">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Bouton de toggle -->
            <button class="luminara-chat-toggle" id="luminaraChatToggle">
                <div class="luminara-chat-toggle-icon">💬</div>
                <div class="luminara-chat-toggle-text">Assistant</div>
            </button>
        `;

        // Ajouter au body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Ajouter les styles
        addChatStyles();

        // Setup des événements
        setupEventListeners();
    }

    // Ajouter les styles CSS
    function addChatStyles() {
        const styles = `
            <style>
            .luminara-chat-container {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .luminara-chat-container.open {
                transform: translateY(0);
                opacity: 1;
            }

            .luminara-chat-container.minimized {
                height: 70px;
            }

            .luminara-chat-header {
                background: linear-gradient(135deg, #000000, #1a1a1a);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            .luminara-chat-title {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .luminara-chat-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #00f0ff, #00c4d6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }

            .luminara-chat-info {
                display: flex;
                flex-direction: column;
            }

            .luminara-chat-name {
                font-weight: 700;
                font-size: 16px;
            }

            .luminara-chat-status {
                font-size: 12px;
                opacity: 0.8;
            }

            .luminara-chat-actions {
                display: flex;
                gap: 8px;
            }

            .luminara-chat-minimize,
            .luminara-chat-close {
                width: 28px;
                height: 28px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all 0.2s ease;
            }

            .luminara-chat-minimize:hover,
            .luminara-chat-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .luminara-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .luminara-message {
                display: flex;
                gap: 12px;
                max-width: 100%;
            }

            .luminara-message.user-message {
                flex-direction: row-reverse;
            }

            .luminara-message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }

            .ai-message .luminara-message-avatar {
                background: linear-gradient(135deg, #00f0ff, #00c4d6);
            }

            .user-message .luminara-message-avatar {
                background: linear-gradient(135deg, #667eea, #764ba2);
            }

            .luminara-message-content {
                max-width: 80%;
            }

            .user-message .luminara-message-content {
                text-align: right;
            }

            .luminara-message-text {
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .ai-message .luminara-message-text {
                background: #f1f3f5;
                color: #333;
                border-radius: 18px 18px 18px 4px;
            }

            .user-message .luminara-message-text {
                background: linear-gradient(135deg, #000000, #1a1a1a);
                color: white;
                border-radius: 18px 18px 4px 18px;
            }

            .luminara-message-time {
                font-size: 11px;
                color: #666;
                margin-top: 4px;
                padding: 0 8px;
            }

            .user-message .luminara-message-time {
                text-align: right;
            }

            /* Carte de produit pour paiement */
            .payment-card {
                background: white;
                border: 2px solid #00f0ff;
                border-radius: 12px;
                padding: 16px;
                margin: 12px 0;
                box-shadow: 0 4px 12px rgba(0, 240, 255, 0.2);
            }

            .payment-product-image {
                width: 100%;
                height: 120px;
                background: linear-gradient(135deg, #f0f0f0, #ffffff);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
                overflow: hidden;
            }

            .payment-product-image img {
                max-width: 80%;
                max-height: 80%;
                object-fit: contain;
            }

            .payment-product-info h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 700;
                color: #000;
            }

            .payment-product-description {
                font-size: 12px;
                color: #666;
                margin-bottom: 8px;
                line-height: 1.3;
            }

            .payment-product-price {
                font-size: 18px;
                font-weight: 800;
                color: #000;
                margin-bottom: 12px;
            }

            .payment-button {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #000000, #1a1a1a);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .payment-button:hover {
                background: linear-gradient(135deg, #00f0ff, #000000);
                transform: translateY(-2px);
            }

            .luminara-chat-input-container {
                padding: 20px;
                border-top: 1px solid #e9ecef;
                flex-shrink: 0;
            }

            .luminara-chat-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .luminara-chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 25px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s ease;
            }

            .luminara-chat-input:focus {
                border-color: #00f0ff;
            }

            .luminara-chat-send {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #000000, #1a1a1a);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .luminara-chat-send:hover {
                background: linear-gradient(135deg, #00f0ff, #000000);
                transform: scale(1.05);
            }

            .luminara-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            /* Bouton toggle */
            .luminara-chat-toggle {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #000000, #1a1a1a);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: all 0.3s ease;
                font-size: 20px;
            }

            .luminara-chat-toggle:hover {
                transform: scale(1.1);
                background: linear-gradient(135deg, #00f0ff, #000000);
            }

            .luminara-chat-toggle-text {
                font-size: 9px;
                margin-top: 2px;
                font-weight: 600;
            }

            /* États minimisés */
            .luminara-chat-container.minimized .luminara-chat-messages,
            .luminara-chat-container.minimized .luminara-chat-input-container {
                display: none;
            }

            /* Animation de frappe */
            @keyframes typing {
                0%, 60%, 100% { opacity: 0.4; }
                30% { opacity: 1; }
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #00f0ff;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }

            /* Responsive */
            @media (max-width: 480px) {
                .luminara-chat-container {
                    width: 100vw;
                    height: 100vh;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }
                
                .luminara-chat-toggle {
                    bottom: 20px;
                    right: 20px;
                }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Setup des événements
    function setupEventListeners() {
        const toggleBtn = document.getElementById('luminaraChatToggle');
        const closeBtn = document.getElementById('luminaraChatClose');
        const minimizeBtn = document.getElementById('luminaraChatMinimize');
        const sendBtn = document.getElementById('luminaraChatSend');
        const chatInput = document.getElementById('luminaraChatInput');
        const chatContainer = document.getElementById('luminaraChatContainer');

        // Toggle chat
        toggleBtn.addEventListener('click', () => {
            if (!config.isOpen) {
                openChat();
            } else {
                closeChat();
            }
        });

        // Fermer le chat
        closeBtn.addEventListener('click', closeChat);

        // Minimiser le chat
        minimizeBtn.addEventListener('click', () => {
            chatContainer.classList.toggle('minimized');
            config.isMinimized = !config.isMinimized;
        });

        // Envoyer message
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Ouvrir au clic sur le toggle
        setTimeout(() => {
            if (!localStorage.getItem('luminara_chat_shown')) {
                openChat();
                localStorage.setItem('luminara_chat_shown', 'true');
            }
        }, 3000);
    }

    // Ouvrir le chat
    function openChat() {
        const chatContainer = document.getElementById('luminaraChatContainer');
        chatContainer.classList.add('open');
        config.isOpen = true;
        
        // Focus sur l'input
        setTimeout(() => {
            document.getElementById('luminaraChatInput').focus();
        }, 300);
    }

    // Fermer le chat
    function closeChat() {
        const chatContainer = document.getElementById('luminaraChatContainer');
        chatContainer.classList.remove('open');
        config.isOpen = false;
    }

    // Envoyer un message
    async function sendMessage() {
        const input = document.getElementById('luminaraChatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Ajouter le message de l'utilisateur
        addMessage(message, 'user');
        input.value = '';

        // Afficher l'indicateur de frappe
        showTypingIndicator();

        try {
            // Envoyer au serveur
            const response = await fetch(`${SERVER_URL}/api/visitor-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitor_id: config.visitorId,
                    message: message
                })
            });

            if (!response.ok) throw new Error('Network error');

            // L'automatisation Lindy va répondre via le webhook
            // La réponse sera récupérée par le polling

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage("Désolé, je rencontre un problème technique. Veuillez réessayer.", 'ai');
            hideTypingIndicator();
        }
    }

    // Ajouter un message dans le chat
    function addMessage(text, sender, paymentData = null) {
        const messagesContainer = document.getElementById('luminaraChatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `luminara-message ${sender}-message`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString();
        
        let messageContent = '';
        
        if (paymentData && sender === 'ai') {
            // Message avec carte de paiement
            messageContent = `
                <div class="luminara-message-avatar">${avatar}</div>
                <div class="luminara-message-content">
                    <div class="luminara-message-text">${text}</div>
                    <div class="payment-card">
                        <div class="payment-product-image">
                            <img src="${paymentData.product.image}" alt="${paymentData.product.name}" 
                                 onerror="this.src='https://via.placeholder.com/150x150?text=Product'">
                        </div>
                        <div class="payment-product-info">
                            <h4>${paymentData.product.name}</h4>
                            <p class="payment-product-description">${paymentData.product.description}</p>
                            <div class="payment-product-price">$${paymentData.product.price}</div>
                            <button class="payment-button" onclick="window.open('${paymentData.payment_url}', '_self')">
                                🛒 Procéder au Paiement
                            </button>
                        </div>
                    </div>
                    <div class="luminara-message-time">${time}</div>
                </div>
            `;
        } else {
            // Message normal
            messageContent = `
                <div class="luminara-message-avatar">${avatar}</div>
                <div class="luminara-message-content">
                    <div class="luminara-message-text">${text}</div>
                    <div class="luminara-message-time">${time}</div>
                </div>
            `;
        }
        
        messageElement.innerHTML = messageContent;
        messagesContainer.appendChild(messageElement);
        
        // Scroll vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Afficher l'indicateur de frappe
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('luminaraChatMessages');
        const typingElement = document.createElement('div');
        typingElement.className = 'luminara-message ai-message';
        typingElement.id = 'luminaraTypingIndicator';
        typingElement.innerHTML = `
            <div class="luminara-message-avatar">🤖</div>
            <div class="luminara-message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Cacher l'indicateur de frappe
    function hideTypingIndicator() {
        const typingElement = document.getElementById('luminaraTypingIndicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    // Polling pour les nouvelles réponses
    function startPolling() {
        setInterval(async () => {
            if (!config.isOpen) return;

            try {
                const response = await fetch(`${SERVER_URL}/api/chat-response/${config.visitorId}`);
                const data = await response.json();

                if (data.success && data.message) {
                    hideTypingIndicator();
                    
                    // Ajouter le message AI
                    addMessage(
                        data.message, 
                        'ai', 
                        data.payment_data // ✅ Inclure les données de paiement si présentes
                    );

                    // Si c'est un message de paiement, tracker la conversion
                    if (data.payment_data) {
                        trackConversion('payment_link_shown', data.payment_data.product);
                    }
                }
            } catch (error) {
                console.error('Error polling for messages:', error);
            }
        }, 2000); // Vérifier toutes les 2 secondes
    }

    // Track conversion
    async function trackConversion(eventType, product = null) {
        try {
            await fetch(`${SERVER_URL}/api/analytics/conversion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitor_id: config.visitorId,
                    event_type: eventType,
                    product_name: product?.name,
                    price: product?.price,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Error tracking conversion:', error);
        }
    }

    // Charger la session
    function loadSession() {
        const savedSession = localStorage.getItem('luminara_chat_session');
        if (savedSession) {
            const session = JSON.parse(savedSession);
            Object.assign(config, session);
        }
    }

    // Sauvegarder la session
    function saveSession() {
        localStorage.setItem('luminara_chat_session', JSON.stringify(config));
    }

    // API publique
    window.luminaraChat = {
        open: openChat,
        close: closeChat,
        sendMessage: (msg) => {
            document.getElementById('luminaraChatInput').value = msg;
            sendMessage();
        },
        getVisitorId: () => config.visitorId
    };

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
