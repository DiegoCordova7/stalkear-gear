import { useState } from 'react';
import { useCart } from '../context/cart/useCart';
import { Link } from 'react-router-dom';
import './Comparator.css';

export const Comparator = () => {
    const { products } = useCart();
    const [selectedIds, setSelectedIds] = useState([]);
    const handleSelectChange = (e) => {
        const id = e.target.value;
        if (!id) return;
        if (selectedIds.includes(id)) return;
        if (selectedIds.length >= 3) {
            alert('Puedes comparar un máximo de 3 productos simultáneamente.');
            return;
        }
        setSelectedIds([...selectedIds, id]);
        e.target.value = '';
    };

    const handleRemove = (id) => {
        setSelectedIds(selectedIds.filter((item) => item !== id));
    };

    const selectedProducts = selectedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);

    return (
        <div className="tactical-comparator-container">
            <h1 className="tactical-comparator-title">COMPARADOR DE EQUIPO TÁCTICO</h1>
            <p className="tactical-comparator-subtitle">Contrasta especificaciones, rangos de precio y existencias cara a cara.</p>
            <div className="tactical-selector-box">
                <label className="tactical-selector-label">AÑADIR PRODUCTO AL COMPARADOR (MÁX. 3):</label>
                <select onChange={handleSelectChange} defaultValue="" className="tactical-select-input">
                    <option value="" disabled>Selecciona un elemento del arsenal...</option>
                    {products.map((prod) => (
                        <option key={prod.id} value={prod.id} disabled={selectedIds.includes(prod.id)}>
                            {prod.nombre} — ${prod.precio} MXN
                        </option>
                    ))}
                </select>
            </div>
            {selectedProducts.length === 0 ? (
                <div className="tactical-comparator-empty">
                    <h2>NINGÚN EQUIPO SELECCIONADO</h2>
                    <p>Agrega al menos dos elementos para iniciar la comparativa técnica.</p>
                    <Link to="/catalog" className="tactical-btn-catalog">
                        IR AL CATÁLOGO
                    </Link>
                </div>
            ) : (
                <div className="tactical-table-wrapper">
                    <table className="tactical-comparison-table">
                        <thead>
                            <tr>
                                <th style={{ width: '180px' }}>Parámetro</th>
                                {selectedProducts.map((prod) => (
                                    <th key={prod.id} style={{ textAlign: 'center' }}>
                                        <button onClick={() => handleRemove(prod.id)} className="tactical-remove-btn">
                                            QUITAR ✕
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 'bold', color: '#9ca3af' }}>Visual / Identidad</td>
                                {selectedProducts.map((prod) => (
                                    <td key={prod.id} style={{ textAlign: 'center' }}>
                                        <img src={prod.imagen} alt={prod.nombre} className="tactical-comp-img" />
                                        <div className="tactical-comp-title">{prod.nombre}</div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', color: '#9ca3af' }}>Precio Base</td>
                                {selectedProducts.map((prod) => (
                                    <td key={prod.id} style={{ textAlign: 'center' }}>
                                        <span className="tactical-comp-price">${prod.precio.toLocaleString()} MXN</span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', color: '#9ca3af' }}>Categoría</td>
                                {selectedProducts.map((prod) => (
                                    <td key={prod.id} style={{ textAlign: 'center' }}>
                                        <span className="tactical-comp-category">{prod.categoria}</span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', color: '#9ca3af' }}>Existencias (Stock)</td>
                                {selectedProducts.map((prod) => (
                                    <td key={prod.id} style={{ textAlign: 'center', color: prod.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                        {prod.stock > 0 ? `${prod.stock} unidades` : 'AGOTADO'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', color: '#9ca3af' }}>Descripción Táctica</td>
                                {selectedProducts.map((prod) => (
                                    <td key={prod.id} style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                                        {prod.descripcion || 'Sin especificaciones detalladas registradas.'}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};