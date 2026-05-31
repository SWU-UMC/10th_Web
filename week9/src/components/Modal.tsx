import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/carSlice";

export default function Modal() {
    const dispatch = useDispatch();
    // useState 대신 Redux에서 모달의 열림 상태를 가져옴
    const { isOpen } = useSelector((state) => state.modal);

    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    // "네" 버튼 클릭 시: 장바구니 비우고 모달 닫기
    const handleConfirm = () => {
        dispatch(clearCart()); // 미션 3 조건: 기존 clearCart 액션 필수 활용
        dispatch(closeModal());
    };

    // "아니요" 버튼 클릭 시: 모달만 닫기
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
} // 🟢 Modal 함수의 닫는 중괄호가 여기에 위치해야 합니다!
