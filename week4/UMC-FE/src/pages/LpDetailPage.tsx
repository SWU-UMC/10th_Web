import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLpDetail } from '../apis/lp';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import LpDetailSkeleton from './LpDetailSkeleton';
import { getLpComments } from '../apis/lp';
import CommentSkeleton from '../components/CommentSkeleton';
import React, { useEffect, useState, useRef } from 'react';

const LpDetailPage = () => {
    const { lpId } = useParams();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState("desc");
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [commentText, setCommentText] = useState("");

    // 보호 라우트
    if (!accessToken) {
        if (window.confirm("로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?")) {
            navigate("/login", { state: { from: location } });
        } else {
            navigate(-1); // 이전 페이지로 이동
        }
        return null;
    }

    const {data, isLoading, isError} = useQuery ({
        queryKey: ['lp', lpId],
        queryFn: () => getLpDetail(Number(lpId)),
        enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
    });

    const {
        data: commentsData,              
        isLoading: isCommentsLoading,    
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['lpComments', lpId, order],
        queryFn: ({ pageParam = null }) => getLpComments(lpId!, order, pageParam as number | null),
        initialPageParam: null,
        getNextPageParam: (lastPage: any) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    

    if (isLoading) return <LpDetailSkeleton />;
    if (isError) return <div>LP 정보를 불러오는 중 오류가 발생했습니다.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 썸네일 이미지 */}
            <img 
                src={data.thumbnail} 
                alt={data.title} 
                className="w-full h-[400px] object-cover rounded-xl shadow-md" 
            />
            
            <div className="mt-8">
                {/* 제목 */}
                <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                
                {/* 작성자 정보 & 날짜 */}
                <div className="flex items-center gap-3 mt-4 text-gray-600 border-b pb-4">
                    <img 
                        src={data.author.avatar} 
                        alt="프로필" 
                        className="w-10 h-10 rounded-full border"
                    />
                    <div>
                        <p className="font-medium text-gray-800">{data.author.name}</p>
                        <p className="text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-wrap">
                    {data.content}
                </p>

                <section className="mt-12 border-t pt-8">
                    <h3 className="text-xl font-bold mb-6">댓글</h3>

                    {/* 댓글 작성 UI */}
                    <div className="mb-8">
                        <textarea 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="따뜻한 댓글을 남겨주세요."
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-red-500">
                                {commentText.length === 0 && "내용을 입력해야 등록이 가능합니다."}
                            </p>
                            <button 
                                disabled={!commentText.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 transition-colors"
                            >
                                등록
                            </button>
                        </div>
                    </div>

                    {/* 댓글 정렬 버튼 */}
                    <div className="flex gap-4 mb-4 text-sm">
                        <button 
                            onClick={() => setOrder("desc")} 
                            className={order === "desc" ? "font-bold text-blue-600" : "text-gray-500"}
                        >
                            최신순
                        </button>
                        <button 
                            onClick={() => setOrder("asc")} 
                            className={order === "asc" ? "font-bold text-blue-600" : "text-gray-500"}
                        >
                            오래된순
                        </button>
                    </div>

                    {/* 댓글 목록 렌더링 (별명 commentsData 사용!) */}
                    {isCommentsLoading ? (
                        <div>
                            {Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={`init-skel-${i}`} />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {commentsData?.pages.map((page: any, i: number) => (
                                <React.Fragment key={i}>
                                    {page?.data?.map((comment: any) => (
                                        <div key={comment.id} className="py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold">{comment.author.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* 추가 스크롤 로딩 (하단 스켈레톤) */}
                    {isFetchingNextPage && (
                        <div className="mt-4">
                            {Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={`more-skel-${i}`} />)}
                        </div>
                    )}

                    {/* 무한 스크롤 트리거 */}
                    <div ref={observerRef} className="h-10"></div>
                </section>
            </div>
        </div>
    );
};

export default LpDetailPage;