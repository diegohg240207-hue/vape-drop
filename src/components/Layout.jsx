import Navbar from './Navbar'
import CartDrawer from './CartDrawer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <CartDrawer />
    </>
  )
}
