#!/bin/bash

echo "🚀 PepeCase Deployment Check"
echo "=============================="

DOMAIN="https://v0-pepe-case-design.vercel.app"
BOT_TOKEN="7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"

echo ""
echo "1. Testing Bot Token..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe" | jq '.'

echo ""
echo "2. Testing API Endpoints..."
echo "Bot API:"
curl -s "${DOMAIN}/api/telegram/test-bot" | jq '.'

echo ""
echo "Stars Invoice API:"
curl -s -X POST "${DOMAIN}/api/telegram/create-stars-invoice" \
  -H "Content-Type: application/json" \
  -d '{"userId":123,"amount":100,"tonAmount":1,"description":"test"}' | jq '.'

echo ""
echo "3. Webhook Status..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | jq '.'

echo ""
echo "4. Setting Webhook..."
curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"${DOMAIN}/api/telegram/webhook\",\"allowed_updates\":[\"message\",\"pre_checkout_query\"]}" | jq '.'

echo ""
echo "✅ Deployment check complete!"
