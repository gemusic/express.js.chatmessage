<script>
// ========================================
// LUMINARA ULTIMATE TRACKING SYSTEM V7.0
// ENVOI DIRECT À LINDY APRÈS 20 SECONDES - VERSION COMPLÈTE
// ========================================

(function() {
'use strict';

// Configuration avec URL Lindy directe (NOUVEAUX)
const CONFIG = {
  LINDY_WEBHOOK_URL: 'https://public.lindy.ai/api/v1/webhooks/lindy/6d043f16-eb07-4779-aa87-da5c66ece2bb',
  LINDY_TOKEN: 'b0067e045ad28ab185a312ce0e4e7cdf0317b95cefe630e3da5baeef1d00a5b3',
  ACCUMULATION_TIME: 20000, // 20 SECONDES EXACTEMENT
  VISITOR_ID_KEY: 'luminara_visitor_id',
  SESSION_ID_KEY: 'luminara_session_id',
  MAX_EVENTS: 500
};

class LuminaraTracker {
  constructor() {
    this.visitorId = this.generateUniqueVisitorId();
    this.sessionId = this.generateUniqueSessionId();
    this.pageStartTime = Date.now();
    this.lastActivity = Date.now();
    this.events = [];
    this.hasSentData = false;
    this.isSending = false;
    this.trackingActive = true;
    this.forceSendScheduled = false;

    this.accumulatedData = this.initializeDataStructure();
    
    this.init();
    this.startGuaranteedSendTimer();
  }

  generateUniqueVisitorId() {
    let visitorId = localStorage.getItem(CONFIG.VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 12);
      localStorage.setItem(CONFIG.VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
  }

  generateUniqueSessionId() {
    let sessionId = sessionStorage.getItem(CONFIG.SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(CONFIG.SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }

  initializeDataStructure() {
    return {
      visitor_id: this.visitorId,
      session_id: this.sessionId,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      start_time: this.pageStartTime,

      device_info: {
        user_agent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookie_enabled: navigator.cookieEnabled
      },

      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        device_pixel_ratio: window.devicePixelRatio
      },

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
      
      product_views: [],
      product_clicks: [],
      product_hovers: [],
      add_to_cart_events: [],
      cart_actions: [],
      checkout_attempts: [],
      product_interactions: [],

      navigation_events: [],
      form_interactions: [],

      session_end_time: null,
      data_sent: false,
      transmission_guaranteed: false
    };
  }

  init() {
    if (!this.trackingActive) return;

    console.log('🎯 Luminara Tracking Activé - ID:', this.visitorId, 'Envoi direct à Lindy');

    this.trackNavigation();
    this.trackScrollBehavior();
    this.trackMouseInteractions();
    this.trackEcommerceInteractions();
    this.trackFormInteractions();
  }

  startGuaranteedSendTimer() {
    console.log('⏰ Timer 20s démarré - Envoi direct à Lindy pour:', this.visitorId);
    
    setTimeout(() => {
      if (this.trackingActive && !this.hasSentData && !this.forceSendScheduled) {
        console.log('🕒 20 SECONDES ÉCOULÉES - Envoi DIRECT à Lindy pour:', this.visitorId);
        this.forceSendScheduled = true;
        this.sendDirectToLindy();
      }
    }, CONFIG.ACCUMULATION_TIME);
  }

  trackNavigation() {
    if (!this.trackingActive) return;

    this.accumulatedData.navigation_events.push({
      type: 'page_view',
      url: window.location.href,
      timestamp: Date.now()
    });

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

    window.addEventListener('beforeunload', () => {
      if (!this.hasSentData && this.trackingActive) {
        console.log('🚪 Utilisateur quitte - Envoi URGENT à Lindy pour:', this.visitorId);
        this.accumulatedData.exit_intent = {
          timestamp: Date.now(),
          scroll_depth: this.accumulatedData.scroll_behavior.depth_percentage,
          time_on_page: Date.now() - this.pageStartTime,
          forced_send: true
        };
        this.sendDirectToLindy();
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

    setTimeout(() => {
      this.trackInitialProductViews();
    }, 1500);

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
        }
      }

      if (e.target.closest('.add-to-cart, .add-to-cart-small, [data-action="add-to-cart"]')) {
        const productElement = this.findProductElement(e.target);
        const productInfo = productElement ? this.extractProductInfo(productElement) : null;
        
        this.accumulatedData.add_to_cart_events.push({
          action: 'add_to_cart',
          product: productInfo,
          timestamp: Date.now(),
          element: this.getElementInfo(e.target)
        });
      }

      if (e.target.closest('.checkout-btn, .checkout-btn, .proceed-to-checkout')) {
        this.accumulatedData.checkout_attempts.push({
          action: 'checkout_attempt',
          timestamp: Date.now(),
          element: this.getElementInfo(e.target)
        });
      }

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

    this.trackProductHovers();
    this.trackProductVisibility();
  }

  trackInitialProductViews() {
    const productCards = document.querySelectorAll('.product-card, .recommendation-card');
    productCards.forEach(card => {
      const productInfo = this.extractProductInfo(card);
      if (productInfo && !this.isProductAlreadyViewed(productInfo.id)) {
        this.accumulatedData.product_views.push({
          ...productInfo,
          timestamp: Date.now(),
          view_type: 'initial'
        });
      }
    });
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

  findProductElement(element) {
    return element.closest('.product-card, [data-product-id], .item, .product, .recommendation-card, .cart-item');
  }

  extractProductInfo(productElement) {
    try {
      const productId = productElement.getAttribute('data-product-id') ||
                       productElement.getAttribute('data-id') ||
                       productElement.querySelector('[data-product-id]')?.getAttribute('data-product-id') ||
                       'unknown';

      const productName = productElement.querySelector('.product-name, .item-name, [data-product-name], .name, h3, .item-name')?.textContent?.trim() ||
                         productElement.getAttribute('data-product-name') ||
                         productElement.querySelector('h3, h4')?.textContent?.trim() ||
                         'Produit Luminara';

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

  sendDirectToLindy() {
    if (this.isSending || this.hasSentData) {
      console.log('⏭️ Données déjà envoyées à Lindy - Ignoré pour:', this.visitorId);
      return;
    }
    
    this.isSending = true;

    const currentTime = Date.now();
    this.accumulatedData.time_tracking.total_time = currentTime - this.pageStartTime;
    this.accumulatedData.session_end_time = currentTime;
    this.accumulatedData.data_sent = true;
    this.accumulatedData.transmission_guaranteed = true;
    this.accumulatedData.transmission_type = this.forceSendScheduled ? 'auto_20s_direct' : 'manual_direct';

    const payload = {
      ...this.accumulatedData,
      transmission_timestamp: new Date().toISOString(),
      tracking_version: 'v7.0-direct-to-lindy',
      visitor_country: this.getVisitorCountry(),
      page_load_time: this.getPageLoadTime(),
      lindy_integration: true,
      source: 'luminara_direct_tracking'
    };

    console.log('📤 ENVOI DIRECT À LINDY pour:', this.visitorId);
    console.log('🔗 URL Lindy:', CONFIG.LINDY_WEBHOOK_URL);
    console.log('📊 Données envoyées:', {
      durée: Math.round((currentTime - this.pageStartTime) / 1000) + 's',
      produits_vus: payload.product_views.length,
      actions_panier: payload.add_to_cart_events.length,
      profondeur_scroll: payload.scroll_behavior.depth_percentage + '%'
    });

    this.sendToLindyWebhook(payload);
  }

  sendToLindyWebhook(payload) {
    fetch(CONFIG.LINDY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.LINDY_TOKEN}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      return response.json();
    })
    .then(data => {
      console.log('✅ DONNÉES ENVOYÉES DIRECTEMENT À LINDY pour:', this.visitorId);
      this.hasSentData = true;
      this.trackingActive = false;
      this.events = [];
    })
    .catch(error => {
      console.error('❌ Erreur envoi direct à Lindy:', error);
      this.retryLindySend(payload);
    })
    .finally(() => {
      this.isSending = false;
    });
  }

  retryLindySend(payload, attempt = 1) {
    if (attempt > 3) {
      console.error('💥 Échec après 3 tentatives vers Lindy pour:', this.visitorId);
      return;
    }

    setTimeout(() => {
      console.log(`🔄 Tentative ${attempt} vers Lindy pour:`, this.visitorId);
      this.sendToLindyWebhook(payload);
    }, attempt * 2000);
  }

  getVisitorCountry() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'unknown';
    }
  }

  getPageLoadTime() {
    if (window.performance && window.performance.timing) {
      return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    }
    return null;
  }

  forceSendData() {
    if (!this.hasSentData && this.trackingActive) {
      console.log('🚨 Envoi forcé manuellement à Lindy pour:', this.visitorId);
      this.sendDirectToLindy();
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
      sessionId: this.sessionId,
      productsTracked: this.accumulatedData.product_views.length,
      transmission_guaranteed: this.forceSendScheduled,
      destination: 'LINDY_DIRECT'
    };
  }
}

// Initialisation
console.log('🚀 Initialisation Luminara Tracking V7 - Envoi Direct à Lindy');
window.LuminaraTracker = new LuminaraTracker();

window.LuminaraTracking = {
  getVisitorId: () => window.LuminaraTracker?.getVisitorId(),
  getStatus: () => window.LuminaraTracker?.getTrackingStatus(),
  forceSend: () => window.LuminaraTracker?.forceSendData()
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🏪 Luminara Tracking V7 initialisé - Envoi direct à Lindy');
  });
} else {
  console.log('🏪 Luminara Tracking V7 initialisé - Envoi direct à Lindy');
}

})();
</script>
