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
            setTimeout(() => navigate('/profile'), 2000);
        } else setError(result.message);
    };

    if (cart.length === 0) {
        return (
            <div className="tactical-empty-cart">
                <h2 className="tactical-empty-title">EL CARRITO ESTÁ VACÍO</h2>
                <p className="tactical-empty-desc">No hay equipo táctico seleccionado en este momento.</p>
                <Link to="/catalog" className="tactical-btn tactical-empty-btn">
                    IR AL CATÁLOGO
                </Link>
            </div>
        );
    }

    return (
        <div className="tactical-cart-container">
            <h1 className="tactical-cart-title">
                ARSENAL SELECCIONADO (CARRITO)
            </h1>

            {error && <div className="tactical-alert error">{error}</div>}
            {message && <div className="tactical-alert success">{message}</div>}

            <div className="tactical-cart-items-list">
                {cart.map((item) => (
                    <div key={item.id} className="tactical-cart-item">
                        <div className="tactical-cart-item-info">
                            <img src={item.imagen} alt={item.nombre} className="tactical-cart-item-img" />
                            <div>
                                <h3 className="tactical-cart-item-name">{item.nombre}</h3>
                                <p className="tactical-cart-item-price">${item.precio} MXN</p>
                            </div>
                        </div>

                        <div className="tactical-cart-item-actions">
                            <div className="tactical-quantity-control">
                                <button
                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                    className="tactical-qty-btn"
                                >
                                    -
                                </button>
                                <span className="tactical-qty-value">{item.cantidad}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                    className="tactical-qty-btn"
                                >
                                    +
                                </button>
                            </div>

                            <span className="tactical-cart-item-subtotal">
                                ${(item.precio * item.cantidad).toLocaleString()} MXN
                            </span>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="tactical-remove-btn"
                                title="Eliminar artículo"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tactical-cart-summary">
                <button
                    onClick={clearCart}
                    className="tactical-clear-btn"
                >
                    Vaciar Carrito
                </button>

                <div className="tactical-total-box">
                    <p className="tactical-total-label">TOTAL GENERAL:</p>
                    <p className="tactical-total-amount">
                        ${getTotal().toLocaleString()} MXN
                    </p>
                    <button
                        onClick={handleCheckout}
                        className="tactical-btn tactical-checkout-btn"
                    >
                        CONFIRMAR PEDIDO (CHECKOUT)
                    </button>
                </div>
            </div>
        </div>
    );
};