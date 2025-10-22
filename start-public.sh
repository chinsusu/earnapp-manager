#!/bin/bash

echo "🚀 Starting EarnApp Manager (Public Mode)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start Backend
cd /root/EarnApp-Manager/backend
echo "📦 Starting Backend on port 4000..."
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend
sleep 3

# Start Frontend
cd /root/EarnApp-Manager/frontend
echo "⚛️  Starting Frontend on port 5173..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend
sleep 3

# Start Cloudflare Tunnel
echo "🌐 Starting Cloudflare Tunnel..."
cloudflared tunnel --config ~/.cloudflared/config.yml run earnapp-manager > /tmp/tunnel.log 2>&1 &
TUNNEL_PID=$!
echo "   Tunnel PID: $TUNNEL_PID"

echo ""
echo "✅ All services started!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 Public URL:  https://eam.xelu.top"
echo "🏠 Local URL:   http://localhost:5173"
echo "🔌 Backend API: http://localhost:4000"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo "   Tunnel:   tail -f /tmp/tunnel.log"
echo ""
echo "🛑 To stop all: kill $BACKEND_PID $FRONTEND_PID $TUNNEL_PID"
echo ""

# Save PIDs for easy stopping
echo "$BACKEND_PID $FRONTEND_PID $TUNNEL_PID" > /tmp/earnapp-pids.txt

wait
