FROM node:18-alpine

WORKDIR /app

# Establecer variable de entorno para OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copiar todos los archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias y TypeScript compatible
RUN npm install && \
    npm install typescript@3.4.5 --save-dev

# Copiar el código fuente y archivos públicos
COPY src ./src
COPY public ./public

# Construir la aplicación
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 