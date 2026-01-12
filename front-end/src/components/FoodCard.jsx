import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'
import ShareButtons from './ShareButtons.jsx'

/**
 * Componenta pentru afișarea detaliilor unui aliment.
 * Include opțiuni pentru revendicare, editare, ștergere și partajare.
 * @param {Object} props - Proprietățile componentei.
 * @param {Object} props.food - Obiectul aliment cu detalii (nume, categorie, etc.).
 * @param {Function} props.onClaim - Funcție apelată la revendicare.
 * @param {boolean} props.showClaim - Arată butonul de revendicare.
 * @param {boolean} props.showActions - Arată butoanele de acțiune (edit/delete/status).
 * @param {Function} props.onDelete - Funcție apelată la ștergere.
 * @param {Function} props.onStatusUpdate - Funcție apelată la actualizare status.
 * @param {boolean} props.showShare - Arată butoanele de share.
 */
function FoodCard({ food, onClaim, showClaim = false, showActions = false, onDelete, onStatusUpdate, showShare = false }) {
    const navigate = useNavigate()
    const expirationDate = new Date(food.expirationDate).toLocaleDateString('ro-RO')

    const daysLeft = Math.ceil(
        (new Date(food.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
    )

    const isExpiringSoon = daysLeft <= 3 && daysLeft > 0
    const isExpired = daysLeft <= 0

    let cardClass = 'food-card'
    if (isExpired) cardClass += ' expired'
    else if (isExpiringSoon) cardClass += ' expiring-soon'

    const handleEdit = () => {
        navigate(`/edit-food/${food.id}`)
    }

    const handleDelete = async () => {
        if (window.confirm('Ești sigur că vrei să ștergi acest aliment?')) {
            if (onDelete) {
                onDelete(food.id)
            }
        }
    }

    const handleStatusChange = async (newStatus) => {
        if (onStatusUpdate) {
            onStatusUpdate(food.id, newStatus)
        }
    }

    return (
        <div className={cardClass}>
            <div className="food-header">
                <h3>{food.name}</h3>
                <span className={`status status-${food.status.toLowerCase().replace(' ', '-')}`}>
                    {food.status}
                </span>
            </div>

            <div className="food-details">
                <p><strong>Categorie:</strong> {food.category}</p>
                <p><strong>Cantitate:</strong> {food.quantity}</p>
                <p><strong>Expiră:</strong> {expirationDate}</p>

                {isExpiringSoon && !isExpired && (
                    <p className="warning">⚠️ Expiră în {daysLeft} zile!</p>
                )}
                {isExpired && (
                    <p className="error">❌ Expirat!</p>
                )}
            </div>

            {showClaim && food.status === 'DISPONIBIL' && !isExpired && (
                <button onClick={() => onClaim(food.id)} className="btn-claim">
                    Revendică
                </button>
            )}

            {showShare && food.status === 'DISPONIBIL' && !isExpired && (
                <ShareButtons food={food} />
            )}

            {showActions && (
                <div className="food-actions">
                    <button onClick={handleEdit} className="btn-edit">
                        ✏️ Editează
                    </button>
                    <button onClick={handleDelete} className="btn-delete">
                        🗑️ Șterge
                    </button>

                    {food.status === 'DISPONIBIL' && !isExpired && (
                        <button onClick={() => handleStatusChange('CONSUMAT')} className="btn-status">
                            ✅ Marchează consumat
                        </button>
                    )}

                    {food.status === 'CONSUMAT' && !isExpired && (
                        <button onClick={() => handleStatusChange('DISPONIBIL')} className="btn-status">
                            🔄 Marchează disponibil
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default FoodCard
