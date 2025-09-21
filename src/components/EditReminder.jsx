import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditReminder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    frecuencia: "",
    dosis: "",
    unidad: "",
    cantidadDisponible: ""
  });

  // 🔹 Traer recordatorio por ID
  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://citamedback.vercel.app/api/reminders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReminder(res.data);

        // Inicializa el formulario con lo que ya tenía el recordatorio
        setFormData({
          titulo: res.data.titulo || "",
          descripcion: res.data.descripcion || "",
          fecha: res.data.fecha
            ? new Date(res.data.fecha).toISOString().slice(0, 16)
            : "",
          frecuencia: res.data.frecuencia || "",
          dosis: res.data.dosis || "",
          unidad: res.data.unidad || "",
          cantidadDisponible: res.data.cantidadDisponible || ""
        });
      } catch (error) {
        console.error("❌ Error al traer recordatorio:", error);
      }
    };
    fetchReminder();
  }, [id]);

  // 🔹 Manejo de cambios
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Validación: obligar cambios en TODOS los campos
  const isModified =
  reminder &&
  Object.keys(formData).every((key) => formData[key].toString().trim() !== "") &&
  Object.keys(formData).some((key) => {
    return formData[key].toString().trim() !==
      (reminder[key] ? reminder[key].toString().trim() : "");
  });


  // 🔹 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModified) {
      alert("⚠️ Debes modificar todos los campos antes de guardar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://citamedback.vercel.app/api/reminders/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/reminder"); // ✅ Redirige a lista de recordatorios
    } catch (error) {
      console.error("❌ Error al actualizar recordatorio:", error);
    }
  };

  if (!reminder) return <p>Cargando recordatorio...</p>;

  return (
    <div className="form-container">
      <h2>✏️ Editar Recordatorio</h2>
      <form onSubmit={handleSubmit}>
        <label>Título</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label>Fecha</label>
        <input
          type="datetime-local"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />

        <label>Frecuencia</label>
        <input
          type="text"
          name="frecuencia"
          value={formData.frecuencia}
          onChange={handleChange}
          required
        />

        <label>Dosis</label>
        <input
          type="number"
          name="dosis"
          value={formData.dosis}
          onChange={handleChange}
          required
        />

        <label>Unidad</label>
        <input
          type="text"
          name="unidad"
          value={formData.unidad}
          onChange={handleChange}
          required
        />

        <label>Cantidad disponible</label>
        <input
          type="number"
          name="cantidadDisponible"
          value={formData.cantidadDisponible}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button
            type="submit"
            className="btn-save"
            disabled={!isModified}
          >
            💾 Guardar cambios
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/reminders")}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReminder;
