import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
    return (
        <div className="home-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="home-banner" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="home-title" style={{ fontSize: '2.5rem' }}>STALKEAR GEAR</h1>
                <p className="home-subtitle" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Plataforma de equipamiento táctico y supervivencia de alto rendimiento para operadores autorizados.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/catalog" className="tactical-btn" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                        Acceder al Catálogo
                    </Link>
                    <Link to="/comparator" className="tactical-btn" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: 'transparent', border: '1px solid var(--tactical-border)' }}>
                        Comparador (Montara)
                    </Link>
                </div>
            </div>
        </div>
    );
};