import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import { useDispatch, useSelector } from "./hooks/customRedux";
import { calculateTotals } from "./store/cartSlice";
import NabBar from "./components/NabBar";
import CartList from "./components/CartList";
import PriceBox from "./components/PriceBox";

// 상태 동기화를 담당할 내부 서브 컴포넌트
const AppContent = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // 장바구니 아이템 리스트가 바뀔 때마다 실시간 재계산 트리거
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <>
      <NabBar />
      <CartList />
      <PriceBox />
    </>
  );
};

// 최상단에서 Provider 주입
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;