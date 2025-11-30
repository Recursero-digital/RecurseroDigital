import { useEffect, useState, useRef } from 'react';

/**
 * Hook personalizado para detectar easter eggs mediante entrada de teclado
 * @param {string} secret - La secuencia de caracteres a detectar
 * @param {Function} onTrigger - Callback que se ejecuta cuando se detecta el secreto
 * @returns {boolean} - Indica si el easter egg está activo
 */
export const useEasterEgg = (secret, onTrigger) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Obtener el elemento activo de manera más robusta
      const activeElement = document.activeElement;
      const target = event.target || activeElement;

      // Ignorar si se está escribiendo en un input, textarea, etc.
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.contentEditable === 'true')
      ) {
        return;
      }

      // Obtener la tecla presionada de manera más robusta
      const key = event.key || event.keyCode || String.fromCharCode(event.keyCode);
      
      // Solo procesar teclas de caracteres (letras y números)
      if (!key || key.length > 1) {
        // Ignorar teclas especiales como Shift, Ctrl, Alt, etc.
        if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape', 'Enter'].includes(key)) {
          return;
        }
      }

      // Convertir a minúscula y agregar al buffer
      const char = key.toLowerCase();
      
      // Solo agregar si es un carácter válido
      if (char && char.length === 1 && /[a-z0-9]/.test(char)) {
        inputRef.current += char;

        // Mantener solo los últimos caracteres (longitud del secreto)
        if (inputRef.current.length > secret.length) {
          inputRef.current = inputRef.current.slice(-secret.length);
        }

        // Debug (puedes comentar esto después de probar)
        // console.log('Buffer:', inputRef.current, 'Buscando:', secret.toLowerCase());

        // Verificar si coincide con el secreto
        if (inputRef.current === secret.toLowerCase()) {
          console.log('🎉 Easter egg activado!');
          setIsActive(true);
          if (onTrigger) {
            onTrigger();
          }
          // Limpiar el buffer después de activar
          inputRef.current = '';
        }
      }

      // Resetear el buffer después de un tiempo sin actividad
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        inputRef.current = '';
      }, 3000); // Resetear después de 3 segundos de inactividad
    };

    // Usar keydown para capturar todas las teclas
    window.addEventListener('keydown', handleKeyPress, true); // true para captura en fase de captura

    return () => {
      window.removeEventListener('keydown', handleKeyPress, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [secret, onTrigger]);

  const reset = () => {
    setIsActive(false);
    inputRef.current = '';
  };

  return { isActive, reset };
};

