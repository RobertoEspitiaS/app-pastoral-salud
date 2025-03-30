FROM node:18-alpine

WORKDIR /app

# Copiar todos los archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente y archivos públicos
COPY src ./src
COPY public ./public

# Construir la aplicación
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 