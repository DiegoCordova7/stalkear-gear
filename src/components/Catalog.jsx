import { useState, useMemo } from 'react';
import { useCart } from '../context/cart/useCart';
import { ProductCard } from './ProductCard';
import './Catalog.css';

export const Catalog = () => {
    const { products, addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [notification, setNotification] = useState(null);

    const categories = useMemo(() => {
        const cats = products.map((p) => p.categoria);
        return ['Todos', ...new Set(cats)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === 'Todos' || product.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const handleAddToCart = (product) => {
        if (product.stock <= 0) return;
        addToCart(product, 1);
        setNotification(`Equipamiento asignado: ${product.nombre}`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="home-container">
            {notification && (
                <div className="home-notification">
                    🛡️ {notification}
                </div>
            )}

            <div className="home-banner">
                <h1 className="home-title">CATÁLOGO DE OPERACIONES STALKEAR GEAR</h1>
                <p className="home-subtitle">
                    Sistemas de despliegue, hidratación MIL-SPEC y componentes de supervivencia de precisión.
                </p>
            </div>

            <div className="home-controls">
                <input
                    type="text"
                    placeholder="Buscar equipamiento táctico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="home-search-input"
                />

                <div className="home-category-group">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`home-category-btn ${selectedCategory === cat ? 'home-category-btn-active' : ''
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="home-empty-state">
                    No se localizó equipamiento bajo los filtros actuales.
                </div>
            ) : (
                <div className="catalog-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};