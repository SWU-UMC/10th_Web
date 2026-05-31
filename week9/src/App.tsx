import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import Modal from './components/Modal';

export default function App() {
  const { cartItems, calculateTotals, isModalOpen } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      <CartList />
      {isModalOpen && <Modal />}
    </div>
  );
}