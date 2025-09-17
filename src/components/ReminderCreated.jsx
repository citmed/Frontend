import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import '../styles/ReminderCreated.css';

function ReminderCreated() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/home'); // Redirige a la ruta deseada
  };

  const handleBack = () => {
    navigate('/reminder-frequency'); // O la ruta anterior, si aplica
  };

  return (
    <>
      <nav className="bottom">
      </nav>

      <main className="created-content">
        <div className="check-icon">
          <FaCheck />
        </div>
        <h2 className="created-message">Recordatorio creado</h2>

        <button className="continue-btn" onClick={handleContinue}>
          CONTINUAR
        </button>
      </main>
    </>
  );
}

export default ReminderCreated;
