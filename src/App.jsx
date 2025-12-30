import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SplashScreen from './components/common/SplashScreen'
import ScrollToTop from './components/common/ScrollToTop'
import { useAuth } from './context/AuthContext'

// Pages
import Home from './pages/shop/Home'
import Products from './pages/shop/ProductList'
import ProductDetail from './pages/shop/ProductDetail'
import Cart from './pages/shop/Cart'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import Profile from './pages/shop/Profile'
import Wishlist from './pages/shop/Wishlist'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user && isAdmin ? children : <Navigate to="/" />
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Splash Screen - Shows on top */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <ScrollToTop />

      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10"><Products /></div>} />
          <Route path="/products/:id" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10"><ProductDetail /></div>} />
          <Route path="/cart" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10"><Cart /></div>} />
          <Route path="/wishlist" element={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10"><Wishlist /></div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-10"><Profile /></div></PrivateRoute>} />

          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
