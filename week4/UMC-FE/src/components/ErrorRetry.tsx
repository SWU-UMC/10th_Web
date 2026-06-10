interface ErrorRetryProps {
    message?: string;
    onRetry: () => void;
}

const ErrorRetry = ({onRetry, message = "데이터를 불러오는 중 오류가 발생했습니다."}: ErrorRetryProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-600 mb-4">{message}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >다시 시도하기</button>
        </div>
    );
};

export default ErrorRetry;