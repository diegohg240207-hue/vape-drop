import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import SplashScreen from './screens/SplashScreen'
import HomeScreen from './screens/HomeScreen'
import CatalogScreen from './screens/CatalogScreen'
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import AdminScreen from './screens/AdminScreen'

export default function App() {
  return (
    <CartProvider>
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
          <Route path="/"               element={<SplashScreen />} />
          <Route path="/home"           element={<HomeScreen />} />
          <Route path="/catalog"        element={<CatalogScreen />} />
          <Route path="/cart"           element={<CartScreen />} />
          <Route path="/checkout"       element={<CheckoutScreen />} />
          <Route path="/confirmation/:orderNum" element={<ConfirmationScreen />} />
          <Route path="/admin"          element={<AdminScreen />} />
          <Route path="*"               element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
