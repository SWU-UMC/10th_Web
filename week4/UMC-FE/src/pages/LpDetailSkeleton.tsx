const LpDetailSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 animate-pulse">
            {/* 이미지 자리 스켈레톤 */}
            <div className="w-full h-80 bg-gray-200 rounded-lg"></div>
            
            {/* 제목 자리 스켈레톤 */}
            <div className="h-10 bg-gray-200 rounded w-3/4 mt-6"></div>
            
            {/* 본문 내용 스켈레톤 */}
            <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    );
};

export default LpDetailSkeleton;
