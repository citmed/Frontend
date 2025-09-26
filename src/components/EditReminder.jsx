import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/Logocitamed.png";
import "../styles/EditReminder.css";

const EditReminder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reminder, setReminder] = useState(null);
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        fecha: "",
        dosis: "",
        unidad: "",
        cantidadDisponible: "",
        tipo: "" // control | medicamento
    });


    // 🔹 Corrige el desfase horario (UTC → Local)
    const formatDateForInput = (dateString) => {
        const d = new Date(dateString);
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d - tzOffset).toISOString().slice(0, 16);
    };

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

                // Inicializar formulario con datos existentes
                setFormData({
                    titulo: res.data.titulo || "",
                    descripcion: res.data.descripcion || "",
                    fecha: res.data.fecha ? formatDateForInput(res.data.fecha) : "",
                    dosis: res.data.dosis || "",
                    unidad: res.data.unidad || "",
                    cantidadDisponible: res.data.cantidadDisponible || "",
                    tipo: res.data.tipo || "control",
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

    // 🔹 Validación: todos los campos requeridos según tipo
    const isFormValid = () => {
        if (formData.tipo === "control") {
            return formData.titulo && formData.descripcion && formData.fecha;
        }
        if (formData.tipo === "medicamento") {
            return (
                formData.titulo &&
                formData.descripcion &&
                formData.dosis &&
                formData.unidad &&
                formData.cantidadDisponible &&
                formData.fecha
            );
        }
        return false;
    };

    // 🔹 Verificar si hay cambios respecto al recordatorio original
    const isModified =
        reminder &&
        Object.keys(formData).some((key) => {
            const originalValue =
                reminder[key] !== undefined && reminder[key] !== null
                    ? reminder[key].toString().trim()
                    : "";
            const currentValue = formData[key]
                ? formData[key].toString().trim()
                : "";
            return originalValue !== currentValue;
        });

    // 🔹 Guardar cambios
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            alert("⚠️ Debes completar todos los campos antes de guardar.");
            return;
        }
        if (!isModified) {
            alert("⚠️ Debes modificar al menos un campo antes de guardar.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://citamedback.vercel.app/api/reminders/${id}`,
                {
                    ...formData,
                    fecha: new Date(formData.fecha).toISOString(), // 👈 Convierte a UTC antes de enviar
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate("/reminder"); // ✅ Redirige a lista de recordatorios
        } catch (error) {
            console.error("❌ Error al actualizar recordatorio:", error);
        }
    };

    if (!reminder) return <p>Cargando recordatorio...</p>;

    return (
        <>
            <nav className="bottom">
                <button className="nav-button" onClick={() => navigate("/reminder")}>
                    <FaArrowLeft />
                </button>
                <img
                    src={logo}
                    alt="Seguimiento y cumplimiento"
                    className="milogo-medicine"
                />
            </nav>

            <div className="form-container">
                <h2> Editar Recordatorio ({formData.tipo})</h2>
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

                    <label>Fecha y hora</label>
                    <input
                        type="datetime-local"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />

                    {formData.tipo === "medicamento" && (
                        <>
                            <label>Dosis</label>
                            <input
                                type="number"
                                name="dosis"
                                value={formData.dosis}
                                onChange={handleChange}
                                required
                            />

                            <label>Unidad</label>
                            <select
                                name="unidad"
                                value={formData.unidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled hidden>
                                    Seleccione una unidad
                                </option>
                                <option value="Unidades">Unidades (tabletas, cápsulas)</option>
                                <option value="Miligramos">Miligramos (mg)</option>
                                <option value="Gramos">Gramos (g)</option>
                                <option value="Mililitros">Mililitros (ml)</option>
                                <option value="Litros">Litros (l)</option>
                                <option value="Gotas">Gotas</option>
                                <option value="Sobres">Sobres</option>
                            </select>

                            <label>Cantidad disponible</label>
                            <input
                                type="number"
                                name="cantidadDisponible"
                                value={formData.cantidadDisponible}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}

                    <div className="button-group">
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={!isModified || !isFormValid()}
                        >
                            💾 Guardar cambios
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/reminder")}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditReminder;
