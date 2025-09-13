import React, { useState } from 'react';
import '../styles/ReminderMedicine.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import logo from "../assets/Logocitamed.png";

function ReminderMedicine() {
  const navigate = useNavigate();

  // Obtener usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user")); 

  // Fecha y hora por defecto
  const now = new Date();
  const pad = (num) => num.toString().padStart(2, '0');
  const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dosis, setDosis] = useState('');
  const [unidad, setUnidad] = useState(''); // 
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [fecha, setFecha] = useState(defaultDate);
  const [hora, setHora] = useState(defaultTime);

  const handleBack = () => navigate('/reminder');

  const handleNext = (e) => {
    e.preventDefault();

    const fechaHora = new Date(`${fecha}T${hora}:00`);

    const formData = {
      titulo,
      descripcion,
      dosis,
      unidad,
      cantidadDisponible,
      fecha: fechaHora,
      usuario: user?.nombre || "Usuario",
    };

    navigate("/reminder-frequency", { state: formData });
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
      <div className="reminder-medicine-content">
        <div className="reminder-banner">
          <h2>Crear recordatorio de Medicamentos</h2>
        </div>
        <form className="reminder-form" onSubmit={handleNext}>
          <label className="reminder-label">Medicamento</label>
          <input 
            type="text" 
            className="reminder-input" 
            value={titulo} 
            onChange={(e)=>setTitulo(e.target.value)} 
            required 
          />

          <label className="reminder-label">Descripción</label>
          <textarea 
            className="reminder-textarea" 
            value={descripcion} 
            onChange={(e)=>setDescripcion(e.target.value)} 
            required 
          />
          <p className="reminder-note"><FaInfoCircle /> Este texto se mostrará en la notificación.</p>

          <div className="reminder-row">
            <label>Dosis a tomar:</label>
            <input 
              type="number" 
              className="reminder-small-input" 
              value={dosis} 
              onChange={(e)=>setDosis(e.target.value)} 
              required 
            />
          </div>

          {/* Unidad de medida dinámica */}
          <div className="reminder-row">
            <label>Unidad de medida:</label>
            <select 
              className="reminder-input" 
              value={unidad} 
              onChange={(e)=>setUnidad(e.target.value)}
              min="1"
              required
            >
              <option value="" disabled hidden>Seleccione una unidad</option>
              <option value="Unidades">Unidades (tabletas, cápsulas)</option>
              <option value="Miligramos">Miligramos (mg)</option>
              <option value="Gramos">Gramos (g)</option>
              <option value="Mililitros">Mililitros (ml)</option>
              <option value="Litros">Litros (l)</option>
              <option value="Gotas">Gotas</option>
              <option value="Sobres">Sobres</option>
            </select>

          </div>

          <div className="reminder-row">
            <label>Cantidad disponible:</label>
            <input 
              type="number" 
              className="reminder-small-input" 
              value={cantidadDisponible} 
              onChange={(e)=>setCantidadDisponible(e.target.value)} 
              min="1"
              required 
            /> {unidad}
          </div>
          <p className="reminder-note"><FaInfoCircle /> Unidades disponibles del medicamento</p>

          <div className="reminder-row">
            <label>Fecha del recordatorio:</label>
            <input 
              type="date" 
              className="reminder-input" 
              value={fecha} 
              onChange={(e)=>setFecha(e.target.value)} 
              required 
            />
          </div>

          <div className="reminder-row">
            <label>Hora del recordatorio:</label>
            <input 
              type="time" 
              className="reminder-input" 
              value={hora} 
              onChange={(e)=>setHora(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="reminder-submit-btn">Continuar</button>
        </form>
      </div>
    </>
  );
}

export default ReminderMedicine;
