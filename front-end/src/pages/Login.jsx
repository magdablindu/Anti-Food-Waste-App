import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Pagina de autentificare.
 * Permite utilizatorilor existenți să se logheze în aplicație.
 */
function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    /**
     * Gestionează procesul de autentificare.
     * @param {Event} e - Evenimentul de submit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            console.error('Login error:', err)
            setError(err.response?.data?.error || 'Eroare la autentificare. Verifică conexiunea la server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>🔐 Autentificare</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplu.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Parola ta"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Se procesează...' : 'Conectează-te'}
                    </button>
                </form>

                <p className="auth-footer">
                    Nu ai cont? <Link to="/register">Înregistrează-te</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
