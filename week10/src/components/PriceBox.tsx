import { useSelector, useDispatch } from "../hooks/customRedux";
import { clearCart } from "../store/cartSlice";

const PriceBox = () => {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center p-8 max-w-2xl mx-auto w-full">
      <div className="text-xl font-semibold">
        총 가격: <span className="text-blue-600">{total.toLocaleString()}원</span>
      </div>
      <button
        onClick={() => dispatch(clearCart())}
        className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm font-medium"
      >
        장바구니 초기화
      </button>
    </div>
  );
};

export default PriceBox;