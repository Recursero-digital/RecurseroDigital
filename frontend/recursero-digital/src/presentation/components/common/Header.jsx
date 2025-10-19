
import Logo from '../../../assets/Logo.png';
import '../../styles/layouts/header.css';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate("/"); // Te lleva a la ruta "/"
  };

    return (
      <header className="header bg-space-ui bg-stars-ui">
       <div className="logo">
        <img src={Logo} alt="TecnoMente" className='app-logo' /></div>
        <div className="header-title">
          <h1>TecnoMente</h1>
        </div>
        <div className="search-and-mode">
        <div className='boton-cerrar'>
          <button className='cerrar-sesion' onClick={handleCerrarSesion}>Cerrar Sesion</button>
        </div>
      </div>
      </header>
    );
  }