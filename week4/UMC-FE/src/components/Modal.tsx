import { useDispatch } from 'react-redux';
import { closeModal } from '../features/modal/modalSlice';
import { clearCart } from '../features/cart/cartSlice';

const Modal = () => {
  const dispatch = useDispatch();

  return (
    <aside className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-80 text-center">
        <h4 className="text-lg font-bold mb-8">
          장바구니의 모든 상품을<br/>삭제하시겠습니까?
        </h4>
        
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold"
            onClick={() => {
              dispatch(clearCart());
              dispatch(closeModal());
            }}
          >
            네
          </button>
          
          <button
            type="button"
            className="bg-red-100 text-red-600 border border-red-600 px-6 py-2 rounded hover:bg-red-600 hover:text-white font-bold"
            onClick={() => {
              dispatch(closeModal());
            }}
          >
            아니요
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;