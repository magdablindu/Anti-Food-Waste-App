import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Pagina de înregistrare.
 * Permite utilizatorilor noi să își creeze un cont.
 */
function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    /**
     * Gestionează procesul de înregistrare.
     * @param {Event} e - Evenimentul de submit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            await register(name, email, password)
            setSuccess('Cont creat cu succes! Te redirecționăm...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            console.error('Register error:', err)
            setError(err.response?.data?.error || 'Eroare la înregistrare. Verifică conexiunea la server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>📝 Înregistrare</h1>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nume</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Numele tău"
                            required
                        />
                    </div>

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
                            placeholder="Minim 6 caractere"
                            minLength={6}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Se procesează...' : 'Creează cont'}
                    </button>
                </form>

                <p className="auth-footer">
                    Ai deja cont? <Link to="/login">Conectează-te</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
