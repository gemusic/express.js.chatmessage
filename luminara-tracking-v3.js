// ========================================
// LUMINARA ULTIMATE TRACKING SYSTEM V3.0
// Parfaitement adapté à votre structure HTML
// ========================================

(function() {
    'use strict';

    // Configuration alignée avec votre serveur
    const CONFIG = {
        SERVER_URL: 'https://luminara-express-server.onrender.com',
        ACCUMULATION_TIME: 30000,
        VISITOR_ID_KEY: 'luminara_visitor_id',
        SESSION_ID_KEY: 'luminara_session_id'
    };

    class LuminaraTracker {
        constructor() {
            this.visitorId = this.getOrCreateVisitorId();
            this.sessionId = this.generateSessionId();
            this.initializeTracking();
        }

        // [Le reste du code de tracking ultime que j'ai fourni précédemment]
        // ... (identique au script de tracking complet fourni plus tôt)
        // ========================================
// LUMINARA ULTIMATE TRACKING SYSTEM V2.0
// COMPLETE VISITOR BEHAVIOR CAPTURE
// ========================================

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        WEBHOOK_URL: 'https://public.lindy.ai/api/v1/webhooks/lindy/0de777e3-9723-48c7-9fd4-6456774e4428',
        WEBHOOK_TOKEN: '75e40c6949e8d5f5041150e501cc23e60dbbf95b4e783d436ba108cfce1bdbe8',
        ACCUMULATION_TIME: 30000, // 30 seconds
        VISITOR_ID_KEY: 'luminara_visitor_id',
        SESSION_ID_KEY: 'luminara_session_id',
        MAX_EVENTS: 1000 // Prevent memory overload
    };

    // ========================================
    // CORE TRACKING ENGINE
    // ========================================
    class LuminaraTracker {
        constructor() {
            this.visitorId = this.getOrCreateVisitorId();
            this.sessionId = this.generateSessionId();
            this.pageStartTime = Date.now();
            this.lastActivity = Date.now();
            this.events = [];
            this.accumulatedData = this.initializeDataStructure();
            this.isSending = false;
            
            this.init();
        }

        initializeDataStructure() {
            return {
                // Identity
                visitor_id: this.visitorId,
                session_id: this.sessionId,
                page_url: window.location.href,
                page_title: document.title,
                referrer: document.referrer,
                start_time: this.pageStartTime,

                // Device & Browser
                device_info: this.getDeviceInfo(),
                viewport: this.getViewportInfo(),

                // Navigation
                page_visits: [],
                navigation_events: [],

                // Time Tracking
                time_tracking: {
                    total_time: 0,
                    active_time: 0,
                    inactive_time: 0,
                    focus_time: 0,
                    blur_time: 0
                },

                // Scroll Behavior
                scroll_behavior: {
                    depth_percentage: 0,
                    max_depth: 0,
                    scroll_events: [],
                    scroll_pattern: [],
                    time_to_scroll: null,
                    scroll_velocity: []
                },

                // Mouse/Touch Interactions
                mouse_movements: [],
                mouse_clicks: [],
                mouse_hovers: [],
                touch_events: [],
                drag_events: [],

                // Keyboard Interactions
                keystrokes: [],
                copy_actions: [],
                paste_actions: [],

                // Product Interactions (SPECIFIC TO YOUR E-COMMERCE)
                product_views: [],
                product_hovers: [],
                product_clicks: [],
                product_compares: [],
                product_zoom: [],
                product_wishlist: [],

                // Cart Interactions (SPECIFIC TO YOUR E-COMMERCE)
                cart_actions: [],
                cart_updates: [],
                cart_removals: [],
                cart_abandonments: [],

                // Form Interactions
                form_interactions: [],
                form_submissions: [],
                form_errors: [],

                // Search Behavior
                search_queries: [],
                search_filters: [],
                search_sorting: [],

                // Attention & Engagement
                attention_heatmap: [],
                focus_elements: [],
                reading_pattern: [],

                // Emotional Signals (Derived from behavior)
                hesitation_signals: [],
                confidence_signals: [],
                frustration_signals: [],
                excitement_signals: [],

                // Technical Events
                error_events: [],
                performance_metrics: {},
                resource_loading: [],

                // Session Flow
                session_flow: [],
                exit_intent: null
            };
        }

        // ========================================
        // VISITOR & SESSION MANAGEMENT
        // ========================================
        getOrCreateVisitorId() {
            let visitorId = localStorage.getItem(CONFIG.VISITOR_ID_KEY);
            if (!visitorId) {
                visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem(CONFIG.VISITOR_ID_KEY, visitorId);
            }
            return visitorId;
        }

        generateSessionId() {
            return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        getDeviceInfo() {
            return {
                user_agent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screen_resolution: `${screen.width}x${screen.height}`,
                color_depth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookies_enabled: navigator.cookieEnabled,
                java_enabled: navigator.javaEnabled(),
                pdf_enabled: navigator.pdfViewerEnabled,
                do_not_track: navigator.doNotTrack,
                hardware_concurrency: navigator.hardwareConcurrency || 'unknown',
                device_memory: navigator.deviceMemory || 'unknown'
            };
        }

        getViewportInfo() {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
                device_pixel_ratio: window.devicePixelRatio,
                orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown'
            };
        }

        // ========================================
        // EVENT TRACKING - COMPREHENSIVE
        // ========================================
        init() {
            this.trackNavigation();
            this.trackScrollBehavior();
            this.trackMouseInteractions();
            this.trackTouchInteractions();
            this.trackKeyboardInteractions();
            this.trackFocusBehavior();
            this.trackProductInteractions();
            this.trackCartInteractions();
            this.trackFormInteractions();
            this.trackSearchBehavior();
            this.trackPerformance();
            this.trackErrors();
            this.trackSessionFlow();
            this.trackAttentionHeatmap();
            this.startAccumulationTimer();
            
            console.log('🎯 Luminara Ultimate Tracking Activated');
            console.log('👤 Visitor ID:', this.visitorId);
            console.log('🔄 Session ID:', this.sessionId);
        }

        // ========================================
        // SPECIFIC TRACKING METHODS
        // ========================================

        trackNavigation() {
            // Page visibility changes
            document.addEventListener('visibilitychange', () => {
                this.recordEvent('visibility_change', {
                    state: document.hidden ? 'hidden' : 'visible',
                    timestamp: Date.now()
                });
            });

            // Before unload (exit intent)
            window.addEventListener('beforeunload', () => {
                this.accumulatedData.exit_intent = {
                    timestamp: Date.now(),
                    scroll_depth: this.accumulatedData.scroll_behavior.depth_percentage,
                    time_on_page: Date.now() - this.pageStartTime
                };
                this.sendDataImmediately(); // Send final data
            });

            // Hash changes (SPA navigation)
            window.addEventListener('hashchange', () => {
                this.recordEvent('hash_change', {
                    old_url: window.location.href,
                    new_hash: window.location.hash
                });
            });
        }

        trackScrollBehavior() {
            let lastScrollY = window.scrollY;
            let lastScrollTime = Date.now();
            let scrollDirection = 'none';

            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollDepth = maxScroll > 0 ? Math.round((currentScrollY / maxScroll) * 100) : 0;

                // Update scroll depth
                this.accumulatedData.scroll_behavior.depth_percentage = scrollDepth;
                this.accumulatedData.scroll_behavior.max_depth = Math.max(
                    this.accumulatedData.scroll_behavior.max_depth, 
                    scrollDepth
                );

                // Calculate scroll velocity
                const currentTime = Date.now();
                const timeDiff = currentTime - lastScrollTime;
                const scrollDiff = Math.abs(currentScrollY - lastScrollY);
                const velocity = timeDiff > 0 ? scrollDiff / timeDiff : 0;

                // Determine scroll direction
                scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

                // Record scroll event
                this.accumulatedData.scroll_behavior.scroll_events.push({
                    y_position: currentScrollY,
                    depth_percentage: scrollDepth,
                    velocity: velocity,
                    direction: scrollDirection,
                    timestamp: currentTime
                });

                // Record time to first scroll
                if (!this.accumulatedData.scroll_behavior.time_to_scroll && currentScrollY > 0) {
                    this.accumulatedData.scroll_behavior.time_to_scroll = currentTime - this.pageStartTime;
                }

                lastScrollY = currentScrollY;
                lastScrollTime = currentTime;
                this.updateLastActivity();
            }, { passive: true });
        }

        trackMouseInteractions() {
            let mouseMoveCount = 0;
            let lastMouseX = 0;
            let lastMouseY = 0;

            // Mouse movements (sampled)
            document.addEventListener('mousemove', (e) => {
                mouseMoveCount++;
                
                // Sample every 5th movement to reduce data
                if (mouseMoveCount % 5 === 0) {
                    this.accumulatedData.mouse_movements.push({
                        x: e.clientX,
                        y: e.clientY,
                        page_x: e.pageX,
                        page_y: e.pageY,
                        timestamp: Date.now(),
                        velocity: this.calculateMouseVelocity(e.clientX, e.clientY, lastMouseX, lastMouseY)
                    });
                }

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                this.updateLastActivity();
            }, { passive: true });

            // Clicks
            document.addEventListener('click', (e) => {
                const clickData = {
                    element: this.getElementInfo(e.target),
                    position: { x: e.clientX, y: e.clientY },
                    timestamp: Date.now(),
                    button: e.button,
                    alt_key: e.altKey,
                    ctrl_key: e.ctrlKey,
                    shift_key: e.shiftKey
                };

                this.accumulatedData.mouse_clicks.push(clickData);
                this.analyzeClickIntent(e.target, clickData);
                this.updateLastActivity();
            });

            // Hover tracking
            let hoverStartTime = null;
            let hoveredElement = null;

            document.addEventListener('mouseover', (e) => {
                hoverStartTime = Date.now();
                hoveredElement = e.target;
            });

            document.addEventListener('mouseout', (e) => {
                if (hoverStartTime && hoveredElement) {
                    const hoverDuration = Date.now() - hoverStartTime;
                    if (hoverDuration > 300) { // Only track meaningful hovers
                        this.accumulatedData.mouse_hovers.push({
                            element: this.getElementInfo(hoveredElement),
                            duration: hoverDuration,
                            timestamp: Date.now()
                        });
                    }
                }
                hoverStartTime = null;
                hoveredElement = null;
            });
        }

        trackTouchInteractions() {
            // Touch events for mobile
            document.addEventListener('touchstart', (e) => {
                this.accumulatedData.touch_events.push({
                    type: 'touchstart',
                    touches: e.touches.length,
                    timestamp: Date.now(),
                    position: this.getTouchPositions(e)
                });
                this.updateLastActivity();
            }, { passive: true });

            document.addEventListener('touchmove', (e) => {
                this.accumulatedData.touch_events.push({
                    type: 'touchmove',
                    touches: e.touches.length,
                    timestamp: Date.now(),
                    position: this.getTouchPositions(e)
                });
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                this.accumulatedData.touch_events.push({
                    type: 'touchend',
                    touches: e.touches.length,
                    timestamp: Date.now(),
                    position: this.getTouchPositions(e)
                });
            }, { passive: true });
        }

        trackKeyboardInteractions() {
            // Key presses (sampled for privacy)
            let lastKeyTime = 0;
            document.addEventListener('keydown', (e) => {
                const currentTime = Date.now();
                // Only record every 500ms to reduce noise
                if (currentTime - lastKeyTime > 500) {
                    this.accumulatedData.keystrokes.push({
                        key: e.key,
                        code: e.code,
                        target: this.getElementInfo(e.target),
                        timestamp: currentTime
                    });
                    lastKeyTime = currentTime;
                }
                this.updateLastActivity();
            });

            // Copy/paste actions
            document.addEventListener('copy', (e) => {
                this.accumulatedData.copy_actions.push({
                    timestamp: Date.now(),
                    target: this.getElementInfo(e.target),
                    selected_text: window.getSelection().toString().substring(0, 100) // Limit length
                });
            });

            document.addEventListener('paste', (e) => {
                this.accumulatedData.paste_actions.push({
                    timestamp: Date.now(),
                    target: this.getElementInfo(e.target)
                });
            });
        }

        trackFocusBehavior() {
            let focusStartTime = null;
            let focusedElement = null;

            document.addEventListener('focusin', (e) => {
                focusStartTime = Date.now();
                focusedElement = e.target;
                
                this.accumulatedData.focus_elements.push({
                    element: this.getElementInfo(e.target),
                    timestamp: Date.now()
                });
            });

            document.addEventListener('focusout', (e) => {
                if (focusStartTime && focusedElement) {
                    const focusDuration = Date.now() - focusStartTime;
                    this.recordEvent('focus_duration', {
                        element: this.getElementInfo(focusedElement),
                        duration: focusDuration,
                        timestamp: Date.now()
                    });
                }
                focusStartTime = null;
                focusedElement = null;
            });
        }

        // ========================================
        // E-COMMERCE SPECIFIC TRACKING
        // ========================================

        trackProductInteractions() {
            // Product view tracking (when product becomes visible)
            this.trackProductVisibility();
            
            // Product clicks (adapted to YOUR HTML structure)
            document.addEventListener('click', (e) => {
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
            });

            // Product hover tracking (adapted to YOUR HTML structure)
            let productHoverStart = null;
            let hoveredProduct = null;

            document.addEventListener('mouseover', (e) => {
                const productElement = this.findProductElement(e.target);
                if (productElement) {
                    productHoverStart = Date.now();
                    hoveredProduct = productElement;
                }
            });

            document.addEventListener('mouseout', (e) => {
                if (productHoverStart && hoveredProduct) {
                    const productInfo = this.extractProductInfo(hoveredProduct);
                    if (productInfo) {
                        const hoverDuration = Date.now() - productHoverStart;
                        if (hoverDuration > 500) { // Meaningful hover
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

            // Wishlist interactions
            this.trackWishlistInteractions();
            
            // Product comparisons
            this.trackComparisonBehavior();
        }

        trackProductVisibility() {
            // Use Intersection Observer to track product views
            if ('IntersectionObserver' in window) {
                const productObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const productElement = entry.target;
                            const productInfo = this.extractProductInfo(productElement);
                            if (productInfo && !this.isProductAlreadyViewed(productInfo.id)) {
                                this.accumulatedData.product_views.push({
                                    ...productInfo,
                                    timestamp: Date.now(),
                                    view_duration: 0, // Will be updated when product leaves view
                                    fully_visible: entry.intersectionRatio >= 0.8
                                });
                            }
                        }
                    });
                }, { threshold: [0.1, 0.5, 0.8] });

                // Observe all product elements (adapt selectors to YOUR HTML)
                document.querySelectorAll('.product-card, [data-product-id]').forEach(product => {
                    productObserver.observe(product);
                });
            }
        }

        trackCartInteractions() {
            // Cart additions (adapted to YOUR HTML structure)
            document.addEventListener('click', (e) => {
                if (e.target.closest('.add-to-cart, [data-action="add-to-cart"]')) {
                    const productElement = this.findProductElement(e.target);
                    const productInfo = productElement ? this.extractProductInfo(productElement) : null;
                    
                    this.accumulatedData.cart_actions.push({
                        action: 'add_to_cart',
                        product: productInfo,
                        timestamp: Date.now(),
                        element: this.getElementInfo(e.target)
                    });

                    // Send immediate data for cart additions (high intent)
                    this.sendDataImmediately();
                }
            });

            // Cart updates (quantity changes)
            document.addEventListener('change', (e) => {
                if (e.target.classList.contains('quantity-input') || 
                    e.target.closest('.quantity-controls')) {
                    this.accumulatedData.cart_updates.push({
                        action: 'quantity_change',
                        element: this.getElementInfo(e.target),
                        value: e.target.value,
                        timestamp: Date.now()
                    });
                }
            });

            // Cart removals
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-item') || 
                    e.target.closest('[data-action="remove-from-cart"]')) {
                    this.accumulatedData.cart_removals.push({
                        action: 'remove_from_cart',
                        element: this.getElementInfo(e.target),
                        timestamp: Date.now()
                    });
                }
            });
        }

        trackFormInteractions() {
            // Form field interactions
            document.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea, select')) {
                    this.accumulatedData.form_interactions.push({
                        action: 'focus',
                        field: this.getElementInfo(e.target),
                        form: this.getFormInfo(e.target),
                        timestamp: Date.now()
                    });
                }
            });

            // Form submissions
            document.addEventListener('submit', (e) => {
                this.accumulatedData.form_submissions.push({
                    form: this.getFormInfo(e.target),
                    timestamp: Date.now(),
                    field_count: e.target.querySelectorAll('input, textarea, select').length
                });
            });

            // Form validation errors
            document.addEventListener('invalid', (e) => {
                this.accumulatedData.form_errors.push({
                    field: this.getElementInfo(e.target),
                    form: this.getFormInfo(e.target),
                    error_type: 'validation',
                    timestamp: Date.now()
                });
            }, true);
        }

        trackSearchBehavior() {
            // Search queries
            let searchTimer;
            document.addEventListener('input', (e) => {
                if (e.target.matches('[type="search"], .search-input, [name="q"]')) {
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(() => {
                        this.accumulatedData.search_queries.push({
                            query: e.target.value,
                            timestamp: Date.now(),
                            field: this.getElementInfo(e.target)
                        });
                    }, 1000); // Debounce 1 second
                }
            });

            // Search filters
            document.addEventListener('change', (e) => {
                if (e.target.matches('.filter, [data-filter], select[name*="filter"]')) {
                    this.accumulatedData.search_filters.push({
                        filter: this.getElementInfo(e.target),
                        value: e.target.value,
                        timestamp: Date.now()
                    });
                }
            });
        }

        // ========================================
        // ADVANCED BEHAVIOR ANALYSIS
        // ========================================

        trackAttentionHeatmap() {
            // Simple attention tracking based on mouse and focus
            setInterval(() => {
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Sample current mouse position
                if (this.accumulatedData.mouse_movements.length > 0) {
                    const lastMouse = this.accumulatedData.mouse_movements[this.accumulatedData.mouse_movements.length - 1];
                    const gridX = Math.floor((lastMouse.x / viewportWidth) * 10); // 10x10 grid
                    const gridY = Math.floor((lastMouse.y / viewportHeight) * 10);
                    
                    this.accumulatedData.attention_heatmap.push({
                        grid_x: gridX,
                        grid_y: gridY,
                        timestamp: Date.now()
                    });
                }
            }, 5000); // Sample every 5 seconds
        }

        analyzeClickIntent(element, clickData) {
            const elementInfo = this.getElementInfo(element);
            let intent = 'unknown';
            
            // Analyze based on element type and context
            if (element.closest('.add-to-cart')) {
                intent = 'purchase_intent';
                this.recordEmotionalSignal('excitement', 0.7);
            } else if (element.closest('.product-card')) {
                intent = 'product_interest';
            } else if (element.closest('.wishlist, .favorite')) {
                intent = 'save_for_later';
            } else if (element.closest('.back-button, [data-action="back"]')) {
                intent = 'hesitation';
                this.recordEmotionalSignal('hesitation', 0.6);
            } else if (element.closest('.checkout, .proceed-to-checkout')) {
                intent = 'checkout_intent';
                this.recordEmotionalSignal('confidence', 0.8);
            }
            
            clickData.intent = intent;
        }

        recordEmotionalSignal(type, intensity) {
            this.accumulatedData[type + '_signals'].push({
                type: type,
                intensity: intensity,
                timestamp: Date.now(),
                context: this.getCurrentContext()
            });
        }

        // ========================================
        // PERFORMANCE & TECHNICAL TRACKING
        // ========================================

        trackPerformance() {
            // Core Web Vitals and performance metrics
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    const perfData = performance.timing;
                    this.accumulatedData.performance_metrics = {
                        load_time: perfData.loadEventEnd - perfData.navigationStart,
                        dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                        first_byte: perfData.responseStart - perfData.navigationStart,
                        dom_processing: perfData.domComplete - perfData.domLoading,
                        page_size: performance.getEntriesByType('navigation')[0]?.transferSize || 0
                    };
                });

                // Resource loading
                const resourceObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        this.accumulatedData.resource_loading.push({
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize,
                            type: entry.entryType,
                            timestamp: Date.now()
                        });
                    });
                });
                resourceObserver.observe({ entryTypes: ['resource'] });
            }
        }

        trackErrors() {
            // JavaScript errors
            window.addEventListener('error', (e) => {
                this.accumulatedData.error_events.push({
                    type: 'javascript_error',
                    message: e.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno,
                    timestamp: Date.now()
                });
            });

            // Promise rejections
            window.addEventListener('unhandledrejection', (e) => {
                this.accumulatedData.error_events.push({
                    type: 'promise_rejection',
                    reason: e.reason?.toString(),
                    timestamp: Date.now()
                });
            });

            // Resource loading errors
            window.addEventListener('error', (e) => {
                if (e.target && e.target !== window) {
                    this.accumulatedData.error_events.push({
                        type: 'resource_error',
                        element: this.getElementInfo(e.target),
                        timestamp: Date.now()
                    });
                }
            }, true);
        }

        trackSessionFlow() {
            // Track user flow through the session
            this.accumulatedData.session_flow.push({
                action: 'page_load',
                url: window.location.href,
                timestamp: Date.now()
            });

            // Track internal navigation
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.href) {
                    const link = e.target;
                    this.accumulatedData.session_flow.push({
                        action: 'internal_navigation',
                        from: window.location.href,
                        to: link.href,
                        text: link.textContent?.substring(0, 50),
                        timestamp: Date.now()
                    });
                }
            });
        }

        // ========================================
        // UTILITY METHODS
        // ========================================

        getElementInfo(element) {
            if (!element) return null;
            
            return {
                tag_name: element.tagName,
                id: element.id,
                class_name: element.className,
                name: element.name,
                type: element.type,
                value: element.value ? element.value.substring(0, 100) : null, // Limit length
                text: element.textContent ? element.textContent.substring(0, 100) : null,
                attributes: this.getRelevantAttributes(element)
            };
        }

        getRelevantAttributes(element) {
            const relevantAttrs = ['data-product-id', 'data-price', 'data-category', 'data-action', 'role', 'aria-label'];
            const attrs = {};
            
            relevantAttrs.forEach(attr => {
                if (element.hasAttribute(attr)) {
                    attrs[attr] = element.getAttribute(attr);
                }
            });
            
            return attrs;
        }

        findProductElement(element) {
            return element.closest('.product-card, [data-product-id], .product-item');
        }

        extractProductInfo(productElement) {
            // ADAPTED TO YOUR SPECIFIC HTML STRUCTURE
            const productId = productElement.getAttribute('data-product-id') || 
                            productElement.querySelector('[data-product-id]')?.getAttribute('data-product-id');
            
            const productName = productElement.querySelector('.product-name, .item-name, [data-product-name]')?.textContent?.trim();
            const productPrice = productElement.querySelector('.product-price, .item-price, .price, [data-price]')?.textContent?.trim();
            
            if (!productId) return null;

            return {
                id: productId,
                name: productName,
                price: productPrice,
                element: this.getElementInfo(productElement)
            };
        }

        getFormInfo(element) {
            const form = element.closest('form');
            return form ? {
                id: form.id,
                action: form.action,
                method: form.method,
                field_count: form.querySelectorAll('input, textarea, select').length
            } : null;
        }

        getTouchPositions(event) {
            return Array.from(event.touches).map(touch => ({
                x: touch.clientX,
                y: touch.clientY
            }));
        }

        calculateMouseVelocity(currentX, currentY, lastX, lastY) {
            const distance = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2));
            return distance; // Simple distance for now
        }

        getCurrentContext() {
            return {
                url: window.location.href,
                scroll_depth: this.accumulatedData.scroll_behavior.depth_percentage,
                time_on_page: Date.now() - this.pageStartTime,
                products_in_view: this.accumulatedData.product_views.length
            };
        }

        isProductAlreadyViewed(productId) {
            return this.accumulatedData.product_views.some(view => 
                view.id === productId && 
                (Date.now() - view.timestamp) < 30000 // Viewed in last 30 seconds
            );
        }

        trackWishlistInteractions() {
            document.addEventListener('click', (e) => {
                if (e.target.closest('.wishlist, .favorite, [data-action="wishlist"]')) {
                    const productElement = this.findProductElement(e.target);
                    const productInfo = productElement ? this.extractProductInfo(productElement) : null;
                    
                    this.accumulatedData.product_wishlist.push({
                        action: 'add_to_wishlist',
                        product: productInfo,
                        timestamp: Date.now()
                    });
                }
            });
        }

        trackComparisonBehavior() {
            let comparisonProducts = new Set();
            
            document.addEventListener('click', (e) => {
                if (e.target.closest('.compare, [data-action="compare"]')) {
                    const productElement = this.findProductElement(e.target);
                    const productInfo = productElement ? this.extractProductInfo(productElement) : null;
                    
                    if (productInfo) {
                        comparisonProducts.add(productInfo.id);
                        
                        this.accumulatedData.product_compares.push({
                            product: productInfo,
                            comparison_set: Array.from(comparisonProducts),
                            timestamp: Date.now()
                        });
                    }
                }
            });
        }

        updateLastActivity() {
            this.lastActivity = Date.now();
        }

        recordEvent(type, data) {
            this.events.push({
                type: type,
                data: data,
                timestamp: Date.now()
            });
            
            // Prevent memory overload
            if (this.events.length > CONFIG.MAX_EVENTS) {
                this.events = this.events.slice(-CONFIG.MAX_EVENTS);
            }
        }

        // ========================================
        // DATA TRANSMISSION
        // ========================================

        startAccumulationTimer() {
            setInterval(() => {
                this.sendAccumulatedData();
            }, CONFIG.ACCUMULATION_TIME);
        }

        sendAccumulatedData() {
            if (this.isSending) return;
            
            this.isSending = true;
            
            // Update time tracking
            const currentTime = Date.now();
            this.accumulatedData.time_tracking.total_time = currentTime - this.pageStartTime;
            this.accumulatedData.time_tracking.active_time = this.calculateActiveTime();
            
            // Prepare final payload
            const payload = {
                ...this.accumulatedData,
                transmission_timestamp: new Date().toISOString(),
                events_count: this.events.length,
                events_sample: this.events.slice(-50) // Send last 50 events
            };

            // Send to webhook
            fetch(CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.WEBHOOK_TOKEN}`
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    console.log('📊 Luminara: Behavioral data sent successfully');
                    // Reset events after successful send
                    this.events = [];
                } else {
                    console.error('❌ Luminara: Failed to send data');
                }
            })
            .catch(error => {
                console.error('❌ Luminara: Error sending data:', error);
            })
            .finally(() => {
                this.isSending = false;
            });
        }

        sendDataImmediately() {
            // Force immediate data send for high-priority events
            this.sendAccumulatedData();
        }

        calculateActiveTime() {
            // Simple active time calculation (time since last activity + accumulated active time)
            return Date.now() - this.pageStartTime; // Simplified for now
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    // Start tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.LuminaraTracker = new LuminaraTracker();
        });
    } else {
        window.LuminaraTracker = new LuminaraTracker();
    }

    // Public API for manual control
    window.LuminaraTracking = {
        getVisitorId: () => window.LuminaraTracker?.visitorId,
        getSessionId: () => window.LuminaraTracker?.sessionId,
        forceSendData: () => window.LuminaraTracker?.sendDataImmediately(),
        trackCustomEvent: (type, data) => window.LuminaraTracker?.recordEvent(type, data)
    };

})();
        // MÉTHODE D'ENVOI ADAPTÉE À VOTRE SERVEUR
        sendAccumulatedData() {
            if (this.isSending) return;
            this.isSending = true;

            const payload = {
                ...this.accumulatedData,
                transmission_timestamp: new Date().toISOString()
            };

            // ENVOI AU NOUVEL ENDPOINT DE VOTRE SERVEUR
            fetch(`${CONFIG.SERVER_URL}/api/behavioral-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('📊 Luminara: Data sent successfully to server');
                    this.events = []; // Reset events
                }
            })
            .catch(error => {
                console.error('❌ Luminara: Error sending data:', error);
            })
            .finally(() => {
                this.isSending = false;
            });
        }
    }

    // Initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.LuminaraTracker = new LuminaraTracker();
        });
    } else {
        window.LuminaraTracker = new LuminaraTracker();
    }

})();
