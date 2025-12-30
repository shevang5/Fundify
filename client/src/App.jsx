import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateCampaign from './pages/CreateCampaign'
import AdminDashboard from './pages/AdminDashboard'
import CampaignDetails from './components/CampaignDetails'

const App = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="font-sans antialiased text-gray-900">
      <Navbar />
      <Routes>
        <Route
          path="/admin"
          element={user?.isAdmin ? <AdminDashboard /> : <Home />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaign/:id" element={<CampaignDetails />} />

        {/* Protected Route */}
        <Route
          path="/create"
          element={user ? <CreateCampaign /> : <Login />}
        />
      </Routes>
    </div>
  )
}

export default App