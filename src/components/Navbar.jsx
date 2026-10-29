import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/useAuth';
import { useCart } from '../context/cart/useCart';
import { Logo } from './Logo';
import './Navbar.css';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <header className="tactical-navbar">
            <div style={{ display: 'flex', items: 'center', gap: '1rem' }}>
                <Link to="/" className="tactical-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Logo size="38px" />
                    <span>STALKEAR GEAR</span>
                </Link>

                <nav className="tactical-nav-links" style={{ marginLeft: '1rem' }}>
                    <Link to="/catalog" className="tactical-nav-link">Catálogo</Link>
                    <Link to="/comparator" className="tactical-nav-link">Comparador</Link>
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/cart" className="tactical-btn" style={{ position: 'relative' }}>
                    Carrito
                    {totalItems > 0 && (
                        <span className="tactical-cart-badge">{totalItems}</span>
                    )}
                </Link>

                {user ? (
                    <div className="tactical-user-section">
                        <Link to="/profile" className="tactical-nav-link" style={{ fontSize: '0.85rem' }}>
                            {user.nombre}
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="tactical-admin-pill">
                                Admin
                            </Link>
                        )}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="tactical-logout-btn"
                        >
                            Salir
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="tactical-btn">
                        Ingresar
                    </Link>
                )}
            </div>
        </header>
    );
};