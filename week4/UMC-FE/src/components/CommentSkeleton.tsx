const CommentSkeleton = () => {
    return (
        <div className="flex gap-3 py-4 border-b border-gray-100 animate pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div> 
            </div>
        </div>
    );
};

export default CommentSkeleton;