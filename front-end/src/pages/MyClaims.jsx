import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru vizualizarea cererilor de revendicare trimise de utilizator.
 */
function MyClaims() {
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMyClaims()
    }, [])

    /**
     * Încarcă lista de cereri ale utilizatorului.
     */
    const fetchMyClaims = async () => {
        try {
            const response = await api.get('/claims/mine')
            setClaims(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching claims:', err)
            setError('Eroare la încărcarea cererilor')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Returnează un badge cu statusul cererii (îN AȘTEPTARE, APROBAT, RESPINS).
     * @param {string} status - Statusul cererii.
     */
    const getStatusBadge = (status) => {
        const badges = {
            'IN ASTEPTARE': { icon: '⏳', class: 'pending' },
            'APROBAT': { icon: '✅', class: 'approved' },
            'RESPINS': { icon: '❌', class: 'rejected' }
        }
        const badge = badges[status] || { icon: '❓', class: 'unknown' }
        return <span className={`claim-status ${badge.class}`}>{badge.icon} {status}</span>
    }

    if (loading) {
        return <div className="loading">Se încarcă...</div>
    }

    return (
        <div className="claims-page">
            <div className="page-header">
                <h1>📋 Cererile mele</h1>
                <Link to="/available" className="btn-primary">Vezi alimente disponibile</Link>
            </div>

            {error && <div className="error-message">{error}</div>}

            {claims.length === 0 ? (
                <div className="empty-state">
                    <p>Nu ai făcut nicio cerere încă.</p>
                    <Link to="/available" className="btn-primary">Explorează alimente disponibile</Link>
                </div>
            ) : (
                <div className="claims-list">
                    {claims.map((claim) => (
                        <div key={claim.id} className="claim-card">
                            <div className="claim-header">
                                <h3>{claim.food.name}</h3>
                                {getStatusBadge(claim.status)}
                            </div>
                            <div className="claim-details">
                                <p><strong>Categorie:</strong> {claim.food.category}</p>
                                <p><strong>Cantitate:</strong> {claim.food.quantity}</p>
                                <p><strong>Expiră:</strong> {new Date(claim.food.expirationDate).toLocaleDateString('ro-RO')}</p>
                                <p><strong>Cerere trimisă:</strong> {new Date(claim.requestedAt).toLocaleDateString('ro-RO')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyClaims
