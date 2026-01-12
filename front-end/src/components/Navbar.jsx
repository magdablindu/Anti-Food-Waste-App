import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Componenta de navigare a aplicației.
 * Afișează link-uri diferite în funcție de starea de autentificare a utilizatorului.
 */
function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    /**
     * Gestionează delogarea utilizatorului.
     * Apelează funcția logout din context și redirecționează către pagina de login.
     */
    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🥗 Food Waste App</Link>
            </div>

            <div className="navbar-menu">
                {user ? (
                    <>
                        <Link to="/dashboard" className="nav-link">📦 Alimentele mele</Link>
                        <Link to="/add-food" className="nav-link">➕ Adaugă</Link>
                        <Link to="/available" className="nav-link">🛒 Disponibile</Link>
                        <Link to="/expiring" className="nav-link">⚠️ Alerte</Link>
                        <div className="nav-dropdown">
                            <span className="nav-link">📋 Claims</span>
                            <div className="dropdown-content">
                                <Link to="/my-claims">Cererile mele</Link>
                                <Link to="/received-claims">Cereri primite</Link>
                            </div>
                        </div>
                        <Link to="/groups" className="nav-link">👥 Grupuri</Link>
                        <Link to="/profile" className="nav-link">👤 Profil</Link>
                        <span className="nav-user">Salut, {user.name}!</span>
                        <button onClick={handleLogout} className="btn-logout">Ieși</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Autentificare</Link>
                        <Link to="/register" className="nav-link">Înregistrare</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
