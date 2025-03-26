# APP Pastoral de la Salud

Aplicación web para la gestión de inventario de medicamentos y atención médica en campañas.

## Características

- Gestión de inventario de medicamentos donados
- Control de fechas de vencimiento con alertas
- Módulo de atención médica para campañas
- Generación de fórmulas médicas
- Control automático de inventario al despachar medicamentos

## Tecnologías Utilizadas

- Frontend: React.js con TypeScript
- Backend: Node.js con Express
- Base de datos: PostgreSQL
- Contenedorización: Docker
- UI Framework: Material-UI

## Requisitos Previos

- Docker
- Docker Compose
- Node.js (para desarrollo local)

## Instalación

1. Clonar el repositorio
2. Ejecutar `docker-compose up --build`
3. Acceder a la aplicación en `http://localhost:3000`

## Estructura del Proyecto

```
.
├── frontend/           # Aplicación React
├── backend/           # Servidor Node.js
├── docker/            # Archivos de configuración Docker
└── docker-compose.yml # Configuración de contenedores
```

## Desarrollo

Para desarrollo local:

1. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ``` 