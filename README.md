# Luminara Express Server

Serveur Express.js pour l'agent de vente IA Luminara.

## Installation

```bash

npm install

Démarrage


npm start

Routes API

POST /api/send-notification - Reçoit les notifications depuis Lindy

POST /api/send-chat-message - Reçoit les messages chat depuis Lindy

GET /api/get-chat-messages?visitor_id=XXX - Récupère les messages pour le chatbot

POST /api/analytics/visitor - Log analytics visiteur

POST /api/analytics/chat - Log analytics chat

POST /api/analytics/conversion - Log conversions

POST /api/analytics/product-update - Log mises à jour produits

GET /api/dashboard/analytics - Récupère toutes les analytics pour le dashboard

GET /api/dashboard/visitors/realtime - Récupère les visiteurs en temps réel

GET /health - Health check

Déploiement sur Render

Push ce repo sur GitHub

Connecte ton repo à Render.com

Configure :

Build Command: npm install

Start Command: npm start

Deploy !



---

