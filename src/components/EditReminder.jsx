import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditReminder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    frecuencia: "",
    dosis: "",
    unidad: "",
    cantidadDisponible: ""
  });

  // 🔹 Traer el recordatorio por ID
  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://citamedback.vercel.app/api/reminders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReminder(res.data);
      } catch (error) {
        console.error("❌ Error al traer recordatorio:", error);
      }
    };
    fetchReminder();
  }, [id]);

  // 🔹 Manejar cambios en inputs
  const handleChange = (e) => {
    setReminder({ ...reminder, [e.target.name]: e.target.value });
  };

  // 🔹 Guardar cambios (PUT al backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://citamedback.vercel.app/api/reminders/${id}`,
        reminder,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/reminders"); // redirigir a lista después de editar
    } catch (error) {
      console.error("❌ Error al actualizar recordatorio:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Recordatorio</h2>
      <form onSubmit={handleSubmit}>
        <label>Título</label>
        <input 
          type="text" 
          name="titulo" 
          value={reminder.titulo} 
          onChange={handleChange} 
          required 
        />

        <label>Descripción</label>
        <textarea 
          name="descripcion" 
          value={reminder.descripcion} 
          onChange={handleChange} 
        />

        <label>Fecha</label>
        <input 
          type="datetime-local" 
          name="fecha" 
          value={reminder.fecha ? new Date(reminder.fecha).toISOString().slice(0,16) : ""} 
          onChange={handleChange} 
          required 
        />

        <label>Frecuencia</label>
        <input 
          type="text" 
          name="frecuencia" 
          value={reminder.frecuencia || ""} 
          onChange={handleChange} 
        />

        <label>Dosis</label>
        <input 
          type="number" 
          name="dosis" 
          value={reminder.dosis || ""} 
          onChange={handleChange} 
        />

        <label>Unidad</label>
        <input 
          type="text" 
          name="unidad" 
          value={reminder.unidad || ""} 
          onChange={handleChange} 
        />

        <label>Cantidad disponible</label>
        <input 
          type="number" 
          name="cantidadDisponible" 
          value={reminder.cantidadDisponible || ""} 
          onChange={handleChange} 
        />

        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={() => navigate("/reminders")}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditReminder;
