#!/bin/bash

# Verificar si Docker está en ejecución
if ! docker info > /dev/null 2>&1; then
    echo "Docker no está en ejecución. Iniciando Docker..."
    sudo systemctl start docker
fi

# Verificar si el usuario está en el grupo docker
if ! groups $USER | grep -q docker; then
    echo "El usuario no está en el grupo docker. Agregando usuario al grupo..."
    sudo usermod -aG docker $USER
    echo "Por favor, cierra y vuelve a abrir tu terminal para que los cambios surtan efecto."
    exit 1
fi

# Detener contenedores existentes si los hay
echo "Deteniendo contenedores existentes..."
docker compose down

# Construir e iniciar los contenedores
echo "Construyendo e iniciando la aplicación..."
docker compose up --build 