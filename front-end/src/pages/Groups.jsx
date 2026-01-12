import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru vizualizarea grupurilor din care face parte utilizatorul.
 */
function Groups() {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMyGroups()
    }, [])

    /**
     * Încarcă lista de grupuri ale utilizatorului.
     */
    const fetchMyGroups = async () => {
        try {
            const response = await api.get('/groups/mine')
            setGroups(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching groups:', err)
            setError('Eroare la încărcarea grupurilor')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Se încarcă...</div>
    }

    return (
        <div className="groups-page">
            <div className="page-header">
                <h1>👥 Grupurile mele</h1>
                <Link to="/create-group" className="btn-primary">+ Creează grup</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            {groups.length === 0 ? (
                <div className="empty-state">
                    <p>Nu faci parte din niciun grup încă.</p>
                    <Link to="/create-group" className="btn-primary">Creează primul tău grup</Link>
                </div>
            ) : (
                <div className="groups-grid">
                    {groups.map((groupMember) => (
                        <div key={groupMember.id} className="group-card">
                            <div className="group-header">
                                <h3>{groupMember.group.name}</h3>
                                <span className="group-type">{groupMember.group.type}</span>
                            </div>
                            <div className="group-details">
                                <p><strong>ID Grup:</strong> {groupMember.group.id}</p>
                                <p><strong>Creat de:</strong> Utilizator #{groupMember.group.createdById}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Groups
