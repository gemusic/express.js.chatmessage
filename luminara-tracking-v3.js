// ========================================
// LUMINARA TRACKING SCRIPT V3
// DYNAMIC PRODUCT DETECTION
// ========================================

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================

  const WEBHOOK_URL = 'https://public.lindy.ai/api/v1/webhooks/lindy/7acf721d-ccf0-4ae2-8327-ad991d9488a5';
  const WEBHOOK_TOKEN = 'fd17e82e6fe51ea0a6d1043ec2ad9425adfd358f9628227207a6a0eea9a951e3';
  const TRANSMISSION_INTERVAL = 30000; // 30 seconds

  // ========================================
  // VISITOR ID MANAGEMENT
  // ========================================

  function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem('luminara_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('luminara_visitor_id', visitorId);
    }
    return visitorId;
  }

  const visitorId = getOrCreateVisitorId();

  // ========================================
  // DATA STORAGE
  // ========================================

  const trackingData = {
    visitor_id: visitorId,
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer || 'direct',
    session_start: new Date().toISOString(),
    time_on_page: 0,
    scroll_depth: 0,
    max_scroll_depth: 0,
    mouse_movements: [],
    clicks: 0,
    form_interactions: 0,
    product_views: {},
    cart_actions: [],
    device_info: {
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      device_type: getDeviceType()
    },
    back_button_count: 0,
    inactivity_periods: [],
    tab_switches: 0,
    search_queries: [],
    review_reading_time: 0,
    price_filter_interactions: 0,
    checkout_page_time: 0,
    form_errors: 0,
    promo_code_attempts: 0
  };

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // ========================================
  // DYNAMIC PRODUCT DETECTION
  // ========================================

  function detectProductFromElement(element) {
    // Method 1: Check onclick attribute for addToCart
    const onclick = element.getAttribute('onclick');
    if (onclick && onclick.includes('addToCart')) {
      const match = onclick.match(/addToCart\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*(\d+)/);
      if (match) {
        return {
          id: match[1],
          name: match[2],
          price: parseFloat(match[3])
        };
      }
    }

    // Method 2: Find product card structure
    const productCard = element.closest('.product-card') || element.closest('[class*="product"]');
    if (productCard) {
      const nameElement = productCard.querySelector('h3') || productCard.querySelector('[class*="name"]');
      const priceElement = productCard.querySelector('.price') || productCard.querySelector('[class*="price"]');
      
      if (nameElement && priceElement) {
        const name = nameElement.textContent.trim();
        const priceText = priceElement.textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        
        return {
          id: 'prod_' + name.toLowerCase().replace(/\s+/g, '_'),
          name: name,
          price: price
        };
      }
    }

    // Method 3: Check global products array
    if (window.products && Array.isArray(window.products)) {
      const productName = element.textContent.trim();
      const product = window.products.find(p => p.name === productName);
      if (product) {
        return {
          id: product.id || 'prod_' + product.name.toLowerCase().replace(/\s+/g, '_'),
          name: product.name,
          price: product.price
        };
      }
    }

    return null;
  }

  // ========================================
  // PRODUCT VIEW TRACKING
  // ========================================

  function trackProductView(productId, productName, price) {
    if (!trackingData.product_views[productId]) {
      trackingData.product_views[productId] = {
        product_name: productName,
        price: price,
        hover_time: 0,
        view_count: 0
      };
    }
    trackingData.product_views[productId].view_count++;
  }

  // ========================================
  // CART ACTION TRACKING
  // ========================================

  function trackCartAction(action, productId, productName, price) {
    trackingData.cart_actions.push({
      action: action,
      product_id: productId,
      product_name: productName,
      price: price,
      timestamp: new Date().toISOString()
    });
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================

  // Time on page
  let startTime = Date.now();
  setInterval(() => {
    trackingData.time_on_page = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);

  // Scroll tracking
  let lastScrollTime = Date.now();
  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
    
    trackingData.scroll_depth = scrollPercent;
    trackingData.max_scroll_depth = Math.max(trackingData.max_scroll_depth, scrollPercent);
    
    lastScrollTime = Date.now();
  }, 100));

  // Mouse movement tracking (sampled)
  let mouseMoveCount = 0;
  window.addEventListener('mousemove', (e) => {
    mouseMoveCount++;
    if (mouseMoveCount % 10 === 0) { // Sample every 10th movement
      if (trackingData.mouse_movements.length < 50) { // Limit storage
        trackingData.mouse_movements.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        });
      }
    }
  });

  // Click tracking with dynamic product detection
  window.addEventListener('click', (e) => {
    trackingData.clicks++;
    
    // Detect product from clicked element
    const product = detectProductFromElement(e.target);
    if (product) {
      trackProductView(product.id, product.name, product.price);
      
      // Check if it's an "Add to Cart" action
      const onclick = e.target.getAttribute('onclick');
      if (onclick && onclick.includes('addToCart')) {
        trackCartAction('add_to_cart', product.id, product.name, product.price);
      }
    }
  });

  // Form interaction tracking
  document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      trackingData.form_interactions++;
    }
  });

  // Back button detection
  window.addEventListener('popstate', () => {
    trackingData.back_button_count++;
  });

  // Tab visibility tracking
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackingData.tab_switches++;
    }
  });

  // Inactivity tracking
  let inactivityTimer;
  let inactivityStart = Date.now();
  
  function resetInactivityTimer() {
    if (inactivityTimer) {
      const inactivityDuration = Date.now() - inactivityStart;
      if (inactivityDuration > 5000) { // More than 5 seconds
        trackingData.inactivity_periods.push({
          duration: Math.floor(inactivityDuration / 1000),
          timestamp: new Date().toISOString()
        });
      }
    }
    clearTimeout(inactivityTimer);
    inactivityStart = Date.now();
    inactivityTimer = setTimeout(() => {}, 5000);
  }
  
  ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
    window.addEventListener(event, resetInactivityTimer);
  });

  // Review section detection
  const reviewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const reviewStartTime = Date.now();
        const stopObserving = () => {
          trackingData.review_reading_time += Math.floor((Date.now() - reviewStartTime) / 1000);
          reviewObserver.unobserve(entry.target);
        };
        setTimeout(stopObserving, 3000);
      }
    });
  });

  // Observe review sections
  document.querySelectorAll('[class*="review"], [id*="review"]').forEach(el => {
    reviewObserver.observe(el);
  });

  // Price filter tracking
  document.addEventListener('change', (e) => {
    if (e.target.type === 'range' || e.target.name?.includes('price')) {
      trackingData.price_filter_interactions++;
    }
  });

  // Checkout page detection
  if (window.location.href.includes('checkout') || window.location.href.includes('cart')) {
    const checkoutStartTime = Date.now();
    setInterval(() => {
      trackingData.checkout_page_time = Math.floor((Date.now() - checkoutStartTime) / 1000);
    }, 1000);
  }

  // Form error detection
  document.addEventListener('invalid', () => {
    trackingData.form_errors++;
  }, true);

  // Promo code detection
  document.addEventListener('input', (e) => {
    if (e.target.name?.includes('promo') || e.target.name?.includes('coupon')) {
      trackingData.promo_code_attempts++;
    }
  });

  // ========================================
  // PRODUCT HOVER TIME TRACKING
  // ========================================

  let hoverTimers = {};

  document.addEventListener('mouseover', (e) => {
    const product = detectProductFromElement(e.target);
    if (product && !hoverTimers[product.id]) {
      hoverTimers[product.id] = Date.now();
    }
  });

  document.addEventListener('mouseout', (e) => {
    const product = detectProductFromElement(e.target);
    if (product && hoverTimers[product.id]) {
      const hoverDuration = Date.now() - hoverTimers[product.id];
      if (!trackingData.product_views[product.id]) {
        trackingData.product_views[product.id] = {
          product_name: product.name,
          price: product.price,
          hover_time: 0,
          view_count: 0
        };
      }
      trackingData.product_views[product.id].hover_time += Math.floor(hoverDuration / 1000);
      delete hoverTimers[product.id];
    }
  });

  // ========================================
  // DATA TRANSMISSION
  // ========================================

  function sendDataToWebhook() {
    const payload = {
      ...trackingData,
      sent_at: new Date().toISOString()
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_TOKEN}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        console.log('✅ Luminara tracking data sent successfully');
      } else {
        console.error('❌ Failed to send tracking data:', response.status);
      }
    })
    .catch(error => {
      console.error('❌ Error sending tracking data:', error);
    });
  }

  // Send data every 30 seconds
  setInterval(sendDataToWebhook, TRANSMISSION_INTERVAL);

  // Send data before page unload
  window.addEventListener('beforeunload', () => {
    sendDataToWebhook();
  });

  // ========================================
  // PUBLIC API
  // ========================================

  window.LuminaraTracker = {
    trackProductView: trackProductView,
    trackCartAction: trackCartAction,
    trackPromoCode: () => trackingData.promo_code_attempts++,
    getData: () => trackingData
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  console.log('🚀 Luminara Tracking V3 initialized for visitor:', visitorId);

})();

