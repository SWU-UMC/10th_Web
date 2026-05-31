import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/carSlice";

export default function Modal() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.modal);

    if (!isOpen) return null;

    const handleConfirm = () => {
        dispatch(clearCart());
        dispatch(closeModal());
    };

    const handleCancel = () => {
        dispatch(closeModal());
    };

    return (
        <div 
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999, 
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
            }}
            onClick={handleCancel} 
        >
            <div 
                className="w-80 rounded-md bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-center text-lg font-semibold text-gray-800">
                    장바구니를 비우시겠습니까?
                </h3>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        네
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 rounded-md bg-gray-200 py-2 font-medium text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                        아니요
                    </button>
                </div>
            </div>
        </div>
    );
};
