import React, { useEffect, useState } from "react";
import "../styles/Followup.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPills, FaUserMd } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/Logocitamed.png";

const Followup = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(90); // Altura inicial del header

  useEffect(() => {
    fetchReminders();

    // Calcular altura real del header
    const updateHeaderHeight = () => {
      const header = document.querySelector(".followup-header");
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://citamedback.vercel.app/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ordenar por fecha descendente
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

  const handleToggleCompleted = async (id, currentState) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://citamedback.vercel.app/api/reminders/${id}/completed`,
        { completed: !currentState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReminders((prev) => {
        const updated = prev.map((r) =>
          r._id === id
            ? { ...r, completed: res.data.completed, completedAt: res.data.completedAt }
            : r
        );
        return updated.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      });
    } catch (error) {
      console.error("❌ Error al marcar completado:", error);
    }
  };

  return (
    <div className="followup-container">
      {/* Header fijo */}
      <header className="followup-header">
        <button className="followup-back" onClick={() => navigate("/home")}>
          <FaArrowLeft />
        </button>
        <img src={logo} alt="Seguimiento y cumplimiento" className="milogo-followup" />
        <h1 className="followup-title">Seguimiento a paciente</h1>
      </header>

      {/* Contenido */}
      <main className="followup-main" style={{ marginTop: `${headerHeight}px` }}>
        {reminders.length === 0 ? (
          <p className="followup-no-data">No hay recordatorios</p>
        ) : (
          <div className="followup-grid-container">
            <ul className="followup-list">
              {reminders.map((reminder) => (
                <li
                  key={reminder._id}
                  className={`followup-card ${reminder.completed ? "completed" : ""}`}
                >
                  <div className="followup-left">
                    {reminder.tipo === "medicamento" ? (
                      <FaPills className="followup-icon" />
                    ) : (
                      <FaUserMd className="followup-icon" />
                    )}
                  </div>

                  <div className="followup-info">
                    <h3 className="followup-reminder-title">{reminder.titulo}</h3>
                    <p className="followup-description">{reminder.descripcion}</p>

                    {reminder.cantidadDisponible !== undefined && (
                      <p className="followup-small">
                        <b>Cantidad:</b> {reminder.cantidadDisponible} {reminder.unidad}
                      </p>
                    )}

                    {reminder.fecha && (
                      <>
                        <p className="followup-small">
                          📅{" "}
                          {new Date(reminder.fecha).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </p>
                        <p className="followup-small">
                          🕒{" "}
                          {new Date(reminder.fecha).toLocaleTimeString("es-CO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </>
                    )}

                    {reminder.frecuencia && (
                      <p className="followup-frequency">{reminder.frecuencia}</p>
                    )}

                    {reminder.completed && reminder.completedAt && (
                      <p className="followup-completed">
                        ✔️ Completado el{" "}
                        {new Date(reminder.completedAt).toLocaleString("es-CO")}
                      </p>
                    )}
                  </div>

                  <div className="followup-right">
                    <p className="followup-question">
                      {reminder.tipo === "medicamento" ? "¿Lo tomaste?" : "¿Asistió?"}
                    </p>
                    <label className="followup-switch">
                      <input
                        type="checkbox"
                        checked={reminder.completed || false}
                        onChange={() =>
                          handleToggleCompleted(reminder._id, reminder.completed)
                        }
                      />
                      <span className="followup-slider"></span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Followup;
