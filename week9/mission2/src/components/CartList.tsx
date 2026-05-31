import CartItems from "../components/CartItems";
import { useSelector } from "../hooks/useCustomRedux";
import { useDispatch } from "react-redux";
import { openModal } from "../store/slices/modalSlice";
import Modal from "../components/modal";

const CartList = () => {
  const dispatch = useDispatch();
  const modalClick = () => {
  dispatch(openModal());
};
const isOpen = useSelector(
  (state) => state.modal.isOpen
);
  //useSelector을 이용하여 가져오기
  const{cartItems}=useSelector((state)=>state.cart);
  return (
    <div className='flex flex-col items-center justify-center'>
      <ul>
        {cartItems.map((item) => (
          <CartItems key={item.id} lp={item} />
        ))}
        
      </ul>
      <button onClick={modalClick} className='px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer'> 전체 삭제 </button>
        {isOpen && <Modal />}
      
    </div>
  );

};

export default CartList;