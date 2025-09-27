# RecurseroDigital
📘 Recursero Digital – Matemática Interactiva para Primaria

Recursero Digital es una plataforma tipo campus virtual que reúne en un único entorno diversas actividades interactivas de matemática, diseñadas para escuelas primarias.

Actualmente, muchos recursos digitales se encuentran dispersos en plataformas como Genially, Wordwall o Matific, dificultando su acceso y limitando la posibilidad de articularlos pedagógicamente. Este proyecto busca centralizar esas propuestas y organizar actividades alineadas con el Diseño Curricular vigente, inicialmente orientadas a 3° grado

---
## 🎯 Objetivos

Facilitar el acceso de estudiantes y docentes a actividades matemáticas interactivas en un mismo espacio.

Organizar las actividades según secuencias de enseñanza, favoreciendo la ejercitación, la exploración y el desafío cognitivo.

Incorporar un sistema de seguimiento individual que registre avances, dificultades y tiempos de resolución.

Ofrecer a las y los docentes reportes detallados sobre el desempeño del grupo y de cada estudiante, permitiendo ajustar la enseñanza en función de la información recolectada.

---
## 🚀 Tecnologías utilizadas

- **Backend**
  - 🟢 Node.js  
  - ⚡ Express.js  
  - 🔒 Seguridad: bcrypt.js y JWT  
  - 🗄️ Base de datos: SQL Server Management 19  

- **Frontend**
  - ⚛️ React.js  
  - 🧭 React Router DOM (gestión de rutas)  
  - 🔗 Axios (peticiones HTTP)  

- **Containerización**
  - 🐳 Docker & Docker Compose
  - 📦 Servicios separados (Backend y Frontend)
  - 🌐 Red personalizada para comunicación entre servicios

---
## 🐳 Instalación con Docker (Recomendado)

### Requisitos
- Docker Desktop instalado
- Docker Compose

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd RecurseroDigital
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:3000

### Comandos útiles de Docker

```bash
# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir un servicio específico
docker-compose up --build backend
```

Para más detalles sobre la configuración de Docker, consulta el archivo [DOCKER.md](./DOCKER.md).

---
## 🛠️ Instalación manual (Desarrollo)

Si prefieres ejecutar el proyecto sin Docker:
