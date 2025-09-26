import React, { useState, useEffect } from "react";
import "../styles/Reminder.css";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaHistory,
  FaPlus,
  FaUsers,
  FaPills,
  FaTimes,
  FaTrash,
  FaBars,
  FaEdit
} from "react-icons/fa";
import axios from "axios";
import logo from "../assets/Logocitamed.png";

const Reminder = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleOptions = () => setShowOptions(!showOptions);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const irARecordatorio = () => {
    navigate("/create-reminder");
    setShowMobileMenu(false);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://citamedback.vercel.app/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedReminders = res.data.sort((a, b) => {
        const fechaA = new Date(a.fecha).getTime();
        const fechaB = new Date(b.fecha).getTime();
        return fechaB - fechaA;
      });

      setReminders(sortedReminders);
    } catch (error) {
      console.error("❌ Error al traer recordatorios:", error);
    }
  };

  const eliminarRecordatorio = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://citamedback.vercel.app/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedReminders = reminders.filter((r) => r._id !== id);
      const sortedReminders = updatedReminders.sort((a, b) => {
        const fechaA = new Date(a.fecha).getTime();
        const fechaB = new Date(b.fecha).getTime();
        return fechaA - b;
      });

      setReminders(sortedReminders);
    } catch (error) {
      console.error("❌ Error al eliminar recordatorio:", error);
    }
  };

  return (
    <div className="container">
      {/* Navegación superior fija */}
      <nav className="top-nav">
        <button className="nav-button" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>

        {/* Logo con contenedor específico */}
        <div className="logo-container">
          <img src={logo} alt="CitaMed Seguimiento y cumplimiento" className="milogo" />
        </div>

        <h1>RECORDATORIOS</h1>

        {/* Botón de menú hamburguesa para móviles - POSICIONADO ARRIBA A LA DERECHA */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FaBars />
        </button>

        <div className={`nav-buttons-group ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
          <button className="nav-button" onClick={() => { navigate("/home"); setShowMobileMenu(false); }}>
            <FaCalendarAlt /> <span className="nav-button-text">Calendario</span>
          </button>
          <button className="nav-button active" onClick={() => setShowMobileMenu(false)}>
            <FaHistory /> <span className="nav-button-text">Records</span>
          </button>
        </div>
      </nav>

      {/* Overlay para cerrar menú al hacer clic fuera */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
      )}

      <main className="main-content">
        {reminders.length === 0 ? (
          <p className="no-data">No hay recordatorios</p>
        ) : (
          <ul className="reminder-list">
            {reminders.map((reminder) => (
              <li key={reminder._id} className="reminder-item">
                <div className="reminder-header">{reminder.titulo}</div>
                <div className="reminder-info">
                  <small><b>Descripción:</b> {reminder.descripcion}</small>
                  <small><b>Frecuencia:</b> {reminder.frecuencia}</small>

                  {reminder.horarios && reminder.horarios.length > 0 ? (
                    reminder.horarios.map((horaStr, index) => (
                      <div key={index} className="horario-item">
                        <small><b>Hora:</b> {horaStr}</small>
                        <small><b>Fecha:</b> {new Date(reminder.fecha).toLocaleDateString("es-CO")}</small>
                      </div>
                    ))
                  ) : (
                    reminder.fecha && (
                      <div className="horario-item">
                        <small>
                          <b>Hora:</b>{" "}
                          {new Date(reminder.fecha).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                        </small>
                        <small>
                          <b>Fecha:</b>{" "}
                          {new Date(reminder.fecha).toLocaleDateString("es-CO")}
                        </small>
                      </div>
                    )
                  )}

                  {reminder.dosis && reminder.unidad && (
                    <small><b>Dosis:</b> {reminder.dosis} {reminder.unidad}</small>
                  )}
                  {reminder.cantidadDisponible !== "medicamento" && (
                    <small><b>Cantidad disponible:</b> {reminder.cantidadDisponible}</small>
                  )}
                </div>
                <button className="delete-button" onClick={() => eliminarRecordatorio(reminder._id)}>
                  <FaTrash />
                </button>
                <button 
                  className="edit-button" 
                  onClick={() => navigate(`/edit-reminder/${reminder._id}`)}
                >
                  <FaEdit />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="fab-container">
        {showOptions && (
          <div className="fab-options">
            <button className="fab-option" onClick={irARecordatorio}>
              <FaUsers /> Recordatorio de control
            </button>
            <button className="fab-option" onClick={() => { navigate("/reminder-medicine"); setShowMobileMenu(false); }}>
              <FaPills /> Recordatorio de medicamentos
            </button>
          </div>
        )}
        <button className="fab-main" onClick={toggleOptions}>
          {showOptions ? <FaTimes /> : <FaPlus />}
        </button>
      </div>
    </div>
  );
};

export default Reminder;