import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "../hooks/customRedux";

const NabBar = () => {
  const { amount } = useSelector((state) => state.cart);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 
        className="text-2xl font-semibold cursor-pointer"
        onClick={() => window.location.href = "/"}
      >
        오타니안 (OtaniAn)
      </h1>
      <div className="flex items-center space-x-2 text-2xl">
        <FaShoppingCart size={24} />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </nav>
  );
};

export default NabBar;