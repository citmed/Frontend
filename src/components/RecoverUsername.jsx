import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RecoverUsername.css"

const API_URL = "https://citamedback.vercel.app/api/auth";

function RecoverUsername() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/recoverusername`, { // 👈 ojo al guion, debe coincidir con tu ruta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // Ahora solo mostramos un mensaje general, no el username
        setMessage(data.msg || "✅ Se ha enviado tu usuario al correo.");
      } else {
        setError(data.msg || "Error al recuperar usuario");
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="recover-username-container">
      <h2>Recuperar Usuario</h2>
      <form onSubmit={handleRecover}>
        <div className="input-group">
          <label htmlFor="email">Correo registrado:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>
        <button type="submit">Recuperar Usuario</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <p>
        ¿Ya recordaste tu usuario?{" "}
        <a onClick={() => navigate("/login")}>Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default RecoverUsername;
