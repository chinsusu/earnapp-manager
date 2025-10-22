#!/bin/bash
cd /root/EarnApp-Manager/backend
echo "🚀 Starting Backend on port 4000..."
npm run dev &
BACKEND_PID=$!

sleep 3
cd /root/EarnApp-Manager/frontend
echo "🚀 Starting Frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Backend PID: $BACKEND_PID"
echo "✅ Frontend PID: $FRONTEND_PID"
echo ""
echo "📊 Visit: http://localhost:5173"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"

wait
