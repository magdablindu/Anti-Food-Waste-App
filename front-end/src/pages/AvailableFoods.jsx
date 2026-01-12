import { useState, useEffect } from 'react'
import api from '../services/api.js'
import FoodCard from '../components/FoodCard.jsx'

/**
 * Pagina care afișează toate alimentele disponibile pentru revendicare.
 */
function AvailableFoods() {
    const [foods, setFoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchAvailableFoods()
    }, [])

    /**
     * Încarcă lista de alimente disponibile de la API.
     */
    const fetchAvailableFoods = async () => {
        try {
            const response = await api.get('/foods/available')
            setFoods(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching available foods:', err)
            setError('Eroare la încărcarea alimentelor disponibile')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Gestionează revendicarea unui aliment.
     * @param {number} foodId - ID-ul alimentului care se revendică.
     */
    const handleClaim = async (foodId) => {
        try {
            await api.post(`/claims/${foodId}`)
            setSuccess('Cererea de revendicare a fost trimisă!')
            setError('')
            fetchAvailableFoods()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error claiming food:', err)
            setError(err.response?.data?.error || 'Eroare la revendicare')
        }
    }

    if (loading) {
        return <div className="loading">Se încarcă...</div>
    }

    return (
        <div className="available-page">
            <div className="page-header">
                <h1>🛒 Alimente disponibile</h1>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {foods.length === 0 ? (
                <div className="empty-state">
                    <p>Nu sunt alimente disponibile momentan.</p>
                    <p>Revino mai târziu!</p>
                </div>
            ) : (
                <div className="foods-grid">
                    {foods.map((food) => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            showClaim={true}
                            showShare={true}
                            onClaim={handleClaim}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AvailableFoods
