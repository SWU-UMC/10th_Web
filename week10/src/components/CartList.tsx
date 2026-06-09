import { useSelector } from "../hooks/customRedux";
import CartItem from "./CartItem";

const CartList = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg my-8">장바구니가 비어 있습니다.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))
      )}
    </div>
  );
};

export default CartList;