import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru adăugarea unui aliment nou.
 * Permite utilizatorului să introducă detalii despre aliment și să-l salveze.
 */
function AddFood() {
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [expirationDate, setExpirationDate] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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

    /**
     * Gestionează trimiterea formularului.
     * Trimite datele alimentului către API.
     * @param {Event} e - Evenimentul de submit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/foods/add', {
                name,
                category,
                quantity: Number(quantity),
                expirationDate: new Date(expirationDate).toISOString()
            })
            navigate('/dashboard')
        } catch (err) {
            console.error('Error adding food:', err)
            setError(err.response?.data?.error || 'Eroare la adăugarea alimentului')
        } finally {
            setLoading(false)
        }
    }

    // Data minimă este astăzi
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="add-food-page">
            <div className="form-card">
                <h1>🍽️ Adaugă aliment</h1>

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
                            {loading ? 'Se adaugă...' : 'Adaugă'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddFood
