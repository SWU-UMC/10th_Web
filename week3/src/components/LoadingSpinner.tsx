export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="w-12 h-12 rounded-full border-4 border-transparent border-t-[#bedab1] animate-spin"
        role="status"
      >
        <span className="sr-only">로딩중...</span>
      </div>
    </div>
  );
}