// ========================================
‎// LUMINARA BEHAVIORAL TRACKING V4
‎// WITH 30-SECOND DATA ACCUMULATION
‎// ========================================
‎
‎(function() {
‎  'use strict';
‎
‎  // ========================================
‎  // CONFIGURATION
‎  // ========================================
‎
‎  const CONFIG = {
‎    WEBHOOK_URL: 'https://hook.us2.make.com/YOUR_WEBHOOK_ID',
‎    ACCUMULATION_TIME: 30000, // 30 seconds
‎    VISITOR_ID_KEY: 'luminara_visitor_id'
‎  };
‎
‎  // ========================================
‎  // DATA ACCUMULATOR
‎  // ========================================
‎
‎  const dataAccumulator = {
‎    visitor_id: null,
‎    page_url: window.location.href,
‎    start_time: Date.now(),
‎    
‎    // Behavioral metrics
‎    scroll_events: [],
‎    click_events: [],
‎    hover_events: [],
‎    mouse_movements: [],
‎    
‎    // Product interactions
‎    product_views: [],
‎    product_hovers: [],
‎    
‎    // Engagement metrics
‎    time_on_page: 0,
‎    scroll_depth: 0,
‎    max_scroll_depth: 0,
‎    
‎    // Decision signals
‎    back_button_clicks: 0,
‎    tab_switches: 0,
‎    inactivity_periods: [],
‎    
‎    // Cart & checkout
‎    cart_actions: 0,
‎    checkout_page_time: 0,
‎    abandoned_cart_attempts: 0,
‎    
‎    // Form interactions
‎    form_errors: 0,
‎    payment_issues: 0,
‎    
‎    // Comparison behavior
‎    products_compared: 0,
‎    price_filter_interactions: 0,
‎    
‎    // Trust signals
‎    reads_reviews: false,
‎    seeks_discounts: false,
‎    tries_promo_codes: false
‎  };
‎
‎  // ========================================
‎  // VISITOR ID MANAGEMENT
‎  // ========================================
‎
‎  function getOrCreateVisitorId() {
‎    let visitorId = localStorage.getItem(CONFIG.VISITOR_ID_KEY);
‎    
‎    if (!visitorId) {
‎      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
‎      localStorage.setItem(CONFIG.VISITOR_ID_KEY, visitorId);
‎    }
‎    
‎    return visitorId;
‎  }
‎
‎  dataAccumulator.visitor_id = getOrCreateVisitorId();
‎
‎  // ========================================
‎  // EVENT LISTENERS
‎  // ========================================
‎
‎  // Scroll tracking
‎  let lastScrollTime = Date.now();
‎  window.addEventListener('scroll', function() {
‎    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
‎    
‎    dataAccumulator.scroll_events.push({
‎      depth: scrollDepth,
‎      timestamp: Date.now()
‎    });
‎    
‎    dataAccumulator.scroll_depth = scrollDepth;
‎    dataAccumulator.max_scroll_depth = Math.max(dataAccumulator.max_scroll_depth, scrollDepth);
‎    
‎    lastScrollTime = Date.now();
‎  });
‎
‎  // Click tracking
‎  document.addEventListener('click', function(e) {
‎    const clickData = {
‎      element: e.target.tagName,
‎      class: e.target.className,
‎      id: e.target.id,
‎      text: e.target.innerText ? e.target.innerText.substring(0, 50) : '',
‎      timestamp: Date.now()
‎    };
‎    
‎    dataAccumulator.click_events.push(clickData);
‎    
‎    // Detect specific actions
‎    if (e.target.closest('[data-product-id]')) {
‎      const productId = e.target.closest('[data-product-id]').getAttribute('data-product-id');
‎      dataAccumulator.product_views.push(productId);
‎    }
‎    
‎    if (e.target.closest('.add-to-cart, [data-action="add-to-cart"]')) {
‎      dataAccumulator.cart_actions++;
‎    }
‎    
‎    if (e.target.closest('.back-button, [data-action="back"]')) {
‎      dataAccumulator.back_button_clicks++;
‎    }
‎    
‎    if (e.target.closest('.review, [data-section="reviews"]')) {
‎      dataAccumulator.reads_reviews = true;
‎    }
‎    
‎    if (e.target.closest('.discount, .promo, [data-action="apply-promo"]')) {
‎      dataAccumulator.seeks_discounts = true;
‎    }
‎  });
‎
‎  // Hover tracking
‎  let hoverTimeout;
‎  document.addEventListener('mouseover', function(e) {
‎    const hoverStart = Date.now();
‎    
‎    hoverTimeout = setTimeout(function() {
‎      const hoverDuration = Date.now() - hoverStart;
‎      
‎      dataAccumulator.hover_events.push({
‎        element: e.target.tagName,
‎        class: e.target.className,
‎        duration: hoverDuration,
‎        timestamp: Date.now()
‎      });
‎      
‎      // Product hover detection
‎      if (e.target.closest('[data-product-id]')) {
‎        const productId = e.target.closest('[data-product-id]').getAttribute('data-product-id');
‎        dataAccumulator.product_hovers.push({
‎          product_id: productId,
‎          duration: hoverDuration
‎        });
‎      }
‎    }, 500); // 500ms hover threshold
‎  });
‎
‎  document.addEventListener('mouseout', function() {
‎    clearTimeout(hoverTimeout);
‎  });
‎
‎  // Mouse movement tracking (sampled)
‎  let mouseMoveCount = 0;
‎  document.addEventListener('mousemove', function(e) {
‎    mouseMoveCount++;
‎    
‎    // Sample every 10th movement to avoid overload
‎    if (mouseMoveCount % 10 === 0) {
‎      dataAccumulator.mouse_movements.push({
‎        x: e.clientX,
‎        y: e.clientY,
‎        timestamp: Date.now()
‎      });
‎    }
‎  });
‎
‎  // Inactivity detection
‎  let inactivityTimer;
‎  let lastActivityTime = Date.now();
‎  
‎  function resetInactivityTimer() {
‎    clearTimeout(inactivityTimer);
‎    
‎    const inactivityDuration = Date.now() - lastActivityTime;
‎    if (inactivityDuration > 5000) { // 5 seconds of inactivity
‎      dataAccumulator.inactivity_periods.push({
‎        duration: inactivityDuration,
‎        timestamp: Date.now()
‎      });
‎    }
‎    
‎    lastActivityTime = Date.now();
‎    
‎    inactivityTimer = setTimeout(function() {
‎      // User inactive for 10 seconds
‎    }, 10000);
‎  }
‎
‎  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
‎    document.addEventListener(event, resetInactivityTimer);
‎  });
‎
‎  // Tab visibility tracking
‎  document.addEventListener('visibilitychange', function() {
‎    if (document.hidden) {
‎      dataAccumulator.tab_switches++;
‎    }
‎  });
‎
‎  // Form error tracking
‎  document.addEventListener('invalid', function() {
‎    dataAccumulator.form_errors++;
‎  }, true);
‎
‎  // ========================================
‎  // DATA ANALYSIS & TRANSMISSION
‎  // ========================================
‎
‎  function analyzeAndSendData() {
‎    // Calculate time on page
‎    dataAccumulator.time_on_page = Math.round((Date.now() - dataAccumulator.start_time) / 1000);
‎    
‎    // Calculate engagement metrics
‎    const totalClicks = dataAccumulator.click_events.length;
‎    const totalScrolls = dataAccumulator.scroll_events.length;
‎    const totalHovers = dataAccumulator.hover_events.length;
‎    
‎    // Calculate scroll speed
‎    const scrollSpeed = totalScrolls > 0 ? 
‎      (dataAccumulator.max_scroll_depth / dataAccumulator.time_on_page) : 0;
‎    
‎    // Calculate average hover time
‎    const avgHoverTime = totalHovers > 0 ?
‎      dataAccumulator.hover_events.reduce((sum, h) => sum + h.duration, 0) / totalHovers : 0;
‎    
‎    // Calculate inactivity score
‎    const totalInactivityTime = dataAccumulator.inactivity_periods.reduce((sum, p) => sum + p.duration, 0);
‎    const inactivityScore = dataAccumulator.time_on_page > 0 ?
‎      (totalInactivityTime / (dataAccumulator.time_on_page * 1000)) * 100 : 0;
‎    
‎    // Prepare final payload
‎    const payload = {
‎      // Identity
‎      visitor_id: dataAccumulator.visitor_id,
‎      page_url: dataAccumulator.page_url,
‎      timestamp: new Date().toISOString(),
‎      
‎      // Time metrics
‎      time_on_page: dataAccumulator.time_on_page,
‎      
‎      // Engagement metrics
‎      total_clicks: totalClicks,
‎      total_scrolls: totalScrolls,
‎      total_hovers: totalHovers,
‎      scroll_depth: dataAccumulator.scroll_depth,
‎      max_scroll_depth: dataAccumulator.max_scroll_depth,
‎      scroll_speed: Math.round(scrollSpeed * 100) / 100,
‎      avg_hover_time: Math.round(avgHoverTime),
‎      
‎      // Product interactions
‎      product_views: [...new Set(dataAccumulator.product_views)], // Unique products
‎      product_hovers: dataAccumulator.product_hovers,
‎      products_compared: dataAccumulator.products_compared,
‎      
‎      // Decision signals
‎      back_button_clicks: dataAccumulator.back_button_clicks,
‎      tab_switches: dataAccumulator.tab_switches,
‎      inactivity_score: Math.round(inactivityScore),
‎      inactivity_periods: dataAccumulator.inactivity_periods.length,
‎      
‎      // Cart & checkout
‎      cart_actions: dataAccumulator.cart_actions,
‎      checkout_page_time: dataAccumulator.checkout_page_time,
‎      abandoned_cart_attempts: dataAccumulator.abandoned_cart_attempts,
‎      
‎      // Form & payment
‎      form_errors: dataAccumulator.form_errors,
‎      payment_issues: dataAccumulator.payment_issues,
‎      
‎      // Trust signals
‎      reads_reviews: dataAccumulator.reads_reviews,
‎      seeks_discounts: dataAccumulator.seeks_discounts,
‎      tries_promo_codes: dataAccumulator.tries_promo_codes,
‎      
‎      // Comparison behavior
‎      price_filter_interactions: dataAccumulator.price_filter_interactions,
‎      
‎      // Raw events (for advanced analysis)
‎      click_events: dataAccumulator.click_events,
‎      scroll_events: dataAccumulator.scroll_events,
‎      hover_events: dataAccumulator.hover_events
‎    };
‎    
‎    // Send to webhook
‎    fetch(CONFIG.WEBHOOK_URL, {
‎      method: 'POST',
‎      headers: {
‎        'Content-Type': 'application/json'
‎      },
‎      body: JSON.stringify(payload)
‎    })
‎    .then(response => {
‎      if (response.ok) {
‎        console.log('✅ Luminara: 30-second behavioral data sent successfully');
‎      } else {
‎        console.error('❌ Luminara: Failed to send data');
‎      }
‎    })
‎    .catch(error => {
‎      console.error('❌ Luminara: Error sending data:', error);
‎    });
‎  }
‎
‎  // ========================================
‎  // START ACCUMULATION TIMER
‎  // ========================================
‎
‎  setTimeout(function() {
‎    analyzeAndSendData();
‎    console.log('🎯 Luminara: 30-second analysis complete and sent');
‎  }, CONFIG.ACCUMULATION_TIME);
‎
‎  // ========================================
‎  // PUBLIC API
‎  // ========================================
‎
‎  window.LuminaraTracking = {
‎    getVisitorId: function() {
‎      return dataAccumulator.visitor_id;
‎    },
‎    
‎    getCurrentData: function() {
‎      return dataAccumulator;
‎    },
‎    
‎    forceAnalysis: function() {
‎      analyzeAndSendData();
‎    }
‎  };
‎
‎  console.log('🚀 Luminara Tracking V4 initialized (30-second accumulation mode)');
‎  console.log('👤 Visitor ID:', dataAccumulator.visitor_id);
‎
‎})();
‎
‎
