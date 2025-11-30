import { useEffect, useRef } from 'react';

/**
 * Versión simplificada y más robusta del hook de easter egg
 * Detecta la secuencia "sammysammy" cuando se escribe
 */
export const useEasterEggSimple = (secret, onTrigger) => {
  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Verificar si estamos en un campo de entrada
      const activeElement = document.activeElement;
      const isInputField = 
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
         activeElement.tagName === 'TEXTAREA' ||
         activeElement.isContentEditable ||
         activeElement.contentEditable === 'true');

      if (isInputField) {
        return; // Ignorar si estamos escribiendo en un campo
      }

      // Obtener la tecla presionada
      let key = event.key;
      
      // Si no hay key, intentar obtenerla del keyCode (fallback)
      if (!key && event.keyCode) {
        // Solo procesar letras (65-90 para A-Z, 97-122 para a-z)
        if (event.keyCode >= 65 && event.keyCode <= 90) {
          key = String.fromCharCode(event.keyCode).toLowerCase();
        } else {
          return; // Ignorar teclas no alfabéticas
        }
      }

      // Ignorar teclas especiales
      if (!key || key.length !== 1 || !/[a-z0-9]/.test(key.toLowerCase())) {
        return;
      }

      // Agregar al buffer
      bufferRef.current += key.toLowerCase();
      
      // Mantener solo los últimos N caracteres (donde N = longitud del secreto)
      if (bufferRef.current.length > secret.length) {
        bufferRef.current = bufferRef.current.slice(-secret.length);
      }

      // Debug: descomentar para ver qué se está capturando
      // console.log('Tecla:', key, 'Buffer:', bufferRef.current);

      // Verificar si coincide
      if (bufferRef.current === secret.toLowerCase()) {
        console.log('🎉 ¡Easter egg detectado!', secret);
        bufferRef.current = ''; // Limpiar buffer
        if (onTrigger) {
          onTrigger();
        }
      }

      // Resetear buffer después de inactividad
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, 3000);
    };

    // Agregar listener con captura (captura eventos antes de que lleguen a otros handlers)
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [secret, onTrigger]);
};

