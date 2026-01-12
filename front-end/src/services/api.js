import axios from 'axios'

// Configurare API - backend rulează pe portul 4000
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Adaugă token-ul la fiecare cerere (Intercepetor Request)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Gestionează erorile 401 (neautorizat) (Interceptor Response)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
