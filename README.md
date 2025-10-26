# 🚀 Luminara Express Server - Version avec Déduplication

Serveur Express.js optimisé pour l'agent de vente IA Luminara avec intégration Lindy AI et système de déduplication.

## 🆕 NOUVELLES FONCTIONNALITÉS

### **Système de Déduplication**
- `GET /api/deduplication/check?visitor_id={visitor_id}` - Vérifie si un visiteur a déjà été traité
- `POST /api/deduplication/mark` - Marque un visiteur comme traité

### **Nouveaux Webhooks Lindy**
- **Behavioral Analysis**: `a77d3f14-2ae7-4dd6-9862-16a0bcbc182b`
- **Chat Messages**: `b37b9919-cd88-44d0-8d7c-a6b9c1f2975a` 
- **Conversions**: `a52e8822-76f6-4775-bab2-c523d49568b5`
- **Product Sync**: `fa1b7f8e-7d6b-4740-9e26-e9180ffe303d`

## 🎯 ENDPOINTS PRINCIPAUX

### **Déduplication**
- `GET /api/deduplication/check?visitor_id={visitor_id}`
- `POST /api/deduplication/mark`

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

Le serveur forward automatiquement vers les NOUVEAUX webhooks:
- **Behavioral Analysis**: `a77d3f14-2ae7-4dd6-9862-16a0bcbc182b`
- **Chat Messages**: `b37b9919-cd88-44d0-8d7c-a6b9c1f2975a`
- **Conversions**: `a52e8822-76f6-4775-bab2-c523d49568b5`
- **Product Sync**: `fa1b7f8e-7d6b-4740-9e26-e9180ffe303d`

## 🛠️ INSTALLATION

```bash
npm install
npm start
