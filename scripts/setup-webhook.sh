#!/bin/bash

# Setup script for Telegram webhook with your bot token
BOT_TOKEN="7751385637:AAHeiLCx_Nf5wlb3p3y2kQrh7BnYSH88w34"
WEBHOOK_URL="https://v0-pepe-case-design.vercel.app/api/telegram/webhook"

echo "Setting up Telegram webhook for @Spaceklbot..."

# Set webhook
echo "Setting webhook URL: $WEBHOOK_URL"
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"allowed_updates\": [\"message\", \"pre_checkout_query\"],
    \"drop_pending_updates\": true
  }"

echo ""
echo "Webhook setup complete!"

# Check webhook info
echo ""
echo "Checking webhook status..."
curl -X GET "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

echo ""
echo ""
echo "Bot info:"
curl -X GET "https://api.telegram.org/bot${BOT_TOKEN}/getMe"
