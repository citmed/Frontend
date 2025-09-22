import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import '../styles/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        birthdate: '',
        phone: '',
        email: '',
        username: '',
        password: '',
        confirmPassword:''
    });

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ⚡ Nuevo estado solo para el error de confirmación
    const [confirmError, setConfirmError] = useState('');

    useEffect(() => {
        document.body.classList.add('register-background');
        return () => {
            document.body.classList.remove('register-background');
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (message) setMessage('');
        if (confirmError) setConfirmError('');
    };

    // --- Indicador de seguridad ---
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };
    const strength = getPasswordStrength(formData.password);

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage('Por favor, ingresa tu nombre');
            return false;
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.name)) {
            setMessage('El nombre solo puede contener letras y espacios');
            return false;
        }
        if (!formData.lastName.trim()) {
            setMessage('Por favor, ingresa tu apellido');
            return false;
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.lastName)) {
            setMessage('El apellido solo puede contener letras y espacios');
            return false;
        }
        if (!formData.birthdate.trim()) {
            setMessage('Por favor, selecciona tu fecha de nacimiento');
            return false;
        }
        if (!formData.phone.trim()) {
            setMessage('Por favor, ingresa tu número de teléfono');
            return false;
        }
        if (!/^\d+$/.test(formData.phone)) {
            setMessage('El teléfono solo debe contener números');
            return false;
        }
        if (!formData.email.trim()) {
            setMessage('Por favor, ingresa tu correo electrónico');
            return false;
        }
        if (!formData.username.trim()) {
            setMessage('Por favor, ingresa un nombre de usuario');
            return false;
        }
        if (/\s/.test(formData.username)) {
            setMessage('El nombre de usuario no puede contener espacios');
            return false;
        }
        if (!formData.password.trim()) {
            setMessage('Por favor, ingresa una contraseña');
            return false;
        }
        if (formData.password.length < 8) {
            setMessage('La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setMessage('La contraseña debe contener al menos una letra mayúscula');
            return false;
        }
        if (!/[a-z]/.test(formData.password)) {
            setMessage('La contraseña debe contener al menos una letra minúscula');
            return false;
        }
        if (!/[0-9]/.test(formData.password)) {
            setMessage('La contraseña debe contener al menos un número');
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setMessage('La contraseña debe contener al menos un carácter especial');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔎 Validación extra de confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            setConfirmError('❌ Las contraseñas no coinciden');
            return;
        }

        if (!validateForm()) return;

        setIsLoading(true);
        setMessage('');

        try {
            // enviamos solo la contraseña principal
            const { confirmPassword, ...dataToSend } = formData;

            const response = await fetch('https://citamedback.vercel.app/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('¡Registro exitoso! Redirigiendo a inicio de sesión...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage(data.msg || 'Error en el registro. Intenta nuevamente.');
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage('Error en la conexión con el servidor. Verifica tu conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="back-button-container">
                <Link to="/" className="back-button">← Volver</Link> 
            </div>
    
            <div className="register-container">  
                <div className="register-header">
                    <h1 className="title">CITAMED</h1>
                    <h2>Crear Cuenta</h2>
                    <p>Únete a Citamed y gestiona tus citas médicas de manera fácil y segura</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
    
                <form onSubmit={handleSubmit} className="register-form">
                    {/* ...todo tu código igual... */}

                    {/* Contraseña */}
                    <div className="form-group password-group">
                        <label htmlFor="password">Contraseña *</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo"
                                required
                            />
                            <span 
                                className="toggle-password" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Indicador de seguridad */}
                        <div className="password-strength">
                            <div className={`strength-bar ${strength >= 1 ? 'active' : ''}`} />
                            <div className={`strength-bar ${strength >= 2 ? 'active' : ''}`} />
                            <div className={`strength-bar ${strength >= 3 ? 'active' : ''}`} />
                            <div className={`strength-bar ${strength >= 4 ? 'active' : ''}`} />
                            <div className={`strength-bar ${strength >= 5 ? 'active' : ''}`} />
                        </div>
                        <p className="strength-text">
                            {strength === 0 && "Muy débil"}
                            {strength === 1 && "Muy débil"}
                            {strength === 2 && "Débil"}
                            {strength === 3 && "Aceptable"}
                            {strength === 4 && "Fuerte"}
                            {strength === 5 && "Muy fuerte"}
                        </p>
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="form-group password-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite tu contraseña"
                                required
                            />
                            <span 
                                className="toggle-password" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {/* 🚨 Mensaje de error de confirmación */}
                        {confirmError && <p className="error-text">{confirmError}</p>}
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>

                    <div className="login-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );        
}

export default Register;
