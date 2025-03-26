#!/bin/bash

# Actualizar el sistema
echo "Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependencias necesarias
echo "Instalando dependencias..."
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common

# Instalar Docker
echo "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar el usuario actual al grupo docker
echo "Agregando usuario al grupo docker..."
sudo usermod -aG docker $USER

# Instalar Node.js y npm
echo "Instalando Node.js y npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalaciones
echo "Verificando instalaciones..."
docker --version
docker compose version
node --version
npm --version

echo "Instalación completada. Por favor, cierra y vuelve a abrir tu terminal para que los cambios surtan efecto."
echo "Después de reiniciar la terminal, puedes ejecutar 'docker-compose up --build' para iniciar la aplicación." 