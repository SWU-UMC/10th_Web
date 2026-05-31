import CartItem from "./CartItem";
import { useCartInfo } from "../hooks/useCartStore";

const CartList = () => {
    const { cartItems} = useCartInfo();

    if (cartItems.length === 0) {
        return (
            <div className="flex p-20 flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-gray-800">
                    장바구니가 비어있습니다.
                </h3>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <ul>
                {cartItems.map((item) => (
                    <CartItem key={item.id} lp={item}/>
                ))}
            </ul>
        </div>
    )
};

export default CartList;