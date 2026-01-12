import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import FoodCard from '../components/FoodCard.jsx'

/**
 * Pagina care afișează alimentele care expiră curând (în următoarele 3 zile).
 * Grupează alimentele în "Expiră astăzi" și "Expiră în 3 zile".
 */
function ExpiringFoods() {
    const [foods, setFoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchExpiringFoods()
    }, [])

    /**
     * Încarcă alimentele care expiră curând din API.
     */
    const fetchExpiringFoods = async () => {
        try {
            const response = await api.get('/foods/expiring')
            setFoods(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching expiring foods:', err)
            setError('Eroare la încărcarea alimentelor care expiră')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Actualizează statusul.
     */
    const handleStatusUpdate = async (foodId, newStatus) => {
        try {
            await api.put(`/foods/${foodId}/status`, { status: newStatus })
            setFoods(foods.map(f => f.id === foodId ? { ...f, status: newStatus } : f))
            setSuccess('Status actualizat cu succes!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error updating status:', err)
            setError(err.response?.data?.error || 'Eroare la actualizarea statusului')
        }
    }

    /**
     * Șterge un aliment.
     */
    const handleDelete = async (foodId) => {
        try {
            await api.delete(`/foods/${foodId}`)
            setFoods(foods.filter(f => f.id !== foodId))
            setSuccess('Aliment șters cu succes!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error deleting food:', err)
            setError(err.response?.data?.error || 'Eroare la ștergerea alimentului')
        }
    }

    /**
     * Filtrează alimentele care expiră astăzi.
     */
    const getTodayExpiring = () => {
        const today = new Date()
        return foods.filter(food => {
            const expDate = new Date(food.expirationDate)
            const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))
            return diffDays === 0
        })
    }

    /**
     * Filtrează alimentele care expiră în următoarele 3 zile (exclusiv astăzi).
     */
    const getThreeDaysExpiring = () => {
        const today = new Date()
        return foods.filter(food => {
            const expDate = new Date(food.expirationDate)
            const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24))
            return diffDays > 0 && diffDays <= 3
        })
    }

    if (loading) {
        return <div className="loading">Se încarcă...</div>
    }

    const todayExpiring = getTodayExpiring()
    const threeDaysExpiring = getThreeDaysExpiring()

    return (
        <div className="expiring-page">
            <div className="page-header">
                <h1>⚠️ Alerte Expirare</h1>
                <Link to="/dashboard" className="btn-secondary">← Înapoi la Dashboard</Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {foods.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Nu ai alimente care expiră în următoarele 3 zile!</p>
                    <Link to="/dashboard" className="btn-primary">Vezi toate alimentele</Link>
                </div>
            ) : (
                <>
                    {todayExpiring.length > 0 && (
                        <div className="alert-section critical">
                            <h2>🚨 Expiră ASTĂZI ({todayExpiring.length})</h2>
                            <div className="foods-grid">
                                {todayExpiring.map((food) => (
                                    <FoodCard
                                        key={food.id}
                                        food={food}
                                        showActions={true}
                                        onDelete={handleDelete}
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {threeDaysExpiring.length > 0 && (
                        <div className="alert-section warning">
                            <h2>⚠️ Expiră în următoarele 3 zile ({threeDaysExpiring.length})</h2>
                            <div className="foods-grid">
                                {threeDaysExpiring.map((food) => (
                                    <FoodCard
                                        key={food.id}
                                        food={food}
                                        showActions={true}
                                        onDelete={handleDelete}
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ExpiringFoods
