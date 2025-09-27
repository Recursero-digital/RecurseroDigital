-- Script de inicialización para PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor por primera vez

-- Crear la base de datos si no existe (aunque ya se crea automáticamente)
-- CREATE DATABASE IF NOT EXISTS recurseroDigitalDB;

-- Otorgar todos los privilegios al usuario admindb
GRANT ALL PRIVILEGES ON DATABASE "recurseroDigitalDB" TO admindb;

-- Conectar a la base de datos recurseroDigitalDB
\c recurseroDigitalDB;

-- Otorgar privilegios en el esquema público
GRANT ALL ON SCHEMA public TO admindb;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admindb;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admindb;

-- Configurar privilegios por defecto para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admindb;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admindb;

-- Crear tabla de usuarios básica
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insertar algunos usuarios de ejemplo (opcional)
--INSERT INTO users (username, password, role) VALUES 
--    ('admin', '$2b$10$rQZ8K9vL2mN3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'admin'),
--    ('teacher1', '$2b$10$rQZ8K9vL2mN3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'teacher'),
--    ('student1', '$2b$10$rQZ8K9vL2mN3pQ4rS5tU6uV7wX8yZ9aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3oO4pP5qQ6rR7sS8tT9uU0vV1wW2xX3yY4zZ5', 'student')
--ON CONFLICT (username) DO NOTHING;

-- Mostrar información de usuarios y permisos (para debugging)
\du admindb;

-- Mostrar las tablas creadas
\dt;
