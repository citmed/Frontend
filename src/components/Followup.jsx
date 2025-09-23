import React, { useEffect, useState } from "react";
import "../styles/Followup.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPills, FaUserMd, FaStar } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/Logocitamed.png";

const Followup = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);

  // 📌 Obtener recordatorios
  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data);
    } catch (error) {
      console.error("❌ Error al obtener recordatorios:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // 📌 Marcar o desmarcar favorito
  const toggleFavorite = async (id, currentFav) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/reminders/${id}/favorite`,
        { favorito: !currentFav },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar en el estado local
      setReminders((prev) =>
        prev.map((rem) =>
          rem._id === id ? { ...rem, favorito: res.data.favorito } : rem
        )
      );
    } catch (error) {
      console.error("❌ Error al actualizar favorito:", error);
    }
  };

  return (
    <div className="followup-container">
      {/* Header */}
      <header className="followup-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>
        <img src={logo} alt="Logo" className="logo" />
      </header>

      {/* Lista de recordatorios */}
      <div className="reminder-list">
        {reminders.length > 0 ? (
          reminders.map((rem) => (
            <div key={rem._id} className="reminder-card">
              <div className="reminder-header">
                <h3 className="reminder-title">
                  {rem.tipo === "medicamento" ? (
                    <FaPills className="icon" />
                  ) : (
                    <FaUserMd className="icon" />
                  )}
                  {rem.titulo}
                </h3>
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(rem._id, rem.favorito)}
                >
                  <FaStar
                    className={`star-icon ${rem.favorito ? "active" : ""}`}
                  />
                </button>
              </div>

              <p className="reminder-desc">{rem.descripcion || "Sin descripción"}</p>
              <p className="reminder-date">
                📅 {rem.fechaFormateada} ⏰ {rem.horaFormateada}
              </p>
            </div>
          ))
        ) : (
          <p className="no-reminders">No tienes recordatorios aún.</p>
        )}
      </div>
    </div>
  );
};

export default Followup;
