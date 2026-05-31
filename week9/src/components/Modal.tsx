import { useCartActions } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore"; // Zustand 모달 스토어

export default function Modal() {
    // 1. 리덕스 dispatch 대신 Zustand 스토어에서 함수 직접 가져오기
    const { clearCart } = useCartActions();
    const { isOpen, closeModal } = useModalStore();

    // 2. 모달이 닫혀있으면 화면에 아무것도 그리지 않음 (기존 로직 유지)
    if (!isOpen) return null;

    // 3. '네' 버튼 클릭 시 실행
    const handleConfirm = () => {
        clearCart();   // 장바구니 비우기 함수 다이렉트 호출
        closeModal();  // 모달 닫기 함수 다이렉트 호출
    };

    // 4. '아니요' 또는 바깥 배경 클릭 시 실행
    const handleCancel = () => {
        closeModal();  // 모달 닫기 함수 다이렉트 호출
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
