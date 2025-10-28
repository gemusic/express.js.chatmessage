// public/chatbot-widget.js
// ========================================
// LUMINARA AI CHAT WIDGET - COMPLETE SYSTEM WITH PAYMENTS
// ========================================

(function() {
    'use strict';

    // ========================================
    // COMPLETE PRODUCT DATABASE - 50 PRODUCTS
    // ========================================
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
            // Create widget HTML if it doesn't exist
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
                <!-- Chat Icon with Notification Badge -->
                <div class="chat-toggle" id="chatToggle">
                    <div class="chat-icon-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        <div class="notification-badge" id="notificationBadge">0</div>
                    </div>
                    <div class="pulse-ring"></div>
                </div>

                <!-- Chat Window -->
                <div class="chat-container" id="chatContainer">
                    <!-- Chat Header -->
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

                    <!-- Messages Area -->
                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages loaded dynamically -->
                    </div>

                    <!-- Input Area -->
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

            <style>
                /* ======================================== */
                /* CSS VARIABLES - ALIGNED WITH YOUR SITE */
                /* ======================================== */
                :root {
                    --primary: #000000;
                    --secondary: #ffffff;
                    --accent: #00f0ff;
                    --accent-dark: #00c4d6;
                    --accent-glow: rgba(0, 240, 255, 0.3);
                    --light-gray: #f5f5f5;
                    --dark-gray: #1a1a1a;
                    --gray: #666666;
                    --success: #00d26a;
                    --warning: #ff9500;
                    --error: #ff3b30;
                    --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    --shadow-heavy: 0 20px 50px rgba(0, 0, 0, 0.25);
                    --shadow-glow: 0 0 30px rgba(0, 240, 255, 0.4);
                    --radius: 12px;
                    --radius-large: 16px;
                    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    --transition-fast: all 0.15s ease;
                }

                /* ======================================== */
                /* MAIN WIDGET CONTAINER */
                /* ======================================== */
                #luminara-chat-widget {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 10000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                /* ======================================== */
                /* CHAT ICON WITH FUTURISTIC ANIMATIONS */
                /* ======================================== */
                .chat-toggle {
                    position: relative;
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, var(--primary), var(--accent-dark));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-heavy);
                    transition: var(--transition);
                    animation: float 3s ease-in-out infinite;
                    border: 2px solid var(--accent);
                }

                .chat-toggle:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: var(--shadow-glow);
                    background: linear-gradient(135deg, var(--accent), var(--primary));
                }

                .chat-icon-inner {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }

                .chat-toggle svg {
                    color: var(--secondary);
                    transition: var(--transition);
                }

                .chat-toggle:hover svg {
                    transform: scale(1.2);
                    color: var(--accent);
                }

                /* Notification Badge */
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: linear-gradient(135deg, #ff3b30, #ff9500);
                    color: var(--secondary);
                    font-size: 12px;
                    font-weight: 800;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.4);
                    animation: pulse 2s infinite;
                    border: 2px solid var(--secondary);
                    display: none;
                }

                /* Pulsation Ring */
                .pulse-ring {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    width: 90px;
                    height: 90px;
                    border: 2px solid var(--accent);
                    border-radius: 50%;
                    animation: pulse-ring 2s ease-out infinite;
                    opacity: 0;
                }

                /* ======================================== */
                /* MAIN CHAT WINDOW - FULL SCREEN */
                /* ======================================== */
                .chat-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: var(--secondary);
                    box-shadow: var(--shadow-heavy);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(0, 240, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 0;
                    z-index: 10001;
                }

                .chat-container.open {
                    display: flex;
                    animation: openChatAnimation 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .chat-container.open ~ .chat-toggle {
                    display: none;
                }

                /* ======================================== */
                /* CHAT HEADER */
                /* ======================================== */
                .chat-header {
                    background: linear-gradient(135deg, var(--primary), var(--dark-gray));
                    padding: 20px;
                    padding-top: calc(20px + env(safe-area-inset-top));
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(0, 240, 255, 0.2);
                    flex-shrink: 0;
                }

                .chat-header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ai-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px var(--accent-glow);
                }

                .ai-avatar svg {
                    color: var(--primary);
                }

                .chat-title h3 {
                    color: var(--secondary);
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                }

                .status {
                    font-size: 11px;
                    color: var(--accent);
                    font-weight: 600;
                }

                .chat-controls {
                    display: flex;
                    gap: 8px;
                }

                .minimize-chat, .close-chat {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: var(--secondary);
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-fast);
                    font-size: 16px;
                    font-weight: bold;
                }

                .minimize-chat:hover, .close-chat:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                /* ======================================== */
                /* MESSAGES AREA - RESPONSIVE */
                /* ======================================== */
                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: var(--light-gray);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: var(--accent);
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-dark);
                }

                /* Message groups */
                .message-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                /* AI Messages */
                .message.ai-message {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .message-avatar svg {
                    color: var(--primary);
                    width: 16px;
                    height: 16px;
                }

                .message-content {
                    flex: 1;
                    min-width: 0;
                    max-width: calc(100% - 44px);
                }

                .message-text {
                    background: var(--secondary);
                    padding: 12px 16px;
                    border-radius: 18px 18px 18px 4px;
                    box-shadow: var(--shadow);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    line-height: 1.4;
                    color: var(--primary);
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    word-break: break-word;
                }

                .message.ai-message .message-text {
                    background: linear-gradient(135deg, var(--secondary), #f8f9fa);
                    border-left: 3px solid var(--accent);
                }

                /* User Messages */
                .message.user-message {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    flex-direction: row-reverse;
                }

                .message.user-message .message-avatar {
                    background: linear-gradient(135deg, var(--primary), var(--dark-gray));
                }

                .message.user-message .message-avatar svg {
                    color: var(--secondary);
                }

                .message.user-message .message-text {
                    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
                    color: var(--primary);
                    border-radius: 18px 18px 4px 18px;
                    font-weight: 600;
                }

                .message-timestamp {
                    font-size: 11px;
                    color: var(--gray);
                    margin-top: 4px;
                    padding: 0 4px;
                }

                /* Typing indicator */
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 8px 0;
                }

                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    background: var(--accent);
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out;
                }

                .typing-indicator span:nth-child(1) {
                    animation-delay: -0.32s;
                }

                .typing-indicator span:nth-child(2) {
                    animation-delay: -0.16s;
                }

                /* ======================================== */
                /* PAYMENT CARD STYLES */
                /* ======================================== */
                .payment-card {
                    background: linear-gradient(135deg, #ffffff, #f8f9fa);
                    border: 2px solid #00f0ff;
                    border-radius: 16px;
                    padding: 16px;
                    margin: 8px 0;
                    box-shadow: 0 8px 25px rgba(0, 240, 255, 0.15);
                    max-width: 100%;
                    animation: slideInUp 0.4s ease-out;
                }

                .payment-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .payment-badge {
                    background: linear-gradient(135deg, #00f0ff, #00c4d6);
                    color: #000;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .payment-card-content {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .payment-product-image {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .payment-product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .payment-product-info {
                    flex: 1;
                    min-width: 0;
                }

                .payment-product-name {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    color: #000;
                    line-height: 1.3;
                }

                .payment-product-description {
                    font-size: 12px;
                    color: #666;
                    margin: 0 0 8px 0;
                    line-height: 1.4;
                }

                .payment-price-section {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .payment-price {
                    font-size: 20px;
                    font-weight: 800;
                    color: #000;
                    background: linear-gradient(135deg, #000, #00f0ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .payment-tax {
                    font-size: 11px;
                    color: #666;
                }

                .payment-card-actions {
                    margin-bottom: 12px;
                }

                .payment-button {
                    width: 100%;
                    background: linear-gradient(135deg, #000000, #1a1a1a);
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 20px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-decoration: none;
                }

                .payment-button:hover {
                    background: linear-gradient(135deg, #00f0ff, #000000);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 240, 255, 0.3);
                }

                .payment-button:active {
                    transform: translateY(0);
                }

                .payment-button-text {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .payment-button-arrow {
                    font-size: 18px;
                    transition: transform 0.3s ease;
                }

                .payment-button:hover .payment-button-arrow {
                    transform: translateX(4px);
                }

                .payment-security {
                    text-align: center;
                    padding-top: 12px;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .security-badge {
                    font-size: 11px;
                    color: #666;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ======================================== */
                /* INPUT AREA - RESPONSIVE */
                /* ======================================== */
                .chat-input-container {
                    padding: 20px;
                    padding-bottom: calc(20px + env(safe-area-inset-bottom));
                    background: var(--secondary);
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                    flex-shrink: 0;
                }

                .input-wrapper {
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }

                #chatInput {
                    flex: 1;
                    padding: 14px 16px;
                    border: 2px solid var(--light-gray);
                    border-radius: var(--radius);
                    font-size: 14px;
                    transition: var(--transition);
                    background: var(--secondary);
                    resize: none;
                    max-height: 120px;
                    min-height: 46px;
                    font-family: inherit;
                    line-height: 1.4;
                    box-sizing: border-box;
                }

                #chatInput:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px var(--accent-glow);
                }

                #chatInput::placeholder {
                    color: var(--gray);
                }

                .send-button {
                    width: 46px;
                    height: 46px;
                    background: linear-gradient(135deg, var(--primary), var(--dark-gray));
                    color: var(--secondary);
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .send-button:not(:disabled):hover {
                    background: linear-gradient(135deg, var(--accent), var(--primary));
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px var(--accent-glow);
                }

                .send-button:disabled {
                    background: var(--light-gray);
                    color: var(--gray);
                    cursor: not-allowed;
                    transform: none;
                }

                /* ======================================== */
                /* ANIMATIONS */
                /* ======================================== */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                @keyframes openChatAnimation {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                @keyframes typing {
                    0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
                    30% { transform: scale(1); opacity: 1; }
                }

                /* ======================================== */
                /* RESPONSIVE DESIGN */
                /* ======================================== */
                @media (max-width: 1024px) {
                    #luminara-chat-widget {
                        bottom: 25px;
                        right: 25px;
                    }
                }

                @media (max-width: 768px) {
                    .chat-toggle {
                        width: 65px;
                        height: 65px;
                    }

                    .chat-toggle svg {
                        width: 26px;
                        height: 26px;
                    }

                    .pulse-ring {
                        width: 85px;
                        height: 85px;
                    }

                    .chat-header {
                        padding: 16px;
                        padding-top: calc(16px + env(safe-area-inset-top));
                    }

                    .chat-messages {
                        padding: 16px;
                    }

                    .chat-input-container {
                        padding: 16px;
                        padding-bottom: calc(16px + env(safe-area-inset-bottom));
                    }

                    /* Responsive design for payment cards */
                    .payment-card-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .payment-product-image {
                        width: 100px;
                        height: 100px;
                    }

                    .payment-price-section {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    #luminara-chat-widget {
                        bottom: 15px;
                        right: 15px;
                    }

                    .chat-toggle {
                        width: 60px;
                        height: 60px;
                    }

                    .chat-toggle svg {
                        width: 24px;
                        height: 24px;
                    }

                    .pulse-ring {
                        width: 80px;
                        height: 80px;
                    }

                    .notification-badge {
                        width: 22px;
                        height: 22px;
                        font-size: 11px;
                    }

                    .chat-header {
                        padding: 14px;
                        padding-top: calc(20px + env(safe-area-inset-top));
                    }

                    .ai-avatar {
                        width: 36px;
                        height: 36px;
                    }

                    .chat-title h3 {
                        font-size: 15px;
                    }

                    .chat-messages {
                        padding: 14px;
                        gap: 14px;
                    }

                    .message {
                        gap: 10px;
                    }

                    .message-avatar {
                        width: 30px;
                        height: 30px;
                    }

                    .message-avatar svg {
                        width: 14px;
                        height: 14px;
                    }

                    .message-text {
                        padding: 10px 14px;
                        font-size: 14px;
                    }

                    .chat-input-container {
                        padding: 14px;
                        padding-bottom: calc(20px + env(safe-area-inset-bottom));
                    }

                    #chatInput {
                        padding: 12px 14px;
                        font-size: 14px;
                    }

                    .send-button {
                        width: 44px;
                        height: 44px;
                    }
                }

                @media (max-height: 500px) and (orientation: landscape) {
                    .chat-header {
                        padding: 10px 16px;
                        padding-top: calc(10px + env(safe-area-inset-top));
                        padding-left: calc(16px + env(safe-area-inset-left));
                        padding-right: calc(16px + env(safe-area-inset-right));
                    }

                    .chat-messages {
                        padding: 12px 16px;
                        padding-left: calc(16px + env(safe-area-inset-left));
                        padding-right: calc(16px + env(safe-area-inset-right));
                    }

                    .chat-input-container {
                        padding: 12px 16px;
                        padding-bottom: calc(12px + env(safe-area-inset-bottom));
                        padding-left: calc(16px + env(safe-area-inset-left));
                        padding-right: calc(16px + env(safe-area-inset-right));
                    }
                }

                @media (pointer: coarse) {
                    .chat-toggle, .send-button, .minimize-chat, .close-chat {
                        min-height: 44px;
                    }
                }
            </style>
            `;

            document.body.insertAdjacentHTML('beforeend', widgetHTML);
        }

        initializeVisitor() {
            // Get visitorId from Luminara tracking system
            if (window.LuminaraTracker) {
                this.visitorId = window.LuminaraTracker.getVisitorId();
            } else if (window.LuminaraTracking) {
                this.visitorId = window.LuminaraTracking.getVisitorId();
            } else {
                // Generate temporary visitorId if tracking not loaded
                this.visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                console.warn('Luminara Tracking not detected, using temporary visitorId:', this.visitorId);
            }
        }

        initializeEventListeners() {
            // Open/close chat
            this.elements.chatToggle.addEventListener('click', () => this.toggleChat());
            this.elements.closeChat.addEventListener('click', () => this.closeChat());
            this.elements.minimizeChat.addEventListener('click', () => this.minimizeChat());

            // Send messages
            this.elements.sendButton.addEventListener('click', () => this.sendMessage());
            this.elements.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            this.elements.chatInput.addEventListener('input', this.autoResize.bind(this));
            this.elements.chatInput.addEventListener('input', () => this.updateSendButton());
        }

        initializeChat() {
            // NO WELCOME MESSAGE - wait for automation
            // Start polling for incoming messages
            this.startPolling();

            // Check for any existing messages
            this.checkForResponses();
        }

        // ========================================
        // CHAT STATE MANAGEMENT
        // ========================================

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.elements.chatContainer.classList.add('open');
            this.isOpen = true;

            // Reset notification badge
            this.resetNotificationBadge();

            // Focus on input
            setTimeout(() => {
                this.elements.chatInput.focus();
                this.scrollToBottom();
            }, 300);
        }

        closeChat() {
            this.elements.chatContainer.classList.remove('open');
            this.isOpen = false;
        }

        minimizeChat() {
            this.closeChat();
        }

        // ========================================
        // MESSAGE MANAGEMENT - CONNECTED TO SERVER
        // ========================================

        async sendMessage() {
            const message = this.elements.chatInput.value.trim();
            if (!message || this.isLoading) return;

            // Display user message
            this.displayUserMessage(message);

            // Clear input
            this.elements.chatInput.value = '';
            this.autoResize();
            this.updateSendButton();

            // Disable input and show typing
            this.setLoadingState(true);
            this.showTypingIndicator();

            try {
                // Send message to Luminara server
                await this.sendToServer(message);
                // Polling will handle response retrieval
                // Keep typing indicator until response received
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitor_id: this.visitorId,
                    message: message
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            // Check if it's a duplicate message
            if (data.duplicate) {
                this.hideTypingIndicator();
                this.setLoadingState(false);
                this.displayAIMessage("I'm already processing your message, please wait...", true);
            }

            return data;
        }

        async checkForResponses() {
            try {
                const response = await fetch(`${this.config.SERVER_URL}/api/chat-response/${this.visitorId}`);
                const data = await response.json();

                if (data.success && data.message) {
                    // Hide typing indicator and display response
                    this.hideTypingIndicator();

                    // Check if the message contains payment information
                    if (data.payment_data) {
                        this.displayPaymentCard(data.payment_data.product, data.payment_data.payment_url, data.message);
                    } else {
                        this.displayAIMessage(data.message, true);
                    }

                    // Handle recommended products if present
                    if (data.recommended_products && data.recommended_products.length > 0) {
                        this.handleRecommendedProducts(data.recommended_products);
                    }

                    // Mark as received welcome if first message
                    if (!this.hasReceivedWelcome) {
                        this.hasReceivedWelcome = true;
                    }

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
            // Implement logic to display recommended products
            console.log('📦 Recommended products:', products);
            // You can add product cards in the chat
        }

        // ========================================
        // PAYMENT CARD MANAGEMENT - CORRECTED
        // ========================================

        createPaymentCard(product, paymentUrl) {
            // Ensure image URL is complete
            let productImage = product.image;
            if (productImage && !productImage.startsWith('http')) {
                productImage = `https://ebusinessag.com/${productImage}`;
            }

            // Fallback image if product image is not available
            const fallbackImage = 'https://via.placeholder.com/150x150/000/fff?text=Luminara';

            const paymentCard = document.createElement('div');
            paymentCard.className = 'payment-card';
            paymentCard.innerHTML = `
                <div class="payment-card-header">
                    <span class="payment-badge">🛒 Secure Payment</span>
                </div>
                <div class="payment-card-content">
                    <div class="payment-product-image">
                        <img src="${productImage}" alt="${product.name}" onerror="this.src='${fallbackImage}'; this.onerror=null;">
                    </div>
                    <div class="payment-product-info">
                        <h4 class="payment-product-name">${product.name}</h4>
                        <p class="payment-product-description">${product.description || 'Premium Luminara product'}</p>
                        <div class="payment-price-section">
                            <span class="payment-price">$${product.price}</span>
                            <span class="payment-tax">Tax included</span>
                        </div>
                    </div>
                </div>
                <div class="payment-card-actions">
                    <a href="${paymentUrl}" target="_blank" class="payment-button">
                        <span class="payment-button-text">🛒 Pay Now</span>
                        <span class="payment-button-arrow">→</span>
                    </a>
                </div>
                <div class="payment-security">
                    <span class="security-badge">🔒 100% Secure Payment</span>
                </div>
            `;
            return paymentCard;
        }

        // ========================================
        // PRODUCT DETECTION SYSTEM - OPTIMIZED FOR 50 PRODUCTS
        // ========================================

        parseMessageForPaymentLinks(message) {
            // Optimized product detection for all 50 products
            const lowerMessage = message.toLowerCase();
            let detectedProduct = null;

            // Quick search through all products
            for (const product of allProducts) {
                if (lowerMessage.includes(product.name.toLowerCase())) {
                    detectedProduct = product;
                    break;
                }
            }

            // If product is detected, create payment card
            if (detectedProduct) {
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

        displayPaymentCard(product, paymentUrl, message) {
            const messageElement = this.createMessageElement('ai', message, true);
            
            // Create payment card
            const paymentCard = this.createPaymentCard(product, paymentUrl);
            messageElement.querySelector('.message-text').appendChild(paymentCard);
            
            this.elements.chatMessages.appendChild(messageElement);
            
            if (!this.isOpen) {
                this.incrementNotificationBadge();
            }
            this.scrollToBottom();
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
            
            // Auto-detect products in AI messages and add payment cards
            const paymentCard = this.parseMessageForPaymentLinks(message);
            if (paymentCard) {
                messageElement.querySelector('.message-text').appendChild(paymentCard);
            }
            
            this.elements.chatMessages.appendChild(messageElement);
            
            if (!this.isOpen) {
                this.incrementNotificationBadge();
            }
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

            const timestamp = new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const timestampHTML = withTimestamp ? `<div class="message-timestamp">${timestamp}</div>` : '';

            const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');

            const avatarSvg = sender === 'ai' 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';

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
        // VISUAL INDICATORS
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

        // ========================================
        // NOTIFICATION MANAGEMENT
        // ========================================

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

        // ========================================
        // UTILITIES
        // ========================================

        setLoadingState(loading) {
            this.isLoading = loading;
            this.elements.chatInput.disabled = loading;
            this.elements.sendButton.disabled = loading || !this.elements.chatInput.value.trim();

            if (loading) {
                this.elements.chatWidget.classList.add('loading');
            } else {
                this.elements.chatWidget.classList.remove('loading');
            }
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

        // ========================================
        // DESTRUCTOR
        // ========================================

        destroy() {
            this.stopPolling();
            if (this.elements.chatWidget) {
                this.elements.chatWidget.remove();
            }
        }
    }

    // ========================================
    // AUTOMATIC INITIALIZATION
    // ========================================

    let luminaraChat = null;

    function initializeChatWidget() {
        if (!document.getElementById('luminara-chat-widget')) {
            luminaraChat = new LuminaraChatWidget();
            window.LuminaraChat = luminaraChat;
            console.log('🚀 Luminara Chat Widget Initialized');
        }
    }

    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatWidget);
    } else {
        setTimeout(initializeChatWidget, 1000);
    }

    // Export for global use
    window.initializeLuminaraChat = initializeChatWidget;

})();
