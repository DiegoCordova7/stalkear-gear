import { useState } from 'react';
import { useAuth } from '../context/auth/useAuth';
import { useCart } from '../context/cart/useCart';
import './Admin.css';

export const Admin = () => {
    const { user, usersList } = useAuth();
    const { products, saveProducts, orders } = useCart();

    const [activeTab, setActiveTab] = useState('products');

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState(null);

    if (!user || user.role !== 'admin') {
        return (
            <div className="tactical-denied">
                <h2>ACCESO RESTRINGIDO A COMANDANCIA</h2>
                <p>Este nivel de autorización requiere credenciales con rango de Administrador.</p>
                <p className="tactical-denied-tip">
                    (Tip: Puedes cambiar temporalmente tu rol a 'admin' en el objeto de usuario en localStorage o mediante la base de datos de usuarios).
                </p>
            </div>
        );
    }

    const handleCreateProduct = (e) => {
        e.preventDefault();
        if (!nombre || !precio || !stock || !categoria) {
            setMensaje({ type: 'error', text: 'Completa los campos obligatorios del producto.' });
            return;
        }

        const newProd = {
            id: `prod-${Date.now()}`,
            nombre,
            precio: Number(precio),
            stock: Number(stock),
            categoria,
            imagen: imagen || 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400',
            descripcion
        };

        const updatedProducts = [newProd, ...products];
        saveProducts(updatedProducts);

        setNombre('');
        setPrecio('');
        setStock('');
        setCategoria('');
        setImagen('');
        setDescripcion('');
        setMensaje({ type: 'success', text: '¡Equipo táctico dado de alta en inventario con éxito!' });
        setTimeout(() => setMensaje(null), 3000);
    };

    const handleStockChange = (id, newStock) => {
        const updated = products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, Number(newStock)) } : p));
        saveProducts(updated);
    };

    return (
        <div className="tactical-admin-container">
            <h1 className="tactical-admin-title">CENTRO DE MANDO Y ADMINISTRACIÓN</h1>
            <p className="tactical-admin-subtitle">Control global de inventarios, órdenes de la red y credenciales de operadores.</p>

            {mensaje && (
                <div className={`tactical-admin-alert ${mensaje.type}`}>
                    {mensaje.text}
                </div>
            )}

            <div className="tactical-admin-tabs">
                <button
                    className={`tactical-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Gestión de Inventario ({products.length})
                </button>
                <button
                    className={`tactical-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Órdenes Globales ({orders.length})
                </button>
                <button
                    className={`tactical-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Operadores Registrados ({usersList.length})
                </button>
            </div>

            {activeTab === 'products' && (
                <div>
                    <div className="tactical-admin-card">
                        <h2>DAR DE ALTA NUEVO EQUIPO</h2>
                        <form onSubmit={handleCreateProduct} className="tactical-admin-form">
                            <div className="tactical-admin-field">
                                <label className="tactical-admin-label">Nombre del Producto</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="tactical-admin-input" placeholder="Ej. Chaleco Táctico MK-II" />
                            </div>
                            <div className="tactical-admin-field">
                                <label className="tactical-admin-label">Precio (MXN)</label>
                                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className="tactical-admin-input" placeholder="1500" />
                            </div>
                            <div className="tactical-admin-field">
                                <label className="tactical-admin-label">Stock Inicial</label>
                                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="tactical-admin-input" placeholder="10" />
                            </div>
                            <div className="tactical-admin-field">
                                <label className="tactical-admin-label">Categoría</label>
                                <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="tactical-admin-input" placeholder="Protección / Óptica" />
                            </div>
                            <div className="tactical-admin-field grid-full">
                                <label className="tactical-admin-label">URL de Imagen</label>
                                <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} className="tactical-admin-input" placeholder="https://..." />
                            </div>
                            <div className="tactical-admin-field grid-full">
                                <label className="tactical-admin-label">Descripción Táctica</label>
                                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="tactical-admin-input" rows="2" placeholder="Detalles técnicos del equipo..." />
                            </div>
                            <button type="submit" className="tactical-admin-submit">REGISTRAR EN CATÁLOGO</button>
                        </form>
                    </div>

                    <div className="tactical-admin-card">
                        <h2>INVENTARIO ACTUAL Y MODIFICACIÓN RÁPIDA DE STOCK</h2>
                        <div className="tactical-admin-table-wrapper">
                            <table className="tactical-admin-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock Disponible</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td className="table-bold">{prod.nombre}</td>
                                            <td>{prod.categoria}</td>
                                            <td>${prod.precio.toLocaleString()} MXN</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={prod.stock}
                                                    onChange={(e) => handleStockChange(prod.id, e.target.value)}
                                                    className="tactical-stock-input"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="tactical-admin-card">
                    <h2>HISTORIAL GLOBAL DE ÓRDENES</h2>
                    {orders.length === 0 ? (
                        <p className="tactical-empty-text">No se han registrado transacciones en la red.</p>
                    ) : (
                        <div className="tactical-admin-table-wrapper">
                            <table className="tactical-admin-table">
                                <thead>
                                    <tr>
                                        <th>ID Orden</th>
                                        <th>Operador (ID)</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((ord) => (
                                        <tr key={ord.id}>
                                            <td className="table-order-id">{ord.id}</td>
                                            <td className="table-mono">{ord.userId}</td>
                                            <td>{ord.fecha}</td>
                                            <td className="table-price">{ord.total.toLocaleString()} MXN</td>
                                            <td><span className="table-badge-success">{ord.estado}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="tactical-admin-card">
                    <h2>RED DE OPERADORES REGISTRADOS</h2>
                    <div className="tactical-admin-table-wrapper">
                        <table className="tactical-admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo Electrónico</th>
                                    <th>Rol / Rango</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u.id}>
                                        <td className="table-mono">{u.id}</td>
                                        <td className="table-bold">{u.nombre}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`table-badge-role ${u.role === 'admin' ? 'admin' : 'client'}`}>
                                                {u.role || 'client'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};