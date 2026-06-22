import CartItems from "../components/CartItems";
import { useSelector } from "../hooks/useCustomRedux";


const CartList = () => {
  //useSelector을 이용하여 가져오기
  const{cartItems}=useSelector((state)=>state.cart);
  return (
    <div className='flex flex-col items-center justify-center'>
      <ul>
        {cartItems.map((item) => (
          <CartItems key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;