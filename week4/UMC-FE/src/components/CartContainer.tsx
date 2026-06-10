import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { calculateTotals } from '../features/cart/cartSlice';
import { openModal } from '../features/modal/modalSlice'; 
import CartItem from './CartItem';
import Modal from './Modal'; 

const CartContainer = () => {
  const dispatch = useDispatch();
  const { cartItems, total, amount } = useSelector((state: RootState) => state.cart);
  const { isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (amount === 0) {
    return (
      <section className="min-h-screen py-16 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 uppercase text-center">당신의 장바구니</h2>
        <h4 className="text-gray-500 text-xl">장바구니가 비어있습니다.</h4>
      </section>
    );
  }

  return (
    <>
      {isOpen && <Modal />}

      <section className="min-h-screen py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-wider">당신의 장바구니</h2>
        
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </div>
        
        <footer className="mt-10 border-t-2 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold">총 금액</h4>
            <h4 className="text-xl font-bold text-blue-600">{total.toLocaleString()}원</h4>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-lg font-medium text-gray-700">총 수량</h4>
            <h4 className="text-lg font-medium text-gray-700">{amount}개</h4>
          </div>
          
          <button
            className="w-full bg-red-100 text-red-600 border border-red-600 rounded py-2 px-4 hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest"
            onClick={() => dispatch(openModal())}
          >
            장바구니 비우기
          </button>
        </footer>
      </section>
    </>
  );
};

export default CartContainer;