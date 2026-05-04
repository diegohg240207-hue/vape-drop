import Navbar from './Navbar'
import CartDrawer from './CartDrawer'
import BottomNav from './BottomNav'
import TickerBanner from './TickerBanner'

export default function Layout({ children }) {
  return (
    <div className="app-wrapper">
      <TickerBanner />
      <Navbar />
      <main className="page-content">{children}</main>
      <CartDrawer />
      <BottomNav />
    </div>
  )
}
