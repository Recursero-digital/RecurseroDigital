# CI/CD con GitHub Actions y Supabase

## 🚀 Configuración de Deploy Automático

Este proyecto está configurado para desplegarse automáticamente a Supabase cuando se hace merge a la rama `main`.

## 📋 Configuración inicial

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota el **Project Reference ID** (lo encontrarás en Settings → General)

### 2. Configurar GitHub Secrets

En tu repositorio de GitHub, ve a **Settings** → **Secrets and variables** → **Actions** y agrega:

```
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
SUPABASE_PROJECT_REF=tu_project_reference_id
SUPABASE_ACCESS_TOKEN=tu_personal_access_token
```

### 3. Obtener las credenciales

#### SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY:
1. En Supabase Dashboard → **Settings** → **API**
2. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

#### SUPABASE_PROJECT_REF:
1. En Supabase Dashboard → **Settings** → **General**
2. Copia el **Reference ID** → `SUPABASE_PROJECT_REF`

#### SUPABASE_ACCESS_TOKEN:
1. Ve a [Supabase Dashboard](https://app.supabase.com) → **Account** → **Access Tokens**
2. Crea un nuevo token → `SUPABASE_ACCESS_TOKEN`

## 🔄 Flujo de trabajo

### Trigger del deploy:
- ✅ Push a la rama `main`
- ✅ Merge de Pull Request a `main`

### Proceso automático:
1. **Checkout** del código
2. **Setup** de Node.js 18
3. **Install** de dependencias (backend y frontend)
4. **Build** de ambos proyectos
5. **Deploy** a Supabase:
   - Database migrations
   - Frontend static files
   - Backend functions (si las hay)

## 📁 Estructura de archivos

```
.github/
└── workflows/
    └── deploy.yml          # Workflow principal de deploy

supabase/
└── config.toml             # Configuración de Supabase local
```

## 🛠️ Comandos locales (opcional)

Si quieres probar el deploy localmente:

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Login en Supabase
supabase login

# Inicializar proyecto (si es la primera vez)
supabase init

# Deploy manual
supabase projects deploy --project-ref tu_project_ref
```

## 🔍 Verificar el deploy

Después de un merge a `main`:

1. Ve a **Actions** en tu repositorio de GitHub
2. Verifica que el workflow se ejecute correctamente
3. Revisa los logs si hay algún error
4. Tu aplicación estará disponible en la URL de Supabase

## 📚 Recursos útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase GitHub Action](https://github.com/supabase/supabase-github-action)

## ⚠️ Notas importantes

- El deploy solo ocurre en la rama `main`
- Asegúrate de que todos los tests pasen antes del merge
- Los secrets deben estar configurados correctamente
- El proyecto debe compilar sin errores
