# HintModal - Componente Compartido

## Descripción
Componente modal unificado para mostrar pistas (hints) en todos los juegos de la aplicación. Reemplaza las implementaciones duplicadas que existían en cada juego individual.

## Uso

```jsx
import HintModal from '../../shared/HintModal';

<HintModal
    hint="Tu pista aquí"
    onClose={() => setShowHint(false)}
    theme="escala"
    title="Pista Útil"
    icon="💡"
    buttonText="✅ Entendido"
/>
```

## Props

| Prop | Tipo | Defecto | Descripción |
|------|------|---------|-------------|
| `hint` | string | - | **Requerido.** Texto de la pista a mostrar |
| `onClose` | function | - | **Requerido.** Función callback al cerrar el modal |
| `theme` | string | 'default' | Tema visual del modal |
| `title` | string | 'Pista Útil' | Título del modal |
| `icon` | string | '💡' | Emoji/icono a mostrar |
| `buttonText` | string | '✅ Entendido' | Texto del botón de cerrar |

## Temas Disponibles

### `escala` - JuegoEscala
- **Colores:** Azul oceánico con acentos naranjas
- **Estilo:** Moderno y limpio
- **Tipografía:** Sans-serif estándar

### `descomposicion` - JuegoDescomposicion  
- **Colores:** Tema clásico con marrones y dorados
- **Estilo:** Elegante y tradicional
- **Tipografía:** Playfair Display serif

### `default` - Tema genérico
- **Colores:** Grises neutros
- **Estilo:** Minimalista
- **Tipografía:** Sans-serif estándar

## Ejemplo por Juego

### JuegoEscala
```jsx
<HintModal
    hint={currentQuestion.hint}
    onClose={() => setShowHint(false)}
    theme="escala"
    title="Pista Útil"
    icon="💡"
    buttonText="✅ Entendido"
/>
```

### JuegoDescomposicion
```jsx
<HintModal
    hint={currentQuestion.hint}
    onClose={() => setShowHint(false)}
    theme="descomposicion"
    title="¡Aquí tienes una pista!"
    icon="💡"
    buttonText="✨ ¡Entendido!"
/>
```

## Beneficios de la Refactorización

✅ **DRY (Don't Repeat Yourself)** - Un solo componente para todos los juegos
✅ **Mantenimiento centralizado** - Cambios en un solo lugar
✅ **Consistencia visual** - Temas predefinidos garantizan coherencia
✅ **Extensibilidad** - Fácil agregar nuevos temas para futuros juegos
✅ **Reutilización** - Componente listo para usar en cualquier juego nuevo

## Estructura de Archivos

```
src/presentation/components/shared/HintModal/
├── HintModal.jsx      # Componente principal
├── HintModal.css      # Estilos con soporte para múltiples temas
└── index.js          # Exportación para facilitar imports
```