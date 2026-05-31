import { FaShoppingCart } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="flex justify-between items-center px-16 py-4 bg-[#1e293b] text-white shadow-md sticky top-0 z-50 font-sans">
      <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => window.location.reload()}>
        Ohtani Ahn
      </h1>
      <div className="flex items-center gap-3">
        <FaShoppingCart className="text-xl" />
        <span className="text-lg font-bold min-w-[20px] text-center">{amount}</span>
      </div>
    </nav>
  );
}