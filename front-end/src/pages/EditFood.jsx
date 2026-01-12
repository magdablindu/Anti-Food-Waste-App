import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru editarea unui aliment existent.
 * Încarcă datele alimentului și permite modificarea acestora.
 */
function EditFood() {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [expirationDate, setExpirationDate] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingFood, setLoadingFood] = useState(true)

    const navigate = useNavigate()
    const { id } = useParams()

    const categories = [
        'Fructe',
        'Legume',
        'Lactate',
        'Carne',
        'Pește',
        'Băuturi',
        'Conserve',
        'Panificație',
        'Altele'
    ]

    useEffect(() => {
        fetchFood()
    }, [id])

    /**
     * Încarcă detaliile alimentului de la API.
     */
    const fetchFood = async () => {
        try {
            const response = await api.get('/foods/mine')
            const food = response.data.find(f => f.id === Number(id))

            if (!food) {
                setError('Alimentul nu a fost găsit')
                return
            }

            setName(food.name)
            setCategory(food.category)
            setQuantity(food.quantity)
            setExpirationDate(new Date(food.expirationDate).toISOString().split('T')[0])
        } catch (err) {
            console.error('Error fetching food:', err)
            setError('Eroare la încărcarea alimentului')
        } finally {
            setLoadingFood(false)
        }
    }

    /**
     * Salvează modificările alimentului.
     * @param {Event} e - Evenimentul de submit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.put(`/foods/${id}`, {
                name,
                category,
                quantity: Number(quantity),
                expirationDate: new Date(expirationDate).toISOString()
            })
            navigate('/dashboard')
        } catch (err) {
            console.error('Error updating food:', err)
            setError(err.response?.data?.error || 'Eroare la actualizarea alimentului')
        } finally {
            setLoading(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]

    if (loadingFood) {
        return <div className="loading">Se încarcă...</div>
    }

    return (
        <div className="add-food-page">
            <div className="form-card">
                <h1>✏️ Editează aliment</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nume aliment</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Lapte, Mere, Pâine"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Categorie</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Selectează categoria</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Cantitate</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="expirationDate">Data expirării</label>
                        <input
                            type="date"
                            id="expirationDate"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            min={today}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                            Anulează
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Se actualizează...' : 'Salvează'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditFood
