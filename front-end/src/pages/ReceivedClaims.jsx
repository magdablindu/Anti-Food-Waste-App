import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

/**
 * Pagina pentru vizualizarea cererilor primite pentru alimentele utilizatorului.
 * Permite aprobarea sau respingerea cererilor.
 */
function ReceivedClaims() {
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchReceivedClaims()
    }, [])

    /**
     * Încarcă cererile primite.
     */
    const fetchReceivedClaims = async () => {
        try {
            const response = await api.get('/claims/received')
            setClaims(response.data)
            setError('')
        } catch (err) {
            console.error('Error fetching received claims:', err)
            setError('Eroare la încărcarea cererilor primite')
        } finally {
            setLoading(false)
        }
    }

    /**
     * Aprobă o cerere.
     * @param {number} claimId - ID-ul cererii.
     */
    const handleApprove = async (claimId) => {
        try {
            await api.put(`/claims/${claimId}/approve`)
            setClaims(claims.map(c => c.id === claimId ? { ...c, status: 'APROBAT' } : c))
            setSuccess('Cerere aprobată cu succes!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error approving claim:', err)
            setError(err.response?.data?.error || 'Eroare la aprobarea cererii')
        }
    }

    /**
     * Respinge o cerere.
     * @param {number} claimId - ID-ul cererii.
     */
    const handleReject = async (claimId) => {
        try {
            await api.put(`/claims/${claimId}/reject`)
            setClaims(claims.map(c => c.id === claimId ? { ...c, status: 'RESPINS' } : c))
            setSuccess('Cerere respinsă!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error rejecting claim:', err)
            setError(err.response?.data?.error || 'Eroare la respingerea cererii')
        }
    }

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
                <h1>📬 Cereri primite</h1>
                <Link to="/dashboard" className="btn-secondary">← Înapoi</Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {claims.length === 0 ? (
                <div className="empty-state">
                    <p>Nu ai primit nicio cerere încă.</p>
                    <Link to="/dashboard" className="btn-primary">Vezi alimentele tale</Link>
                </div>
            ) : (
                <div className="claims-list">
                    {claims.map((claim) => (
                        <div key={claim.id} className="claim-card received">
                            <div className="claim-header">
                                <h3>{claim.food.name}</h3>
                                {getStatusBadge(claim.status)}
                            </div>
                            <div className="claim-details">
                                <p><strong>Solicitat de:</strong> {claim.requestedBy.name} ({claim.requestedBy.email})</p>
                                <p><strong>Categorie:</strong> {claim.food.category}</p>
                                <p><strong>Cantitate:</strong> {claim.food.quantity}</p>
                                <p><strong>Expiră:</strong> {new Date(claim.food.expirationDate).toLocaleDateString('ro-RO')}</p>
                                <p><strong>Cerere trimisă:</strong> {new Date(claim.requestedAt).toLocaleDateString('ro-RO')}</p>
                            </div>

                            {claim.status === 'IN ASTEPTARE' && (
                                <div className="claim-actions">
                                    <button onClick={() => handleApprove(claim.id)} className="btn-approve">
                                        ✅ Aprobă
                                    </button>
                                    <button onClick={() => handleReject(claim.id)} className="btn-reject">
                                        ❌ Respinge
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReceivedClaims
