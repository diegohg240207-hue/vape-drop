import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import SplashScreen from './screens/SplashScreen'
import Home from './screens/Home'
import Catalog from './screens/Catalog'
import Cart from './screens/Cart'
import Checkout from './screens/Checkout'
import Confirmation from './screens/Confirmation'
import Admin from './screens/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#12122a',
            color: '#e8e8f5',
            border: '1px solid rgba(139,92,246,0.3)',
            fontFamily: "'Outfit', sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home"    element={<Layout><Home /></Layout>} />
        <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
        <Route path="/cart"    element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/confirmation/:orderId" element={<Layout><Confirmation /></Layout>} />
        <Route path="/admin"   element={<Admin />} />
        <Route path="*"        element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
