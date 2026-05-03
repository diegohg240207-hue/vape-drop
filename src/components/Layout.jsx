import Navbar from './Navbar'
import CartDrawer from './CartDrawer'
import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-main">{children}</main>
      <CartDrawer />
      <div className="bottom-nav-wrapper"><BottomNav /></div>
    </>
  )
}
