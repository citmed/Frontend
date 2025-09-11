import { Link } from "react-router-dom";
import "../styles/LandinPage.css"

const LandingPage = () => {
  return (
    <div className="container">
      {/* Barra de navegación */}
      <nav>
        <h1>CITAMED</h1>
        <div className="nav-buttons">
          <Link to="/login" className="btn-nav">Iniciar Sesión</Link>
          <Link to="/register" className="btn-nav">Registrarse</Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        <h2>Bienvenido a Citamed</h2>
        <p>Optimiza la gestión de citas médicas con recordatorios automáticos.</p>
        
        {/* Sección de características */}
        <div className="features">
          <div className="feature">
            <h3 className="feature-title">Gestión Eficiente</h3>
            <p className="feature-text">Automatiza la asignación y recordatorios de citas.</p>
          </div>
          <div className="feature">
            <h3 className="feature-title">Recordatorios Inteligentes</h3>
            <p className="feature-text">Evita olvidos con notificaciones en tiempo real.</p>
          </div>
          <div className="feature">
            <h3 className="feature-title">Fácil de Usar</h3>
            <p className="feature-text">Interfaz intuitiva para pacientes y administradores.</p>
          </div>
        </div>

        {/* Botón principal */}
        <Link to="/login" className="btn">Comenzar</Link>
      </main>
    </div>
  );
};

export default LandingPage;