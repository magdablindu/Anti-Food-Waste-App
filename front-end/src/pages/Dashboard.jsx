import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import FoodCard from '../components/FoodCard.jsx'

/**
 * Pagina principală a aplicației (Dashboard).
 * Afișează lista alimentelor utilizatorului, cu opțiuni de filtrare și gestionare.
 */
function Dashboard() {
    const [foods, setFoods] = useState([])
    const [filteredFoods, setFilteredFoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')

    const categories = ['Toate', 'Fructe', 'Legume', 'Lactate', 'Carne', 'Pește', 'Băuturi', 'Conserve', 'Panificație', 'Altele']

    useEffect(() => {
        fetchMyFoods()
    }, [])

    useEffect(() => {
        filterFoods()
    }, [foods, searchTerm, selectedCategory])

    /**
     * Încarcă lista de alimente ale utilizatorului.
     */
    const fetchMyFoods = async () => {
        try {
            const response = await api.get('/foods/mine')
            setFoods(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching foods:', err)
            setError('Eroare la încărcarea alimentelor')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Filtrează lista de alimente pe baza termenului de căutare și a categoriei selectate.
     */
    const filterFoods = () => {
        let filtered = foods

        if (searchTerm) {
            filtered = filtered.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory && selectedCategory !== 'Toate') {
            filtered = filtered.filter(food => food.category === selectedCategory)
        }

        setFilteredFoods(filtered)
    }

    /**
     * Șterge un aliment.
     * @param {number} foodId - ID-ul alimentului de șters.
     */
    const handleDelete = async (foodId) => {
        try {
            await api.delete(`/foods/${foodId}`)
            setFoods(foods.filter(f => f.id !== foodId))
        } catch (err) {
            console.error('Error deleting food:', err)
            setError(err.response?.data?.error || 'Eroare la ștergerea alimentului')
        }
    }

    /**
     * Actualizează statusul unui aliment.
     * @param {number} foodId - ID-ul alimentului.
     * @param {string} newStatus - Noul status (ex: 'CONSUMAT', 'DISPONIBIL').
     */
    const handleStatusUpdate = async (foodId, newStatus) => {
        try {
            await api.put(`/foods/${foodId}/status`, { status: newStatus })
            setFoods(foods.map(f => f.id === foodId ? { ...f, status: newStatus } : f))
        } catch (err) {
            console.error('Error updating status:', err)
            setError(err.response?.data?.error || 'Eroare la actualizarea statusului')
        }
    }

    if (loading) {
        return <div className="loading">Se încarcă...</div>
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>🍎 Alimentele mele</h1>
                <Link to="/add-food" className="btn-primary">+ Adaugă aliment</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="🔍 Caută după nume..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-filter"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {filteredFoods.length === 0 ? (
                <div className="empty-state">
                    {foods.length === 0 ? (
                        <>
                            <p>Nu ai niciun aliment adăugat.</p>
                            <Link to="/add-food" className="btn-primary">Adaugă primul tău aliment</Link>
                        </>
                    ) : (
                        <p>Nu s-au găsit alimente cu criteriile selectate.</p>
                    )}
                </div>
            ) : (
                <div className="foods-grid">
                    {filteredFoods.map((food) => (
                        <FoodCard
                            key={food.id}
                            food={food}
                            showActions={true}
                            showShare={true}
                            onDelete={handleDelete}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard
