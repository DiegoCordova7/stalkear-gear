import { useCart } from '../context/cart/useCart';
import { useAuth } from '../context/auth/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Cart.css';

export const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getTotal, checkout, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleCheckout = () => {
        setError(null);
        setMessage(null);

        const result = checkout(user ? user.id : 'anonimo');

        if (result.success) {
            setMessage(`¡ORDEN GENERADA EXITOSAMENTE! ID: ${result.orderId}`);
            setTimeout(() => {
                navigate('/profile'); // O a una vista de historial
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="tactical-empty-cart" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--tactical-accent, #00ff66)' }}>EL CARRITO ESTÁ VACÍO</h2>
                <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>No hay equipo táctico seleccionado en este momento.</p>
                <Link to="/catalog" className="tactical-btn" style={{ padding: '0.75rem 1.5rem', background: '#1f2937', color: '#fff', textDecoration: 'none', border: '1px solid #374151' }}>
                    IR AL CATÁLOGO
                </Link>
            </div>
        );
    }

    return (
        <div className="tactical-cart-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
                ARSENAL SELECCIONADO (CARRITO)
            </h1>

            {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid #ef4444' }}>{error}</div>}
            {message && <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '1rem', marginBottom: '1rem', borderLeft: '4px solid #10b981' }}>{message}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111827', padding: '1rem', border: '1px solid #1f2937', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={item.imagen} alt={item.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #374151' }} />
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f3f4f6' }}>{item.nombre}</h3>
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>${item.precio} MXN</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #374151', borderRadius: '4px' }}>
                                <button
                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                    style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '0.25rem 0.75rem', cursor: 'pointer' }}
                                >
                                    -
                                </button>
                                <span style={{ padding: '0 0.75rem', fontWeight: 'bold' }}>{item.cantidad}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                    style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '0.25rem 0.75rem', cursor: 'pointer' }}
                                >
                                    +
                                </button>
                            </div>

                            <span style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                                ${(item.precio * item.cantidad).toLocaleString()} MXN
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                title="Eliminar artículo"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111827', padding: '1.5rem', border: '1px solid #1f2937', borderRadius: '4px' }}>
                <button
                    onClick={clearCart}
                    style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #374151', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}
                >
                    Vaciar Carrito
                </button>

                <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '0.25rem' }}>TOTAL GENERAL:</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tactical-accent, #00ff66)' }}>
                        ${getTotal().toLocaleString()} MXN
                    </p>
                    <button
                        onClick={handleCheckout}
                        style={{ marginTop: '1rem', background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', width: '100%' }}
                    >
                        CONFIRMAR PEDIDO (CHECKOUT)
                    </button>
                </div>
            </div>
        </div>
    );
};