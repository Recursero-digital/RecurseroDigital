# Backend - RecurseroDigital

Backend del proyecto RecurseroDigital desarrollado en TypeScript con Node.js y Express.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express** - Framework web para Node.js
- **Jest** - Framework de testing

## 📁 Estructura del Proyecto

```
src/
├── config/           # Configuración de la aplicación
│   ├── app.ts       # Configuración de Express
│   └── server.ts    # Punto de entrada del servidor
│
├── core/            # Lógica de negocio
│   ├── models/      # Modelos de datos
│   ├── usecases/    # Casos de uso
│   └── infrastructure/ # Interfaces de infraestructura
│
├── infrastructure/  # Capa de insfra para conectarse con DB, APIS, etc.
│   
└── delivery/        # Capa de presentación
    ├── controllers/ # Controladores
    └── routes/      # Rutas de la API
```

## 🛠️ Comandos Disponibles

### Desarrollo
```bash
# Ejecutar en modo desarrollo (con recarga automática)
npm run dev
```

### Compilación
```bash
# Compilar TypeScript a JavaScript
npm run build
```

### Producción
```bash
# Ejecutar versión compilada
npm start
```

### Testing
```bash
# Ejecutar tests
npm test
```

### Verificación de Tipos
```bash
# Verificar tipos sin compilar
npx tsc --noEmit
```

## 🚦 Flujo de Trabajo

1. **Desarrollo diario:** Usa `npm run dev` para desarrollo con recarga automática
2. **Antes de commit:** Ejecuta `npm run build` para verificar que todo compila
3. **Para producción:** Usa `npm start` (después de hacer `npm run build`)

## 📦 Instalación

```bash
# Instalar dependencias
npm install
```

## 🔧 Configuración

El proyecto está configurado con:
- **TypeScript** con configuración estricta
- **ES2020** como target
- **CommonJS** como sistema de módulos
- **Source maps** habilitados para debugging
- **Paths mapping** configurado (`@/*` apunta a `src/*`)

## 📝 Scripts de Package.json

- `dev`: Ejecuta la aplicación en modo desarrollo con nodemon
- `build`: Compila TypeScript a JavaScript en la carpeta `dist/`
- `start`: Ejecuta la versión compilada de JavaScript
- `test`: Ejecuta los tests con Jest

## 🏗️ Arquitectura

El proyecto sigue una arquitectura limpia (Clean Architecture) con separación de responsabilidades:

- **Core**: Contiene la lógica de negocio pura
- **Infrastructure**: Interfaces para servicios externos
- **Delivery**: Capa de presentación (controladores y rutas)
- **Config**: Configuración de la aplicación

## 🔍 Verificación de Tipos

TypeScript está configurado con reglas estrictas para garantizar la calidad del código:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
