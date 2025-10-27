// ========================================
// LUMINARA ULTIMATE TRACKING SYSTEM V6.0
// Parfaitement intégré avec le site Luminara
// ========================================

(function() {
'use strict';

// Configuration
const CONFIG = {
  SERVER_URL: 'https://luminara-express-server.onrender.com',
  ACCUMULATION_TIME: 20000,
  VISITOR_ID_KEY: 'luminara_visitor_id',
  MAX_EVENTS: 500
};

class LuminaraTracker {
  constructor() {
    this.visitorId = this.generateVisitorId();
    this.sessionId = this.generateSessionId();
    this.pageStartTime = Date.now();
    this.lastActivity = Date.now();
    this.events = [];
    this.hasSentData = false;
    this.isSending = false;
    this.trackingActive = true;

    this.accumulatedData = this.initializeDataStructure();
    
    this.init();
    this.startShutdownTimer();
  }

  generateVisitorId() {
    let visitorId = localStorage.getItem(CONFIG.VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
      localStorage.setItem(CONFIG.VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initializeDataStructure() {
    return {
      visitor_id: this.visitorId,
      session_id: this.sessionId,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      start_time: this.pageStartTime,

      device_info: this.getDeviceInfo(),
      viewport: this.getViewportInfo(),

      page_visits: [{
        url: window.location.href,
        timestamp: this.pageStartTime,
        duration: 0
      }],

      time_tracking: {
        total_time: 0,
        active_time: 0,
        inactive_time: 0
      },

      scroll_behavior: {
        depth_percentage: 0,
        max_depth: 0,
        scroll_events: [],
        time_to_scroll: null
      },

      mouse_movements: [],
      mouse_clicks: [],
      
      // Interactions e-commerce spécifiques à Luminara
      product_views: [],
      product_clicks: [],
      product_hovers: [],
      add_to_cart_events: [],
      cart_actions: [],
      checkout_attempts: [],
      product_interactions: [],

      // Événements de navigation
      navigation_events: [],
      form_interactions: [],

      session_end_time: null,
      data_sent: false
    };
  }

  getDeviceInfo() {
    return {
      user_agent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      device_pixel_ratio: window.devicePixelRatio
    };
  }

  init() {
    if (!this.trackingActive) return;

    console.log('🎯 Luminara Tracking Activé - ID:', this.visitorId);

    this.trackNavigation();
    this.trackScrollBehavior();
    this.trackMouseInteractions();
    this.trackEcommerceInteractions();
    this.trackFormInteractions();
    
    this.startSingleSendTimer();
  }

  startSingleSendTimer() {
    setTimeout(() => {
      if (this.trackingActive && !this.hasSentData) {
        this.sendAccumulatedData();
      }
    }, CONFIG.ACCUMULATION_TIME);
  }

  startShutdownTimer() {
    setTimeout(() => {
      this.trackingActive = false;
      this.events = [];
    }, CONFIG.ACCUMULATION_TIME + 5000);
  }

  trackNavigation() {
    if (!this.trackingActive) return;

    // Pages visitées
    this.accumulatedData.navigation_events.push({
      type: 'page_view',
      url: window.location.href,
      timestamp: Date.now()
    });

    // Liens cliqués
    document.addEventListener('click', (e) => {
      if (!this.trackingActive) return;

      const link = e.target.closest('a');
      if (link && link.href) {
        this.accumulatedData.navigation_events.push({
          type: 'link_click',
          url: link.href,
          text: link.textContent?.substring(0, 100),
          timestamp: Date.now()
        });
      }
    });

    // Avant de quitter la page
    window.addEventListener('beforeunload', () => {
      if (!this.hasSentData) {
        this.accumulatedData.exit_intent = {
          timestamp: Date.now(),
          scroll_depth: this.accumulatedData.scroll_behavior.depth_percentage,
          time_on_page: Date.now() - this.pageStartTime
        };
        this.sendAccumulatedData();
      }
    });
  }

  trackScrollBehavior() {
    if (!this.trackingActive) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();

    window.addEventListener('scroll', () => {
      if (!this.trackingActive) return;

      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = maxScroll > 0 ? Math.round((currentScrollY / maxScroll) * 100) : 0;

      this.accumulatedData.scroll_behavior.depth_percentage = scrollDepth;
      this.accumulatedData.scroll_behavior.max_depth = Math.max(
        this.accumulatedData.scroll_behavior.max_depth,
        scrollDepth
      );

      if (this.accumulatedData.scroll_behavior.scroll_events.length < 50) {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        const scrollDiff = Math.abs(currentScrollY - lastScrollY);
        const velocity = timeDiff > 0 ? scrollDiff / timeDiff : 0;

        this.accumulatedData.scroll_behavior.scroll_events.push({
          y_position: currentScrollY,
          depth_percentage: scrollDepth,
          velocity: velocity,
          timestamp: currentTime
        });

        if (!this.accumulatedData.scroll_behavior.time_to_scroll && currentScrollY > 0) {
          this.accumulatedData.scroll_behavior.time_to_scroll = currentTime - this.pageStartTime;
        }
      }

      lastScrollY = currentScrollY;
      lastScrollTime = Date.now();
      this.updateLastActivity();
    }, { passive: true });
  }

  trackMouseInteractions() {
    if (!this.trackingActive) return;

    let mouseMoveCount = 0;

    // Mouvements de souris
    document.addEventListener('mousemove', (e) => {
      if (!this.trackingActive) return;

      mouseMoveCount++;
      if (mouseMoveCount % 15 === 0 && this.accumulatedData.mouse_movements.length < 80) {
        this.accumulatedData.mouse_movements.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
      }
      this.updateLastActivity();
    }, { passive: true });

    // Clics
    document.addEventListener('click', (e) => {
      if (!this.trackingActive) return;

      const clickData = {
        element: this.getElementInfo(e.target),
        position: { x: e.clientX, y: e.clientY },
        timestamp: Date.now()
      };

      if (this.accumulatedData.mouse_clicks.length < 100) {
        this.accumulatedData.mouse_clicks.push(clickData);
      }

      this.updateLastActivity();
    });
  }

  trackEcommerceInteractions() {
    if (!this.trackingActive) return;

    // Vues de produits
    this.trackProductViews();

    // Clics sur produits
    document.addEventListener('click', (e) => {
      if (!this.trackingActive) return;

      const productElement = this.findProductElement(e.target);
      if (productElement) {
        const productInfo = this.extractProductInfo(productElement);
        if (productInfo) {
          this.accumulatedData.product_clicks.push({
            ...productInfo,
            timestamp: Date.now(),
            click_position: { x: e.clientX, y: e.clientY }
          });

          // Track conversion pour intérêt produit
          this.trackConversion('product_interest', productInfo);
        }
      }

      // Ajouts au panier Luminara
      if (e.target.closest('.add-to-cart, .add-to-cart-small, [data-action="add-to-cart"]')) {
        const productElement = this.findProductElement(e.target);
        const productInfo = productElement ? this.extractProductInfo(productElement) : null;
        
        this.accumulatedData.add_to_cart_events.push({
          action: 'add_to_cart',
          product: productInfo,
          timestamp: Date.now(),
          element: this.getElementInfo(e.target)
        });

        // Track conversion
        this.trackConversion('add_to_cart', productInfo);
      }

      // Checkout Luminara
      if (e.target.closest('.checkout-btn, .checkout-btn, .proceed-to-checkout')) {
        this.accumulatedData.checkout_attempts.push({
          action: 'checkout_attempt',
          timestamp: Date.now(),
          element: this.getElementInfo(e.target)
        });

        this.trackConversion('checkout_attempt');
      }

      // Interactions avec les cartes produits
      if (e.target.closest('.product-card, .recommendation-card')) {
        const productElement = e.target.closest('.product-card, .recommendation-card');
        const productInfo = this.extractProductInfo(productElement);
        if (productInfo) {
          this.accumulatedData.product_interactions.push({
            type: 'card_click',
            product: productInfo,
            timestamp: Date.now()
          });
        }
      }
    });

    // Hover sur produits
    this.trackProductHovers();

    // Views de produits avec Intersection Observer
    this.trackProductVisibility();
  }

  trackProductViews() {
    // Track initial product views from page load
    setTimeout(() => {
      const productCards = document.querySelectorAll('.product-card, .recommendation-card');
      productCards.forEach(card => {
        const productInfo = this.extractProductInfo(card);
        if (productInfo) {
          this.accumulatedData.product_views.push({
            ...productInfo,
            timestamp: Date.now(),
            view_type: 'initial'
          });
        }
      });
    }, 1000);
  }

  trackProductVisibility() {
    if (!this.trackingActive || !('IntersectionObserver' in window)) return;

    const productObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.trackingActive) {
          const productElement = entry.target;
          const productInfo = this.extractProductInfo(productElement);
          if (productInfo && !this.isProductAlreadyViewed(productInfo.id)) {
            this.accumulatedData.product_views.push({
              ...productInfo,
              timestamp: Date.now(),
              view_duration: 0,
              fully_visible: entry.intersectionRatio >= 0.8,
              view_type: 'scroll'
            });
          }
        }
      });
    }, { threshold: [0.1, 0.8] });

    // Observer tous les éléments produit Luminara
    setTimeout(() => {
      const productSelectors = '.product-card, [data-product-id], .item, .product, .recommendation-card';
      document.querySelectorAll(productSelectors).forEach(product => {
        productObserver.observe(product);
      });
    }, 2000);
  }

  trackProductHovers() {
    if (!this.trackingActive) return;

    let productHoverStart = null;
    let hoveredProduct = null;

    document.addEventListener('mouseover', (e) => {
      if (!this.trackingActive) return;

      const productElement = this.findProductElement(e.target);
      if (productElement) {
        productHoverStart = Date.now();
        hoveredProduct = productElement;
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!this.trackingActive) return;

      if (productHoverStart && hoveredProduct) {
        const productInfo = this.extractProductInfo(hoveredProduct);
        if (productInfo) {
          const hoverDuration = Date.now() - productHoverStart;
          if (hoverDuration > 500) {
            this.accumulatedData.product_hovers.push({
              ...productInfo,
              duration: hoverDuration,
              timestamp: Date.now()
            });
          }
        }
      }
      productHoverStart = null;
      hoveredProduct = null;
    });
  }

  trackFormInteractions() {
    if (!this.trackingActive) return;

    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.accumulatedData.form_interactions.push({
          type: 'form_focus',
          field_type: e.target.type,
          field_name: e.target.name || 'unknown',
          timestamp: Date.now()
        });
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea')) {
        this.accumulatedData.form_interactions.push({
          type: 'form_input',
          field_type: e.target.type,
          field_name: e.target.name || 'unknown',
          value_length: e.target.value.length,
          timestamp: Date.now()
        });
      }
    });
  }

  trackConversion(eventType, productData = null) {
    const conversionData = {
      visitor_id: this.visitorId,
      event_type: eventType,
      product: productData,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      session_id: this.sessionId
    };

    // Envoyer la conversion au serveur
    fetch(`${CONFIG.SERVER_URL}/api/analytics/conversion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversionData)
    }).catch(error => console.error('Conversion tracking error:', error));
  }

  // Méthodes utilitaires spécifiques Luminara
  findProductElement(element) {
    return element.closest('.product-card, [data-product-id], .item, .product, .recommendation-card, .cart-item');
  }

  extractProductInfo(productElement) {
    try {
      // Essayer différents sélecteurs Luminara
      const productId = productElement.getAttribute('data-product-id') ||
                       productElement.getAttribute('data-id') ||
                       productElement.querySelector('[data-product-id]')?.getAttribute('data-product-id') ||
                       'unknown';

      // Nom du produit
      const productName = productElement.querySelector('.product-name, .item-name, [data-product-name], .name, h3, .item-name')?.textContent?.trim() ||
                         productElement.getAttribute('data-product-name') ||
                         productElement.querySelector('h3, h4')?.textContent?.trim() ||
                         'Produit Luminara';

      // Prix du produit
      const productPrice = productElement.querySelector('.product-price, .item-price, .price, [data-price], .recommendation-price')?.textContent?.trim() ||
                          productElement.getAttribute('data-price') ||
                          productElement.querySelector('.price')?.textContent?.trim() ||
                          '0';

      return {
        id: productId,
        name: productName,
        price: this.extractPrice(productPrice),
        category: this.detectCategory(productName)
      };
    } catch (e) {
      return null;
    }
  }

  extractPrice(priceText) {
    const priceMatch = priceText.match(/\$?(\d+(?:\.\d{2})?)/);
    return priceMatch ? priceMatch[1] : '0';
  }

  detectCategory(productName) {
    const name = productName.toLowerCase();
    if (name.includes('earbud') || name.includes('headphone') || name.includes('speaker')) return 'audio';
    if (name.includes('watch') || name.includes('tracker') || name.includes('ring')) return 'wearables';
    if (name.includes('glass') || name.includes('ar') || name.includes('vr')) return 'augmented_reality';
    if (name.includes('charger') || name.includes('case') || name.includes('adapter')) return 'accessories';
    return 'other';
  }

  getElementInfo(element) {
    if (!element) return null;
    
    return {
      tag_name: element.tagName,
      id: element.id,
      class_name: element.className,
      text: element.textContent ? element.textContent.substring(0, 50) : null
    };
  }

  isProductAlreadyViewed(productId) {
    return this.accumulatedData.product_views.some(view =>
      view.id === productId && (Date.now() - view.timestamp) < 5000
    );
  }

  updateLastActivity() {
    this.lastActivity = Date.now();
  }

  sendAccumulatedData() {
    if (this.isSending || this.hasSentData) {
      console.log('⏭️ Data already sent - skipping');
      return;
    }
    
    this.isSending = true;
    this.hasSentData = true;

    // Calculs finaux
    const currentTime = Date.now();
    this.accumulatedData.time_tracking.total_time = currentTime - this.pageStartTime;
    this.accumulatedData.session_end_time = currentTime;
    this.accumulatedData.data_sent = true;

    const payload = {
      ...this.accumulatedData,
      transmission_timestamp: new Date().toISOString(),
      tracking_version: 'v6.0-luminara-optimized'
    };

    console.log('📤 Sending Luminara tracking data for:', this.visitorId);
    console.log('📊 Summary:', {
      products_viewed: payload.product_views.length,
      cart_actions: payload.add_to_cart_events.length,
      scroll_depth: payload.scroll_behavior.depth_percentage + '%'
    });

    // Envoyer au serveur Luminara
    fetch(`${CONFIG.SERVER_URL}/api/behavioral-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ Luminara tracking data sent successfully');
        this.trackingActive = false;
        this.events = [];
      }
    })
    .catch(error => {
      console.error('❌ Error sending Luminara tracking data:', error);
      this.hasSentData = true;
    })
    .finally(() => {
      this.isSending = false;
    });
  }

  // API publique pour intégration
  forceSendData() {
    if (!this.hasSentData && this.trackingActive) {
      this.sendAccumulatedData();
    }
  }

  getVisitorId() {
    return this.visitorId;
  }

  getTrackingStatus() {
    return {
      active: this.trackingActive,
      sent: this.hasSentData,
      duration: Date.now() - this.pageStartTime,
      visitorId: this.visitorId,
      productsTracked: this.accumulatedData.product_views.length
    };
  }

  // Méthode pour track des événements custom
  trackCustomEvent(eventType, eventData) {
    if (!this.trackingActive) return;

    this.events.push({
      type: eventType,
      data: eventData,
      timestamp: Date.now()
    });
  }
}

// Initialisation
console.log('🚀 Initializing Luminara Tracking V6 - Ecommerce Optimized');
window.LuminaraTracker = new LuminaraTracker();

// API globale pour intégration
window.LuminaraTracking = {
  getVisitorId: () => window.LuminaraTracker?.getVisitorId(),
  getStatus: () => window.LuminaraTracker?.getTrackingStatus(),
  forceSend: () => window.LuminaraTracker?.forceSendData(),
  trackEvent: (type, data) => window.LuminaraTracker?.trackCustomEvent(type, data)
};

// Auto-start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏪 Luminara Tracking initialized on Luminara e-commerce site');
  });
} else {
  console.log('🏪 Luminara Tracking initialized on Luminara e-commerce site');
}

})();
