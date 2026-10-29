import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth/useAuth';
import './Login.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('TODOS LOS CAMPOS DE ACCESO SON OBLIGATORIOS.');
            return;
        }

        const result = login(email, password);

        if (result.success) {
            const savedSession = JSON.parse(localStorage.getItem('stalkear_session') || '{}');
            if (savedSession.role === 'admin') navigate('/admin');
            else navigate('/catalog');
        } else setError(result.message || 'FALLO EN LA AUTENTICACIÓN.');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">ACCESO AUTORIZADO</h1>
                    <p className="login-subtitle">SISTEMA DE SEGURIDAD STALKEAR GEAR</p>
                </div>
                {error && <div className="login-error">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
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
                        ESTABLECER CONEXIÓN
                    </button>
                </form>
                <div className="login-footer-info">
                    <span>¿Sin credenciales de operador? </span>
                    <Link to="/register" style={{ color: 'var(--tactical-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
                        REGISTRARSE
                    </Link>
                </div>
            </div>
        </div>
    );
};