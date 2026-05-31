import { useDispatch } from 'react-redux';
import { removeItem, increase, decrease } from '../features/cart/cartSlice';

interface CartItemProps {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

const CartItem = ({ id, title, singer, price, img, amount }: CartItemProps) => {
  const dispatch = useDispatch();

  return (
    <article className="flex items-center justify-between mb-6 p-4 border rounded shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <img src={img} alt={title} className="w-20 h-20 object-cover rounded" />
        <div>
          <h4 className="font-bold text-lg">{title}</h4>
          <h5 className="text-gray-500 text-sm mb-1">{singer}</h5>
          <h4 className="text-blue-600 font-semibold">{Number(price).toLocaleString()}원</h4>
          <button
            className="text-red-500 text-sm mt-1 hover:underline"
            onClick={() => dispatch(removeItem(id))}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        {/* 증가 버튼 */}
        <button
          className="text-gray-600 hover:text-blue-600 text-xl font-bold p-1"
          onClick={() => dispatch(increase(id))}
        >
          +
        </button>
        {/* 현재 수량 */}
        <p className="text-lg font-semibold my-1">{amount}</p>
        {/* 감소 버튼 */}
        <button
          className="text-gray-600 hover:text-red-600 text-xl font-bold p-1"
          onClick={() => dispatch(decrease(id))}
        >
          -
        </button>
      </div>
    </article>
  );
};

export default CartItem;