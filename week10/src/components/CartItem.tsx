import type { LP } from "../types/cart";
import { useDispatch } from "../hooks/customRedux";
import { increase, decrease, removeItem } from "../store/cartSlice";

interface CartItemProps {
  item: LP;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increase({ id: item.id }));
  };

  const handleDecrease = () => {
    if (item.amount === 1) {
      dispatch(removeItem({ id: item.id }));
      return;
    }
    dispatch(decrease({ id: item.id }));
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 w-full max-w-2xl">
      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded mr-4" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.singer}</p>
        <p className="text-sm font-bold text-gray-500 mt-1">{item.price.toLocaleString()}원</p>
      </div>
      <div className="flex items-center border border-gray-300 rounded">
        <button 
          onClick={handleDecrease}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l cursor-pointer"
        >
          -
        </button>
        <span className="px-4 py-1 font-medium">{item.amount}</span>
        <button 
          onClick={handleIncrease}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;