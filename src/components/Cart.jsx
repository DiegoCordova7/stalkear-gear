import { useCart } from '../context/cart/useCart';
import { useAuth } from '../context/auth/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StripeCheckoutBox } from './StripeCheckoutBox';
import './Cart.css';

export const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getTotal, checkout, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);

    const handleCheckout = async () => {
        setError(null);
        setMessage(null);
        setIsCreatingOrder(true);

        try {
            const result = await checkout(user ? user.id : 'anonimo');
            if (result.success) {
                if (result.clientSecret && result.order) {
                    setPendingOrder(result.order);
                    setClientSecret(result.clientSecret);
                } else {
                    setMessage(`¡ORDEN GENERADA EXITOSAMENTE! ID: ${result.orderId}`);
                    setTimeout(() => navigate('/profile'), 2000);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar el checkout.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const handlePaymentSuccess = async (paidOrder) => {
        setPendingOrder(null);
        setClientSecret(null);
        setMessage(`¡PAGO CONFIRMADO Y ORDEN PAGADA! ID: ${paidOrder.id}`);
        await clearCart();
        setTimeout(() => navigate('/profile'), 2000);
    };

    const getImagePath = (imgPath) => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http') || imgPath.startsWith('blob')) return imgPath;
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        return `${cleanBase}${cleanPath}`;
    };

    if (cart.length === 0 && !pendingOrder) {
        return (
            <div className="tactical-empty-cart">
                <h2 className="tactical-empty-title">EL CARRITO ESTÁ VACÍO</h2>
                <p className="tactical-empty-desc">No hay equipo táctico seleccionado en este momento.</p>
                {message && <div className="tactical-alert success">{message}</div>}
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

            {!pendingOrder && (
                <>
                    <div className="tactical-cart-items-list">
                        {cart.map((item) => {
                            const maxStock = item.stock ?? 99;
                            const canIncrement = item.cantidad < maxStock;

                            return (
                                <div key={item.id} className="tactical-cart-item">
                                    <div className="tactical-cart-item-info">
                                        <img
                                            src={getImagePath(item.imagen)}
                                            alt={item.nombre}
                                            className="tactical-cart-item-img"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80";
                                            }}
                                        />
                                        <div>
                                            <h3 className="tactical-cart-item-name">{item.nombre}</h3>
                                            <p className="tactical-cart-item-price">${item.precio} MXN</p>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                                                Stock disponible: {maxStock}
                                            </span>
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
                                                onClick={() => {
                                                    if (canIncrement) {
                                                        updateQuantity(item.id, item.cantidad + 1);
                                                    }
                                                }}
                                                disabled={!canIncrement}
                                                className="tactical-qty-btn"
                                                style={{ opacity: canIncrement ? 1 : 0.4, cursor: canIncrement ? 'pointer' : 'not-allowed' }}
                                                title={canIncrement ? 'Aumentar cantidad' : 'Límite de stock alcanzado'}
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
                            );
                        })}
                    </div>

                    <div className="tactical-cart-summary">
                        <button
                            onClick={clearCart}
                            className="tactical-clear-btn"
                            disabled={isCreatingOrder}
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
                                disabled={isCreatingOrder}
                                className="tactical-btn tactical-checkout-btn"
                            >
                                {isCreatingOrder ? 'GENERANDO ORDEN...' : 'CONFIRMAR PEDIDO (CHECKOUT)'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <StripeCheckoutBox
                order={pendingOrder}
                clientSecret={clientSecret}
                onPaid={handlePaymentSuccess}
                onCancel={() => {
                    setPendingOrder(null);
                    setClientSecret(null);
                }}
            />
        </div>
    );
};