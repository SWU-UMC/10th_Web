import { useCartStore } from '../store/useCartStore';
import CartItemCard from './CartItemCard';
import { type CartItemType } from '../constants/cartItems';

export default function CartList() {
  const { cartItems, total, openModal } = useCartStore();

  if (cartItems.length === 0) {
    return (
      <div className="text-center my-32 font-sans">
        <h3 className="text-xl font-bold text-gray-400">장바구니가 텅 비었습니다.</h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6 flex flex-col items-center font-sans">
      <div className="w-full bg-white rounded-md">
        {cartItems.map((item: CartItemType) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="w-full mt-10 pt-6 border-t border-gray-200 flex flex-col items-center">
        <div className="w-full flex justify-between items-center text-lg font-bold text-gray-950 mb-10 px-4">
          <span>총 가격</span>
          <span>${total.toLocaleString()}</span>
        </div>
        
        <button
          onClick={openModal}
          className="px-7 py-2 border border-gray-900 rounded-md text-sm font-semibold text-gray-900 bg-white hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}