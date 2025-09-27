# Dockerfile para el frontend
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 5173

# Comando para servir la aplicación construida
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

