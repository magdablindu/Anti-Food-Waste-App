import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru crearea unui grup nou.
 * Permite utilizatorului să definească numele și tipul grupului.
 */
function CreateGroup() {
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const groupTypes = [
        'Vegetarieni',
        'Vegani',
        'Carnivori',
        'Fără gluten',
        'Fără lactoză',
        'Familie',
        'Prieteni',
        'Vecini',
        'Altele'
    ]

    /**
     * Gestionează crearea grupului.
     * Trimite datele către API și redirecționează utilizatorul.
     * @param {Event} e - Evenimentul de submit.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await api.post('/groups/create', { name, type })
            navigate('/groups')
        } catch (err) {
            console.error('Error creating group:', err)
            setError(err.response?.data?.error || 'Eroare la crearea grupului')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="add-food-page">
            <div className="form-card">
                <h1>👥 Creează grup nou</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nume grup</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Prieteni Vegetarieni, Familie, Vecini"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Tip grup</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">Selectează tipul</option>
                            {groupTypes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/groups')}>
                            Anulează
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Se creează...' : 'Creează grup'}
                        </button>
                    </div>
                </form>

                <div className="info-box">
                    <p><strong>💡 Sfat:</strong> După crearea grupului, poți invita membri folosând ID-ul lor de utilizator.</p>
                </div>
            </div>
        </div>
    )
}

export default CreateGroup
