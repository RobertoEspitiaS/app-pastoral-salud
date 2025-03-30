FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY src/ ./src/
COPY public/ ./public/

# Construir la aplicación
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 