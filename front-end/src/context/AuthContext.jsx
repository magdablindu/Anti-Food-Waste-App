import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)

/**
 * Provider pentru contextul de autentificare.
 * Gestionează starea utilizatorului (login, register, logout).
 * @param {Object} props.children - Componentele copil care vor avea acces la context.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Verifică authenticated la montarea componentei
    useEffect(() => {
        checkAuth()
    }, [])

    /**
     * Verifică dacă există un token valid și încarcă datele utilizatorului.
     */
    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await api.get('/auth/me')
                setUser(response.data)
            } catch (error) {
                console.error('Auth check failed:', error)
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }

    /**
     * Autentifică utilizatorul.
     * @param {string} email - Email-ul utilizatorului.
     * @param {string} password - Parola utilizatorului.
     */
    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', response.data.token)
        await checkAuth()
        return response.data
    }

    /**
     * Înregistrează un nou utilizator.
     * @param {string} name - Numele utilizatorului.
     * @param {string} email - Email-ul utilizatorului.
     * @param {string} password - Parola utilizatorului.
     */
    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password })
        return response.data
    }

    /**
     * Deconectează utilizatorul.
     * Șterge token-ul și resetează starea utilizatorului.
     */
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Se încarcă...
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook custom pentru utilizarea contextului de autentificare.
 * @returns {Object} Contextul de autentificare (user, login, register, logout).
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
