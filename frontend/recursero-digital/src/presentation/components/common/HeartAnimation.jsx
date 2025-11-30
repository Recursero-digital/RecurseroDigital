import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './HeartAnimation.css';

const HeartAnimation = ({ show, onComplete }) => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!show) {
      setHearts([]);
      return;
    }

    console.log('🎬 Iniciando animación de corazones...');

    // Crear múltiples corazones con posiciones y animaciones aleatorias
    const newHearts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Posición horizontal aleatoria (0-100%)
      delay: Math.random() * 0.5, // Delay aleatorio para animación
      duration: 2 + Math.random() * 1, // Duración entre 2-3 segundos
      size: 20 + Math.random() * 20, // Tamaño entre 20-40px
    }));

    console.log('💝 Corazones creados:', newHearts.length);
    setHearts(newHearts);

    // Limpiar después de que termine la animación
    const timer = setTimeout(() => {
      console.log('✨ Animación completada');
      setHearts([]);
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  // Debug: verificar estado
  useEffect(() => {
    if (show) {
      console.log('💖 HeartAnimation renderizado, show:', show, 'hearts:', hearts.length);
    }
  }, [show, hearts.length]);

  if (!show) {
    return null;
  }

  if (hearts.length === 0) {
    return null;
  }

  // Renderizar directamente en el body usando portal para asegurar que esté por encima de todo
  const animationContent = (
    <div className="heart-animation-container" data-testid="heart-animation">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );

  // Usar portal para renderizar en el body directamente
  return createPortal(animationContent, document.body);
};

export default HeartAnimation;

