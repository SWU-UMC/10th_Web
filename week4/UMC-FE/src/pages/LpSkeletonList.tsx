const LpSkeletonList = () => {
    const skeletonItems = Array.from({ length: 6 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skeletonItems.map((_, index) => (
                <div key={index} className="border rounded-lg p-4 animate-pulse">
                    {/* 이미지 영역 스켈레톤 */}
                    <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                    
                    {/* 제목 영역 스켈레톤 */}
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    
                    {/* 날짜/기타 정보 영역 스켈레톤 */}
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
};

export default LpSkeletonList;