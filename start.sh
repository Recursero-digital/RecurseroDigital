#!/bin/bash

# Script de inicio para Railway
echo "🚀 Iniciando Recursero Digital en Railway..."

# Instalar dependencias globales necesarias
npm install -g concurrently

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
npm run build
cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend/recursero-digital
npm install
npm run build
cd ../..

# Iniciar ambos servicios
echo "🎯 Iniciando servicios..."
echo "Backend en puerto: $PORT"
echo "Frontend en puerto: 5173"

# Usar concurrently para ejecutar ambos servicios
npx concurrently \
  --kill-others-on-fail \
  --prefix "[{name}]" \
  --names "backend,frontend" \
  "cd backend && npm start" \
  "cd frontend/recursero-digital && npm install -g serve && serve -s dist -l 5173"
