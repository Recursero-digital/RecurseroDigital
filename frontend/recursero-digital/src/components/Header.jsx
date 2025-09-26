
import Logo from '../assets/logo.png';
import '../styles/header.css';
import '../styles/darkMode.css';
import { useNavigate } from 'react-router-dom';
export function Header({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate("/"); // Te lleva a la ruta "/"
  };

    return (
      <header className="header">
       <div className="logo">
        <img src={Logo} alt="Recursera Digital" className='app-logo' /></div>
        <div className="search-and-mode">
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
          <button className="search-icon">🔍</button> {/* Puedes reemplazar con un icono de FontAwesome o similar */}
        </div>

        <div className="dark-mode-toggle">
          <span className="mode-text">Modo Oscuro</span>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className='boton-cerrar'>
          <button className='cerrar-sesion' onClick={handleCerrarSesion}>Cerrar Sesion</button>
        </div>
      </div>
      </header>
    );
  }