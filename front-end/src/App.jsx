import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddFood from './pages/AddFood.jsx'
import EditFood from './pages/EditFood.jsx'
import AvailableFoods from './pages/AvailableFoods.jsx'
import ExpiringFoods from './pages/ExpiringFoods.jsx'
import MyClaims from './pages/MyClaims.jsx'
import ReceivedClaims from './pages/ReceivedClaims.jsx'
import Groups from './pages/Groups.jsx'
import CreateGroup from './pages/CreateGroup.jsx'
import Profile from './pages/Profile.jsx'

/**
 * Componenta principală a aplicației.
 * Gestionează rutarea și protejarea rutelor în funcție de starea de autentificare.
 */
function App() {
    const { user } = useAuth()

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/add-food" element={user ? <AddFood /> : <Navigate to="/login" />} />
                    <Route path="/edit-food/:id" element={user ? <EditFood /> : <Navigate to="/login" />} />
                    <Route path="/available" element={user ? <AvailableFoods /> : <Navigate to="/login" />} />
                    <Route path="/expiring" element={user ? <ExpiringFoods /> : <Navigate to="/login" />} />
                    <Route path="/my-claims" element={user ? <MyClaims /> : <Navigate to="/login" />} />
                    <Route path="/received-claims" element={user ? <ReceivedClaims /> : <Navigate to="/login" />} />
                    <Route path="/groups" element={user ? <Groups /> : <Navigate to="/login" />} />
                    <Route path="/create-group" element={user ? <CreateGroup /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
