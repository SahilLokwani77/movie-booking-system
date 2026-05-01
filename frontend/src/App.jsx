import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import BookingConfirmation from './pages/BookingConfirmation'

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-red-500">CineTix</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-400 transition-colors">Login</Link>
              <Link to="/register" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <main className="container mx-auto p-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/show/:showId/seats" element={<SeatSelection />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
