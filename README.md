# 🚀 Luminara Express Server - Version Optimisée

Serveur Express.js optimisé pour l'agent de vente IA Luminara avec intégration Lindy AI.

## 🎯 NOUVEAUX ENDPOINTS PRINCIPAUX

### **Données Comportementales**
- `POST /api/behavioral-data` - Reçoit les données de tracking complet

### **Chat & Messages**
- `POST /api/send-chat-message` - Messages de l'AI vers le visiteur
- `POST /api/visitor-message` - Messages du visiteur vers l'AI  
- `GET /api/chat-response/:visitor_id` - Récupère les réponses AI
- `GET /api/conversation/:visitor_id` - Historique des conversations

### **Analytics**
- `POST /api/analytics/conversion` - Suivi des conversions
- `POST /api/analytics/product-update` - Synchronisation produits
- `POST /api/analytics/visitor` - Analytics visiteurs
- `POST /api/analytics/chat` - Analytics conversations

### **Debug & Monitoring**
- `GET /api/visitor-data/:visitor_id` - Données débug visiteur
- `GET /health` - Statut du serveur

## 🔗 INTÉGRATION LINDY AI

Le serveur forward automatiquement vers:
- **Behavioral Analysis**: `0de777e3-9723-48c7-9fd4-6456774e4428`
- **Chat Messages**: `1a292d2a-eeb9-48a2-a4a5-00d5596253ee`
- **Conversions**: `99829fec-a3bf-427b-84ac-deef7cfdfa6b`
- **Product Sync**: `4b27b7a5-6690-4fcc-a81d-a23780ef27fe`

## 🛠️ INSTALLATION

```bash
npm install
npm start
