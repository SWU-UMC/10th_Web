import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import api from '../apis/axios';

const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [commentInput, setCommentInput] = useState('');
  const { ref, inView } = useInView();

  const lpIdNum = Number(lpid);

  // 1. 상세 데이터 조회
  const { data: lp, isLoading: isLpLoading } = useQuery({
    queryKey: ['lp', lpIdNum],
    queryFn: async () => {
      const res = await api.get(`/lps/${lpIdNum}`);
      return res.data.data;
    }
  });

  // toggleLike Mutation 부분만 이 로직으로 완전히 교체해봐!
const toggleLike = useMutation({
  mutationFn: async (isCurrentlyLiked: boolean) => {
    return isCurrentlyLiked 
      ? api.delete(`/lps/${lpIdNum}/likes`) 
      : api.post(`/lps/${lpIdNum}/likes`);
  },
  onMutate: async (isCurrentlyLiked) => {
    // 1. 진행 중인 모든 리패치 강제 취소 (매우 중요!)
    await queryClient.cancelQueries({ queryKey: ['lp', lpIdNum] });
    
    const previousLp = queryClient.getQueryData(['lp', lpIdNum]);

    // 2. UI 즉시 업데이트 (낙관적 업데이트)
    queryClient.setQueryData(['lp', lpIdNum], (old: any) => {
      if (!old) return old;
      const currentLikes = old._count?.likes ?? 0;
      return {
        ...old,
        isLiked: !isCurrentlyLiked,
        _count: {
          ...old._count,
          likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
        }
      };
    });

    return { previousLp };
  },
  onError: (err: any, isCurrentlyLiked, context) => {
    if (err.response?.status === 409) {
      
      console.warn("⚠️ 409 에러 발생: 서버와 무관하게 UI를 좋아요 상태로 고정합니다.");
      queryClient.setQueryData(['lp', lpIdNum], (old: any) => ({
        ...old,
        isLiked: true
      }));
    } else {
      // 진짜 통신 에러일 때만 롤백
      queryClient.setQueryData(['lp', lpIdNum], context?.previousLp);
      alert('좋아요 처리에 실패했어요!');
    }
  },
  onSettled: (data, error) => {
    
    const isConflict = (error as any)?.response?.status === 409;

    if (!isConflict) {
      // 409 에러가 아닐 때만 0.5초 뒤에 동기화
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['lp', lpIdNum] });
        queryClient.invalidateQueries({ queryKey: ['myList'] });
      }, 500);
    } else {
      console.log("409 에러이므로 서버 동기화를 건너뛰고 로컬 UI를 유지합니다.");
    }
  }
});

  // 3. 댓글 목록 (무한스크롤)
  const { data: commentData, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['lpComments', lpIdNum, order],
    queryFn: async ({ pageParam = undefined }) => {
      const res = await api.get(`/lps/${lpIdNum}/comments`, { params: { cursor: pageParam, limit: 10, order } });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  const createComment = useMutation({
    mutationFn: (content: string) => api.post(`/lps/${lpIdNum}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpIdNum] });
      setCommentInput('');
    }
  });

  useEffect(() => { if (inView && hasNextPage) fetchNextPage(); }, [inView, hasNextPage]);

  if (isLpLoading) return <div className="p-20 text-white animate-pulse text-center font-black">Vinyl Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 md:p-12 gap-8 bg-black min-h-screen text-white">
      {/* LP 상세 카드 */}
      <div className="glass-panel w-full max-w-3xl p-12 rounded-[50px] flex flex-col items-center gap-10 border border-white/10 shadow-2xl relative">
        <h1 className="text-5xl font-black text-center text-pink-500 uppercase tracking-tighter drop-shadow-lg">
          {lp?.title}
        </h1>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-pink-500/20 blur-[60px] rounded-full animate-pulse" />
          <img 
            src={lp?.thumbnail} 
            className="w-72 h-72 rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-[spin_25s_linear_infinite] border-[12px] border-white/5 relative z-10" 
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {lp?.tags?.map((tag: any) => (
            <span key={tag.id} className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 text-xs font-black tracking-widest shadow-inner">
              #{tag.name}
            </span>
          ))}
        </div>

        <p className="text-white/50 text-center italic max-w-lg leading-relaxed font-medium">
          "{lp?.content}"
        </p>

        {/* 💖 좋아요 버튼 섹션 */}
        <div className="flex flex-col items-center gap-3 mt-6 bg-white/[0.03] p-8 rounded-[40px] border border-white/5 min-w-[160px] transition-all hover:bg-white/[0.06]">
          <button 
            onClick={() => {
              if (!localStorage.getItem('accessToken')) {
                alert('로그인이 필요해요!');
                return navigate('/login');
              }
              toggleLike.mutate(!!lp?.isLiked);
            }}
            disabled={toggleLike.isPending}
            className="group transition-transform active:scale-150 duration-300 ease-out outline-none"
          >
            <span className={`text-7xl transition-all ${lp?.isLiked ? 'text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]' : 'text-white/10 group-hover:text-white/30'}`}>
              {lp?.isLiked ? '❤️' : '🤍'}
            </span>
          </button>
          <span className="text-4xl font-black tabular-nums tracking-tighter text-white/90">
            {lp?._count?.likes || 0}
          </span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="glass-panel w-full max-w-3xl p-10 rounded-[50px] border border-white/10">
        <h3 className="text-2xl font-black mb-8 text-cyan-400 uppercase tracking-widest">Comments</h3>
        <div className="flex gap-4 mb-12">
          <input 
            value={commentInput} 
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5 text-sm focus:border-pink-500/50 outline-none transition-all placeholder:text-white/20" 
          />
          <button 
            onClick={() => createComment.mutate(commentInput)}
            className="bg-pink-500 text-white px-10 rounded-3xl text-sm font-black shadow-lg hover:bg-pink-600 transition-all active:scale-95"
          >
            POST
          </button>
        </div>

        <div className="space-y-6">
          {commentData?.pages.map((page) =>
            page.data.map((comment: any) => (
              <div key={comment.id} className="p-6 bg-white/[0.03] rounded-[30px] border border-white/5 transition-all hover:bg-white/[0.07]">
                <p className="font-black text-cyan-300 text-xs mb-3 uppercase tracking-tighter">{comment.author.name}</p>
                <p className="text-sm text-white/70 leading-relaxed font-medium">{comment.content}</p>
              </div>
            ))
          )}
          <div ref={ref} className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;