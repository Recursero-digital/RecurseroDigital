import { useState, useCallback, useEffect } from "react";
import { Card } from "../../components/common/Card";
import HeartAnimation from "../../components/common/HeartAnimation";
import { useEasterEggSimple } from "../../hooks/useEasterEggSimple";
import "../../styles/pages/dashboardAlumno.css";

function DashboardAlumno() {
  const [showHearts, setShowHearts] = useState(false);
  
  const handleEasterEgg = useCallback(() => {
    console.log('💖 Activando animación de corazones!');
    console.log('📊 Estado showHearts antes:', showHearts);
    setShowHearts(true);
    // Verificar después de un pequeño delay
    setTimeout(() => {
      console.log('📊 Estado showHearts después:', true);
    }, 100);
  }, [showHearts]);

  // Usar el hook simplificado
  useEasterEggSimple("sammysammy", handleEasterEgg);

  const handleAnimationComplete = useCallback(() => {
    console.log('🏁 Animación completada, ocultando corazones');
    setShowHearts(false);
  }, []);

  // Debug: verificar que el componente se montó
  useEffect(() => {
    console.log('✅ DashboardAlumno montado - Easter egg activo. Escribe "sammysammy" para probar.');
  }, []);

  // Debug: monitorear cambios en showHearts
  useEffect(() => {
    console.log('🔄 showHearts cambió a:', showHearts);
  }, [showHearts]);

  return (
    <div className="dashboard">
      <Card/>
      <HeartAnimation show={showHearts} onComplete={handleAnimationComplete} />
    </div>
  );
}

export default DashboardAlumno;
