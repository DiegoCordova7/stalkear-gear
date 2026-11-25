import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/useAuth';
import {
    fetchProducts,
    createProduct,
    updateProductStock,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    updateUserRole,
    toggleUserStatus
} from '../services/api';
import './Admin.css';

export const Admin = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setLoading(true);
                const [prodsData, ordersData, usersData] = await Promise.all([
                    fetchProducts(),
                    getAllOrders(),
                    getAllUsers()
                ]);
                setProducts(prodsData);
                setOrders(ordersData);
                setUsersList(usersData);
            } catch (err) {
                console.error("Error al cargar datos de administración:", err);
                setMensaje({ type: 'error', text: 'Error al conectar con el servidor backend.' });
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            loadAdminData();
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="tactical-denied">
                <h2>ACCESO RESTRINGIDO A COMANDANCIA</h2>
                <p>Este nivel de autorización requiere credenciales con rango de Administrador.</p>
            </div>
        );
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!nombre || !precio || !stock || !categoria) {
            setMensaje({ type: 'error', text: 'Completa los campos obligatorios del producto.' });
            return;
        }

        try {
            const newProd = {
                nombre,
                precio: Number(precio),
                stock: Number(stock),
                categoria,
                imagen: imagen || 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400',
                descripcion
            };

            const created = await createProduct(newProd);
            setProducts([created, ...products]);

            setNombre('');
            setPrecio('');
            setStock('');
            setCategoria('');
            setImagen('');
            setDescripcion('');
            setMensaje({ type: 'success', text: '¡Equipo táctico dado de alta en el servidor con éxito!' });
            setTimeout(() => setMensaje(null), 3000);
        } catch (err) {
            setMensaje({ type: 'error', text: err.message || 'Error al registrar el producto.' });
        }
    };

    const handleStockChange = async (id, newStock) => {
        const numericStock = Math.max(0, Number(newStock));
        try {
            await updateProductStock(id, numericStock);
            setProducts(products.map((p) => (p.id === id ? { ...p, stock: numericStock } : p)));
        } catch (err) {
            console.error("Error al actualizar stock:", err);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
            setMensaje({ type: 'success', text: `Estado de orden ${orderId} actualizado a ${newStatus}` });
            setTimeout(() => setMensaje(null), 3000);
        } catch (err) {
            setMensaje({ type: 'error', text: 'Error al actualizar el estado de la orden.' });
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'client' : 'admin';
        try {
            const updated = await updateUserRole(userId, newRole);
            setUsersList(usersList.map(u => u.id === userId ? updated : u));
        } catch (err) {
            setMensaje({ type: 'error', text: 'Error al cambiar el rol del operador.' });
        }
    };

    const handleToggleActive = async (userId, currentActive) => {
        const newActive = !currentActive;
        try {
            const updated = await toggleUserStatus(userId, newActive);
            setUsersList(usersList.map(u => u.id === userId ? updated : u));
        } catch (err) {
            setMensaje({ type: 'error', text: 'Error al cambiar el estado de la cuenta.' });
        }
    };

    if (loading) {
        return <div className="tactical-loading">CARGANDO CENTRO DE MANDO...</div>;
    }

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
                                        <th>Operador (Cliente)</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                        <th>Acción / Cambiar Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((ord) => (
                                        <tr key={ord.id}>
                                            <td className="table-order-id">{ord.id}</td>
                                            <td className="table-mono">{ord.customerName || ord.userId}</td>
                                            <td className="table-price">${ord.totalAmount?.toLocaleString()} MXN</td>
                                            <td><span className="table-badge-success">{ord.status}</span></td>
                                            <td>
                                                <select
                                                    value={ord.status}
                                                    onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                                    className="tactical-admin-select"
                                                >
                                                    <option value="PAGADO">PAGADO</option>
                                                    <option value="EN_PREPARACION">EN_PREPARACION</option>
                                                    <option value="ENVIADO">ENVIADO</option>
                                                    <option value="ENTREGADO">ENTREGADO</option>
                                                    <option value="CANCELADO">CANCELADO</option>
                                                </select>
                                            </td>
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
                                    <th>Estado de Cuenta</th>
                                    <th>Acciones</th>
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
                                        <td>
                                            <span className={`table-badge-role ${u.active !== false ? 'admin' : 'client'}`}>
                                                {u.active !== false ? 'Activo' : 'Suspendido'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleRoleChange(u.id, u.role)}
                                                className="tactical-action-btn"
                                            >
                                                Cambiar Rol
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(u.id, u.active !== false)}
                                                className="tactical-action-btn secondary"
                                                style={{ marginLeft: '8px' }}
                                            >
                                                {u.active !== false ? 'Suspender' : 'Activar'}
                                            </button>
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