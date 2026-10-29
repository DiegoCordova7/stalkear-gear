import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/cart/useCart';
import './ProductDetail.css';

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null);

    const product = products.find((p) => String(p.id) === String(id));

    if (!product) {
        return (
            <div className="product-detail-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h2 className="product-detail-title">EQUIPAMIENTO NO LOCALIZADO</h2>
                <p className="product-detail-desc">El código de ítem especificado no existe en el registro táctico.</p>
                <Link to="/catalog" className="tactical-btn">Volver al Catálogo</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (product.stock <= 0) return;
        addToCart(product, quantity);
        setNotification(`Asignado al equipo: ${quantity}x ${product.nombre}`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="product-detail-container">
            {notification && (
                <div className="catalog-notification">
                    🛡️ {notification}
                </div>
            )}

            <button onClick={() => navigate(-1)} className="product-detail-back-btn">
                ← Volver al inventario
            </button>

            <div className="product-detail-grid">
                <div className="product-detail-img-wrapper">
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="product-detail-img"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80";
                        }}
                    />
                    <span className="product-detail-category">{product.categoria}</span>
                </div>

                <div className="product-detail-info">
                    <div>
                        <div className="product-detail-header-meta">
                            <span className="product-detail-id">REF: #{product.id}</span>
                            <span className={`product-detail-stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                {product.stock > 0 ? `STOCK: ${product.stock} UNIDADES` : 'AGOTADO'}
                            </span>
                        </div>

                        <h1 className="product-detail-title">{product.nombre}</h1>
                        <p className="product-detail-desc">{product.descripcion}</p>

                        {product.especificaciones && (
                            <div className="product-detail-specs-box">
                                <h3 className="specs-title">ESPECIFICACIONES MIL-SPEC</h3>
                                <ul className="specs-list">
                                    <li><span>Peso:</span> <strong>{product.especificaciones.peso || 'N/A'}</strong></li>
                                    <li><span>Grado:</span> <strong>{product.especificaciones.gradoMilitar || 'MIL-SPEC'}</strong></li>
                                    {product.especificaciones.material && (
                                        <li><span>Material:</span> <strong>{product.especificaciones.material}</strong></li>
                                    )}
                                    {product.especificaciones.resistencia && (
                                        <li><span>Resistencia:</span> <strong>{product.especificaciones.resistencia}</strong></li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Bloque de Compra y Precio */}
                    <div className="product-detail-actions">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span className="product-card-label">VALOR UNITARIO</span>
                                <span className="product-card-price">
                                    ${product.precio.toFixed(2)} <span className="product-card-currency">MXN</span>
                                </span>
                            </div>

                            {product.stock > 0 && (
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="qty-btn"
                                    >-</button>
                                    <span className="qty-value">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="qty-btn"
                                    >+</button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="tactical-btn"
                                style={{ flex: 1, padding: '0.75rem 1rem', opacity: product.stock <= 0 ? 0.5 : 1 }}
                            >
                                {product.stock > 0 ? '➕ AÑADIR AL EQUIPO' : 'SIN EXISTENCIAS'}
                            </button>

                            <Link
                                to="/comparator"
                                className="product-detail-back-btn"
                                style={{ marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                Comparar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};