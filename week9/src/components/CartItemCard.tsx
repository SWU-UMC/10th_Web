import { type CartItemType } from '../constants/cartItems';
import { useCartStore } from '../store/useCartStore';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemProps) {
  const { increase, decrease } = useCartStore();

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 max-w-4xl w-full mx-auto bg-white px-4 font-sans">
      <div className="flex items-center gap-6 flex-1">
        <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded shadow-sm flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-base font-bold text-gray-900 line-clamp-1 leading-snug">{item.title}</span>
          <span className="text-xs text-gray-500 mt-1">{item.singer}</span>
          <span className="text-sm font-extrabold text-gray-800 mt-2">${item.price}</span>
        </div>
      </div>

      <div className="flex items-center bg-[#e2e8f0] rounded border border-gray-300 overflow-hidden shadow-sm mr-2">
        <button 
          onClick={() => decrease(item.id)} 
          className="px-3 py-1 text-gray-600 hover:bg-gray-300 font-bold text-base transition-colors cursor-pointer"
        >
          -
        </button>
        <span className="px-4 text-sm font-semibold text-gray-900 bg-white py-1.5 border-x border-gray-300 min-w-[32px] text-center">
          {item.amount}
        </span>
        <button 
          onClick={() => increase(item.id)} 
          className="px-3 py-1 text-gray-600 hover:bg-gray-300 font-bold text-base transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}