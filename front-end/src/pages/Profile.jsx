import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

/**
 * Pagina de profil a utilizatorului.
 * Afișează informații personale și grupurile din care face parte.
 */
function Profile() {
    const { user } = useAuth()
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchUserGroups()
    }, [])

    /**
     * Încarcă grupurile utilizatorului.
     */
    const fetchUserGroups = async () => {
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

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>👤 Profilul meu</h1>
                <Link to="/dashboard" className="btn-secondary">← Înapoi</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="profile-content">
                <div className="profile-card">
                    <h2>Informații personale</h2>
                    <div className="profile-info">
                        <div className="info-row">
                            <strong>Nume:</strong>
                            <span>{user?.name || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <strong>Email:</strong>
                            <span>{user?.email || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <strong>Rol:</strong>
                            <span className="role-badge">{user?.role || 'user'}</span>
                        </div>
                        <div className="info-row">
                            <strong>ID Utilizator:</strong>
                            <span>{user?.id || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card">
                    <div className="card-header">
                        <h2>Grupurile mele</h2>
                        <Link to="/groups" className="btn-small">Vezi toate</Link>
                    </div>
                    {loading ? (
                        <p>Se încarcă...</p>
                    ) : groups.length === 0 ? (
                        <div className="empty-state-small">
                            <p>Nu faci parte din niciun grup.</p>
                            <Link to="/create-group" className="btn-primary">Creează un grup</Link>
                        </div>
                    ) : (
                        <div className="groups-list-small">
                            {groups.slice(0, 3).map((groupMember) => (
                                <div key={groupMember.id} className="group-item">
                                    <span className="group-name">{groupMember.group.name}</span>
                                    <span className="group-type-small">{groupMember.group.type}</span>
                                </div>
                            ))}
                            {groups.length > 3 && (
                                <Link to="/groups" className="view-more">
                                    +{groups.length - 3} mai multe grupuri
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
