import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth/useAuth';
import './Login.css';

export const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!nombre || !email || !password) {
            setError('TODOS LOS CAMPOS SON OBLIGATORIOS.');
            return;
        }

        if (password.length < 6) {
            setError('LA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES.');
            return;
        }

        const result = register({ nombre, email, password });

        if (result.success) navigate('/catalog');
        else setError(result.message || 'ERROR AL REGISTRAR EL OPERADOR.');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">NUEVO REGISTRO</h1>
                    <p className="login-subtitle">ALTA DE USUARIO EN STALKEAR GEAR</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label className="login-label">Nombre del Usuario</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. Diego Cordova"
                            className="login-input"
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operador@stalkear.gear"
                            className="login-input"
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="login-input"
                        />
                    </div>

                    <button type="submit" className="login-submit-btn">
                        DAR DE ALTA USUARIO
                    </button>
                </form>

                <div className="login-footer-info">
                    <span>¿Ya tienes una cuenta activa? </span>
                    <Link to="/login" style={{ color: 'var(--tactical-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
                        INGRESAR
                    </Link>
                </div>
            </div>
        </div>
    );
};