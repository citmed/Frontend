import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    const [winners, setWinners] = useState([]); // Estado para los ganadores
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); // Redirige si no hay token
            }
        };

        checkAuth(); // Verifica la autenticación al montar el componente

        const fetchWinners = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/winners', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Agrega el token aquí
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudieron obtener los ganadores');
                }

                const data = await response.json();
                setWinners(data); // Guarda los ganadores en el estado
            } catch (err) {
                console.error('Error:', err);
                setError(err.message); // Actualiza el estado de error
            }
        };

        fetchWinners(); // Llamada a la función para obtener los ganadores
    }, []); // El array vacío asegura que el efecto solo se ejecute una vez al montar el componente

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="admin-dashboard-container">
            <h2>Ganadores</h2>

            {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error si existe */}

            <table className="winners-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Ciudad</th>
                        <th>Teléfono</th>
                        <th>Código QR</th>
                        <th>Premio</th>
                    </tr>
                </thead>
                <tbody>
                    {winners.length > 0 ? (
                        winners.map((winner, index) => (
                            <tr key={index}>
                                <td>{winner.date}</td>
                                <td>{winner.user || 'N/A'}</td>
                                <td>{winner.city || 'N/A'}</td>
                                <td>{winner.phone || 'N/A'}</td>
                                <td>{winner.qrCode}</td>
                                <td>{winner.prize}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay ganadores disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button className="logout-btn" onClick={handleLogout}>
                Salir</button>
        </div>
    );
}

export default AdminDashboard;