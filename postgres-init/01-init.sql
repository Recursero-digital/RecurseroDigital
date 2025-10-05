\echo '=== INICIANDO SCRIPT DE INICIALIZACIÓN ==='

GRANT ALL PRIVILEGES ON DATABASE "recurseroDigitalDB" TO admindb;

\c recurseroDigitalDB;

GRANT ALL ON SCHEMA public TO admindb;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admindb;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admindb;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admindb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admindb;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);


\echo '=== SCRIPT DE INICIALIZACIÓN COMPLETADO ==='
\echo 'Los usuarios por defecto se crearán desde la aplicación Node.js'

\du admindb;

\dt;
