import { useCartStore } from '../store/useCartStore';

export default function Modal() {
  const { closeModal, clearCart } = useCartStore();

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-6">정말 삭제하시겠습니까?</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={closeModal}
            className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
}