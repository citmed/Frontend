import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import '../styles/ReminderFrequency.css';
import logo from "../assets/Logocitamed.png";

function ReminderFrequency() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};

  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [customInterval, setCustomInterval] = useState({ number: '', unit: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleBack = () => navigate('/reminder-medicine');

  const handleFrequencySelect = (freq) => {
    setSelectedFrequency(freq);
    setCustomInterval({ number: '', unit: '' });
    setErrorMsg('');
  };

  const handleNext = async () => {
    if (!selectedFrequency) {
      setErrorMsg("⚠️ Debes seleccionar una frecuencia.");
      return;
    }

    if (selectedFrequency === 'personalizada' && (!customInterval.number || !customInterval.unit)) {
      setErrorMsg("⚠️ Debes ingresar un número y una unidad para el intervalo personalizado.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg("⚠️ No se encontró sesión activa.");
      return;
    }

    const reminder = {
      tipo: 'medicamento',
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      dosis: Number(formData.dosis),
      unidad: formData.unidad,
      cantidadDisponible: Number(formData.cantidadDisponible),
      fecha: formData.fecha,
      frecuencia: 
        selectedFrequency === 'diaria'
          ? 'Diaria'
          : selectedFrequency === 'semanal'
          ? 'Semanal'
          : 'Personalizada',
      intervaloPersonalizado: 
        selectedFrequency === 'personalizada' 
          ? `${customInterval.number} ${customInterval.unit}` 
          : null,
    };

    try {
      const res = await fetch('https://citamedback.vercel.app/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reminder),
      });
      const data = await res.json();

      if (res.ok) {
        navigate('/reminder-created');
      } else {
        setErrorMsg('❌ Error al guardar recordatorio: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('🚨 Error al conectar con backend:', error);
      setErrorMsg('No se pudo conectar con el servidor.');
    }
  };

  return (
    <>
      <nav className="bottom">
        <button className="nav-button" onClick={handleBack}><FaArrowLeft /></button>
        <img 
          src={logo} 
          alt="Seguimiento y cumplimiento" 
          className="milogo-medicine" 
        />
      </nav>
      <div className="frequency-box">
        <div className="frequency-title-bar">
          <h2>Crear recordatorio de Medicamentos</h2>
        </div>
        <div className="frequency-content">
          <h3>Selecciona la frecuencia del recordatorio</h3>
          <div className="frequency-options">
            {['diaria','semanal','personalizada'].map(freq => (
              <button
                key={freq}
                className={`frequency-btn ${selectedFrequency === freq ? 'selected' : ''}`}
                onClick={() => handleFrequencySelect(freq)}
              >
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </button>
            ))}
          </div>

          {selectedFrequency === 'personalizada' && (
            <div className="custom-interval">
              <label>Intervalo personalizado:</label>
              <div className="interval-input">
                <input 
                  type="number"
                  min="1"
                  placeholder="Ej: 2"
                  value={customInterval.number}
                  onChange={e => setCustomInterval({ ...customInterval, number: e.target.value })}
                />
                <select
                  value={customInterval.unit}
                  onChange={e => setCustomInterval({ ...customInterval, unit: e.target.value })}
                >
                  <option value="">--Unidad--</option>
                  <option value="minutos">Minutos</option>
                  <option value="horas">Horas</option>
                  <option value="dias">Dias</option>
                  <option value="semanas">Semanas</option>
                </select>
              </div>
              <p><FaInfoCircle /> Se usará la hora de inicio del recordatorio como primer envío.</p>
            </div>
          )}

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="frequency-nav">
            <button className="back-btn" onClick={handleBack}><FaArrowLeft /> Volver</button>
            <button
              className="continue-btn"
              onClick={handleNext}
              disabled={
                !selectedFrequency || 
                (selectedFrequency === 'personalizada' && (!customInterval.number || !customInterval.unit))
              }
            >
              CONTINUAR &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReminderFrequency;