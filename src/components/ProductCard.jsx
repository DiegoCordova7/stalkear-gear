import { Link } from 'react-router-dom';
import './ProductCard.css';

export const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <div>
                <Link to={`/product/${product.id}`} className="product-card-img-wrapper">
                    <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="product-card-img"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80";
                        }}
                    />
                    <span className="product-card-category">
                        {product.categoria}
                    </span>
                </Link>

                <div className="product-card-body">
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                        <h3 className="product-card-title">{product.nombre}</h3>
                    </Link>
                    <p className="product-card-desc">{product.descripcion}</p>

                    {product.especificaciones && (
                        <div className="product-card-specs">
                            <div className="product-card-spec-item">
                                {product.especificaciones.peso || 'N/A'}
                            </div>
                            <div className="product-card-spec-item">
                                {product.especificaciones.gradoMilitar || 'MIL-SPEC'}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="product-card-footer">
                <div>
                    <span className="product-card-label">PRECIO</span>
                    <span className="product-card-price">
                        ${product.precio.toFixed(2)} <span className="product-card-currency">MXN</span>
                    </span>
                </div>

                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="tactical-btn"
                    style={{ opacity: product.stock <= 0 ? 0.5 : 1 }}
                >
                    {product.stock > 0 ? '+ AÑADIR' : 'AGOTADO'}
                </button>
            </div>
        </div>
    );
};