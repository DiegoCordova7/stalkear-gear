import { useState } from 'react';
import { useAuth } from '../context/auth/useAuth';
import { useCart } from '../context/cart/useCart';
import './Profile.css';

export const Profile = () => {
    const { user, updateProfile } = useAuth();
    const { orders } = useCart();

    const [nombre, setNombre] = useState(user ? user.nombre : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [mensaje, setMensaje] = useState(null);

    if (!user) {
        return (
            <div className="tactical-empty-profile">
                <h2 className="tactical-empty-title">ACCESO RESTRINGIDO</h2>
                <p className="tactical-empty-subtitle">Debes iniciar sesión para acceder a las credenciales del operador.</p>
            </div>
        );
    }

    const userOrders = orders.filter((order) => order.userId === user.id);

    const handleUpdate = (e) => {
        e.preventDefault();
        updateProfile({ nombre, email });
        setMensaje('CREDENCIALES DE OPERADOR ACTUALIZADAS.');
        setTimeout(() => setMensaje(null), 3000);
    };

    return (
        <div className="tactical-profile-container">
            <h1 className="tactical-profile-title">
                PANEL DE OPERADOR: {user.nombre.toUpperCase()}
            </h1>

            {mensaje && <div className="tactical-alert-success">{mensaje}</div>}

            <div className="tactical-grid-layout">
                <div className="tactical-card-box">
                    <h2 className="tactical-card-title">CONFIGURACIÓN DE PERFIL</h2>
                    <form onSubmit={handleUpdate} className="tactical-form-group">
                        <div>
                            <label className="tactical-label">NOMBRE</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="tactical-input"
                            />
                        </div>
                        <div>
                            <label className="tactical-label">CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="tactical-input"
                            />
                        </div>
                        <div>
                            <label className="tactical-label">RANGO / ROL</label>
                            <input
                                type="text"
                                disabled
                                value={user.role === 'admin' ? 'Administrador del Sistema' : 'Operador Autorizado'}
                                className="tactical-input tactical-input-disabled"
                            />
                        </div>
                        <button type="submit" className="tactical-submit-btn">
                            GUARDAR CAMBIOS
                        </button>
                    </form>
                </div>

                <div className="tactical-card-box tactical-card-box-flex">
                    <div>
                        <h2 className="tactical-card-title">ESTADÍSTICAS DEL OPERADOR</h2>
                        <p className="tactical-stat-text">ID Único: <span className="tactical-stat-monospace">{user.id}</span></p>
                        <p className="tactical-stat-text">Órdenes Totales Ejecutadas: <span className="tactical-stat-bold">{userOrders.length}</span></p>
                    </div>
                    <div className="tactical-status-box">
                        <p className="tactical-status-label">ESTADO DE LA CONEXIÓN:</p>
                        <p className="tactical-status-online">
                            ● EN LÍNEA (PERSISTENTE)
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="tactical-orders-heading">HISTORIAL DE PEDIDOS</h2>
            {userOrders.length === 0 ? (
                <div className="tactical-card-box" style={{ textAlign: 'center', color: '#9ca3af' }}>
                    No se registran órdenes de compra emitidas por este operador.
                </div>
            ) : (
                userOrders.map((order) => (
                    <div key={order.id} className="tactical-order-card">
                        <div className="tactical-order-header">
                            <div>
                                <span className="tactical-order-id">ORDEN: {order.id}</span>
                                <span className="tactical-order-date">{order.fecha}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className="tactical-order-status">{order.estado}</span>
                                <span className="tactical-order-total">${order.total.toLocaleString()} MXN</span>
                            </div>
                        </div>
                        <div className="tactical-order-items">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="tactical-order-item-badge">
                                    {item.nombre} (x{item.cantidad})
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};