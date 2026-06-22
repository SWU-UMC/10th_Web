import { useDispatch } from "react-redux";
import { closeModal } from "../store/slices/modalSlice";
import {clearCart} from"../store/slices/cartSlice";

const modal=()=>{
const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
            <h2>정말 삭제하시겠습니까?</h2>
            <div className="flex gap-2 mt-4">
                <button onClick={() => dispatch(closeModal())} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer">아니요</button>
                <button onClick={() => {dispatch(clearCart());dispatch(closeModal());}}className="px-3 py-1 bg-red-300 text-gray-800 rounded-l hover:bg-red-400 cursor-pointer">네</button>
            </div>
        </div>
    </div>
  )
}
export default modal;