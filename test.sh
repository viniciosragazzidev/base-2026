#!/bin/bash

# Base Project 2026 - Test Script
echo "🧪 Testing Base Project 2026..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx" 2>/dev/null || true
lsof -ti:3333 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

sleep 2

# Start backend
echo "🌐 Starting Backend..."
cd api
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend health
echo "🏥 Testing backend health..."
curl -s http://localhost:3333/health || echo "❌ Backend not responding"

# Start frontend
echo "⚡ Starting Frontend..."
cd ../web
npm run dev &
FRONTEND_PID=$!

# Wait a bit for frontend to start
sleep 3

echo "✅ Services started!"
echo "📍 Backend: http://localhost:3333"
echo "📍 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user input
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
