// ========================================
// LUMINARA AI CHATBOT WIDGET - VERSION COMPLÈTE
// Interface responsive 100% largeur/longueur
// ========================================

(function() {
'use strict';

// Configuration
const CONFIG = {
  SERVER_URL: 'https://luminara-express-server.onrender.com',
  PRIMARY_COLOR: '#00f0ff',
  SECONDARY_COLOR: '#000000',
  BACKGROUND_COLOR: '#ffffff'
};

class LuminaraChatbot {
  constructor() {
    this.visitorId = this.getVisitorId();
    this.isOpen = false;
    this.isMinimized = false;
    this.isLoading = false;
    this.conversation = [];
    this.unreadMessages = 0;
    
    this.init();
  }

  getVisitorId() {
    return window.LuminaraTracker?.getVisitorId() || 
           localStorage.getItem('luminara_visitor_id') || 
           'visitor_' + Date.now();
  }

  init() {
    this.createWidget();
    this.loadConversation();
    this.setupEventListeners();
    this.checkForNewMessages();
    
    // Vérifier les nouvelles messages toutes les 5 secondes
    setInterval(() => this.checkForNewMessages(), 5000);
  }

  createWidget() {
    // Créer le conteneur principal
    this.widgetContainer = document.createElement('div');
    this.widgetContainer.id = 'luminara-chatbot-widget';
    this.widgetContainer.innerHTML = this.getWidgetHTML();
    document.body.appendChild(this.widgetContainer);

    // Appliquer les styles
    this.applyStyles();
  }

  getWidgetHTML() {
    return `
      <!-- Bouton de lancement -->
      <div class="luminara-chatbot-launcher" id="luminaraLauncher">
        <div class="launcher-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="launcher-notification" id="notificationBadge">0</div>
      </div>

      <!-- Interface principale -->
      <div class="luminara-chatbot-interface" id="luminaraInterface">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="header-info">
            <div class="avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="header-text">
              <h3>Luminara AI Assistant</h3>
              <span class="status online">● En ligne</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn minimize-btn" id="minimizeBtn">
              <i class="fas fa-window-minimize"></i>
            </button>
            <button class="header-btn close-btn" id="closeBtn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Corps de la conversation -->
        <div class="chatbot-body" id="chatbotBody">
          <div class="welcome-message">
            <div class="welcome-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="welcome-text">
              <h4>Bonjour ! Je suis Luminara AI</h4>
              <p>Je suis là pour vous aider à trouver les meilleurs produits tech. Posez-moi vos questions !</p>
            </div>
          </div>
          <div class="messages-container" id="messagesContainer">
            <!-- Messages chargés dynamiquement -->
          </div>
          <div class="typing-indicator" id="typingIndicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Luminara écrit...</span>
          </div>
        </div>

        <!-- Zone de saisie -->
        <div class="chatbot-footer">
          <div class="input-container">
            <textarea 
              id="messageInput" 
              placeholder="Tapez votre message..." 
              rows="1"
            ></textarea>
            <button class="send-btn" id="sendBtn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div class="quick-actions">
            <button class="quick-btn" data-message="Quels sont vos produits audio ?">
              🎧 Produits Audio
            </button>
            <button class="quick-btn" data-message="Montrez-moi vos montres connectées">
              ⌚ Wearables
            </button>
            <button class="quick-btn" data-message="Aide-moi à choisir un produit">
              💡 Recommandations
            </button>
          </div>
        </div>
      </div>
    `;
  }

  applyStyles() {
    const styles = `
      <style>
        /* ========================================
           LUMINARA CHATBOT STYLES - RESPONSIVE 100%
           ======================================== */
        
        #luminara-chatbot-widget {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
        }

        /* Lanceur */
        .luminara-chatbot-launcher {
          width: 60px;
          height: 60px;
          background: ${CONFIG.SECONDARY_COLOR};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .luminara-chatbot-launcher:hover {
          transform: scale(1.1);
          background: ${CONFIG.PRIMARY_COLOR};
        }

        .launcher-icon {
          color: white;
          font-size: 24px;
        }

        .launcher-notification {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;
        }

        /* Interface principale */
        .luminara-chatbot-interface {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 400px;
          height: 600px;
          background: ${CONFIG.BACKGROUND_COLOR};
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        .luminara-chatbot-interface.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .luminara-chatbot-interface.minimized {
          height: 60px;
          width: 300px;
        }

        /* Header */
        .chatbot-header {
          background: ${CONFIG.SECONDARY_COLOR};
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: ${CONFIG.PRIMARY_COLOR};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .header-text h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
        }

        .status {
          font-size: 12px;
          opacity: 0.8;
        }

        .status.online {
          color: #00ff88;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Corps */
        .chatbot-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .welcome-message {
          padding: 20px;
          display: flex;
          gap: 12px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-bottom: 1px solid #e9ecef;
        }

        .welcome-avatar {
          width: 40px;
          height: 40px;
          background: ${CONFIG.PRIMARY_COLOR};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          flex-shrink: 0;
        }

        .welcome-text h4 {
          margin: 0 0 8px 0;
          color: ${CONFIG.SECONDARY_COLOR};
          font-size: 14px;
        }

        .welcome-text p {
          margin: 0;
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.4;
          position: relative;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          align-self: flex-end;
          background: ${CONFIG.PRIMARY_COLOR};
          color: white;
          border-bottom-right-radius: 6px;
        }

        .message.assistant {
          align-self: flex-start;
          background: #f1f3f5;
          color: ${CONFIG.SECONDARY_COLOR};
          border-bottom-left-radius: 6px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.6;
          margin-top: 4px;
          text-align: right;
        }

        .message.assistant .message-time {
          text-align: left;
        }

        /* Indicateur de frappe */
        .typing-indicator {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f1f3f5;
          border-radius: 18px;
          border-bottom-left-radius: 6px;
          align-self: flex-start;
          margin: 0 20px 20px;
          color: #666;
          font-size: 14px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #999;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Footer */
        .chatbot-footer {
          border-top: 1px solid #e9ecef;
          padding: 16px;
          background: white;
          flex-shrink: 0;
        }

        .input-container {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        #messageInput {
          flex: 1;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 14px;
          resize: none;
          max-height: 120px;
          outline: none;
          transition: border-color 0.2s;
        }

        #messageInput:focus {
          border-color: ${CONFIG.PRIMARY_COLOR};
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: ${CONFIG.SECONDARY_COLOR};
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover {
          background: ${CONFIG.PRIMARY_COLOR};
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .quick-btn {
          padding: 8px 12px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-btn:hover {
          background: ${CONFIG.PRIMARY_COLOR};
          color: white;
          border-color: ${CONFIG.PRIMARY_COLOR};
        }

        /* États de chargement */
        .loading {
          opacity: 0.6;
          pointer-events: none;
        }

        /* Responsive 100% */
        @media (max-width: 768px) {
          .luminara-chatbot-interface {
            width: 100vw !important;
            height: 100vh !important;
            bottom: 0 !important;
            right: 0 !important;
            border-radius: 0 !important;
          }

          .luminara-chatbot-launcher {
            bottom: 20px;
            right: 20px;
          }

          .message {
            max-width: 90%;
          }
        }

        @media (max-width: 480px) {
          .chatbot-header {
            padding: 16px;
          }

          .messages-container {
            padding: 16px;
          }

          .chatbot-footer {
            padding: 12px;
          }

          .quick-actions {
            gap: 6px;
          }

          .quick-btn {
            font-size: 11px;
            padding: 6px 10px;
          }
        }

        /* Animation d'ouverture */
        @keyframes widgetOpen {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Scrollbar personnalisée */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupEventListeners() {
    // Lanceur
    document.getElementById('luminaraLauncher').addEventListener('click', () => {
      this.toggleChat();
    });

    // Boutons header
    document.getElementById('minimizeBtn').addEventListener('click', () => {
      this.toggleMinimize();
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
      this.closeChat();
    });

    // Envoi de message
    document.getElementById('sendBtn').addEventListener('click', () => {
      this.sendMessage();
    });

    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    document.getElementById('messageInput').addEventListener('input', (e) => {
      this.autoResizeTextarea(e.target);
    });

    // Actions rapides
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const message = e.target.getAttribute('data-message');
        document.getElementById('messageInput').value = message;
        this.sendMessage();
      });
    });

    // Fermer en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.widgetContainer.contains(e.target)) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const interface = document.getElementById('luminaraInterface');
    
    if (this.isOpen) {
      interface.classList.add('open');
      document.getElementById('messageInput').focus();
      this.clearNotifications();
      this.scrollToBottom();
    } else {
      interface.classList.remove('open');
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const interface = document.getElementById('luminaraInterface');
    
    if (this.isMinimized) {
      interface.classList.add('minimized');
      document.getElementById('chatbotBody').style.display = 'none';
      document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-window-maximize"></i>';
    } else {
      interface.classList.remove('minimized');
      document.getElementById('chatbotBody').style.display = 'flex';
      document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-window-minimize"></i>';
    }
  }

  closeChat() {
    this.isOpen = false;
    this.isMinimized = false;
    const interface = document.getElementById('luminaraInterface');
    interface.classList.remove('open', 'minimized');
    document.getElementById('chatbotBody').style.display = 'flex';
    document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-window-minimize"></i>';
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  async sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || this.isLoading) return;

    // Ajouter le message utilisateur
    this.addMessage('user', message);
    input.value = '';
    this.autoResizeTextarea(input);

    // Afficher l'indicateur de frappe
    this.showTypingIndicator();

    // Envoyer au serveur
    try {
      const response = await fetch(`${CONFIG.SERVER_URL}/api/visitor-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitor_id: this.visitorId,
          message: message
        })
      });

      if (!response.ok) throw new Error('Network error');

      // Attendre la réponse AI
      await this.waitForAIResponse();

    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage('assistant', 'Désolé, je rencontre des difficultés techniques. Pouvez-vous réessayer ?');
      this.hideTypingIndicator();
    }
  }

  async waitForAIResponse(maxAttempts = 10) {
    let attempts = 0;
    
    const checkResponse = async () => {
      attempts++;
      
      try {
        const response = await fetch(`${CONFIG.SERVER_URL}/api/chat-response/${this.visitorId}`);
        const data = await response.json();

        if (data.success && data.message) {
          this.hideTypingIndicator();
          this.addMessage('assistant', data.message);
          
          // Afficher les produits recommandés si présents
          if (data.recommended_products && data.recommended_products.length > 0) {
            this.showRecommendedProducts(data.recommended_products);
          }
          return true;
        }

        if (attempts >= maxAttempts) {
          this.hideTypingIndicator();
          this.addMessage('assistant', 'Je met un peu de temps à réfléchir... Pouvez-vous reformuler votre question ?');
          return true;
        }

        // Réessayer après 1 seconde
        setTimeout(checkResponse, 1000);
        
      } catch (error) {
        console.error('Error checking AI response:', error);
        if (attempts >= maxAttempts) {
          this.hideTypingIndicator();
          this.addMessage('assistant', 'Erreur de connexion. Veuillez réessayer.');
          return true;
        }
        setTimeout(checkResponse, 1000);
      }
    };

    await checkResponse();
  }

  addMessage(role, content) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    
    const timestamp = new Date().toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = `
      <div class="message-content">${this.formatMessage(content)}</div>
      <div class="message-time">${timestamp}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();

    // Sauvegarder dans l'historique local
    this.conversation.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    this.saveConversation();
  }

  formatMessage(content) {
    // Formater les liens
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #00f0ff; text-decoration: underline;">$1</a>');
    
    // Formater le texte en gras
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Formater les sauts de ligne
    content = content.replace(/\n/g, '<br>');
    
    return content;
  }

  showRecommendedProducts(products) {
    const messagesContainer = document.getElementById('messagesContainer');
    const productsDiv = document.createElement('div');
    
    productsDiv.className = 'message assistant';
    productsDiv.innerHTML = `
      <div class="message-content">
        <strong>🎯 Produits recommandés :</strong><br>
        ${products.map(product => `
          • <strong>${product.name}</strong> - $${product.price}<br>
          <em>${product.description || 'Produit premium Luminara'}</em>
        `).join('<br>')}
      </div>
    `;

    messagesContainer.appendChild(productsDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    this.isLoading = true;
    document.getElementById('typingIndicator').style.display = 'flex';
    document.getElementById('sendBtn').disabled = true;
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isLoading = false;
    document.getElementById('typingIndicator').style.display = 'none';
    document.getElementById('sendBtn').disabled = false;
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async checkForNewMessages() {
    if (this.isOpen || this.isLoading) return;

    try {
      const response = await fetch(`${CONFIG.SERVER_URL}/api/chat-response/${this.visitorId}`);
      const data = await response.json();

      if (data.success && data.message && !data.read) {
        this.unreadMessages++;
        this.showNotification();
        
        // Notification sonore (optionnelle)
        this.playNotificationSound();
      }
    } catch (error) {
      console.error('Error checking new messages:', error);
    }
  }

  showNotification() {
    const badge = document.getElementById('notificationBadge');
    badge.textContent = this.unreadMessages;
    badge.style.display = 'flex';
    
    // Animation de pulsation
    badge.style.animation = 'pulse 1s infinite';
  }

  clearNotifications() {
    this.unreadMessages = 0;
    const badge = document.getElementById('notificationBadge');
    badge.style.display = 'none';
    badge.style.animation = 'none';
  }

  playNotificationSound() {
    // Créer un son de notification simple
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
  }

  loadConversation() {
    const saved = localStorage.getItem(`luminara_conversation_${this.visitorId}`);
    if (saved) {
      this.conversation = JSON.parse(saved);
      this.renderConversation();
    }
  }

  saveConversation() {
    localStorage.setItem(`luminara_conversation_${this.visitorId}`, JSON.stringify(this.conversation));
  }

  renderConversation() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    this.conversation.forEach(msg => {
      this.addMessage(msg.role, msg.content);
    });
  }
}

// Initialisation quand la page est chargée
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LuminaraChatbot();
  });
} else {
  new LuminaraChatbot();
}

})();
