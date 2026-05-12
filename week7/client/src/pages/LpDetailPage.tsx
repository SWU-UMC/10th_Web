import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import api from '../apis/axios';

const LpDetailPage = () => {
  const { lpid } = useParams();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [commentInput, setCommentInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const { ref, inView } = useInView();

  const myNickname = localStorage.getItem('nickname');

  // 1. 상세 조회
  const { data: lp, isLoading: isLpLoading } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: async () => {
      const res = await api.get(`/lps/${lpid}`);
      return res.data.data;
    }
  });

  // 2. 댓글 목록 (무한스크롤)
  const { data: commentData, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['lpComments', lpid, order],
    queryFn: async ({ pageParam = undefined }) => {
      const res = await api.get(`/lps/${lpid}/comments`, { params: { cursor: pageParam, limit: 10, order } });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  // 3. 댓글 생성 Mutation
  const createComment = useMutation({
    mutationFn: (content: string) => api.post(`/lps/${lpid}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      setCommentInput('');
    }
  });

  // 4. 댓글 수정 Mutation
  const updateComment = useMutation({
    mutationFn: ({ cid, content }: { cid: number; content: string }) => 
      api.patch(`/lps/${lpid}/comments/${cid}`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] });
      setEditingId(null);
    }
  });

  // 5. 댓글 삭제 Mutation
  const deleteComment = useMutation({
    mutationFn: (cid: number) => api.delete(`/lps/${lpid}/comments/${cid}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] })
  });

  useEffect(() => { if (inView && hasNextPage) fetchNextPage(); }, [inView, hasNextPage]);

  if (isLpLoading) return <div className="p-20 text-white animate-pulse text-center">유리 파편 조립 중...</div>;

  return (
    <div className="flex flex-col items-center p-6 md:p-12 gap-8">
      {/* LP 상세 카드 */}
      <div className="glass-panel w-full max-w-3xl p-8 rounded-[40px] flex flex-col gap-8">
        <h1 className="text-4xl font-black text-center">{lp?.title}</h1>
        <div className="flex justify-center">
          <img src={lp?.thumbnail} className="w-64 h-64 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-float border-8 border-white/5" />
        </div>
        <p className="text-white/70 text-center italic">"{lp?.content}"</p>
      </div>

      {/* 댓글 섹션 */}
      <div className="glass-panel w-full max-w-3xl p-8 rounded-[40px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">댓글</h3>
          <div className="flex gap-2">
            <button onClick={() => setOrder('desc')} className={`text-xs ${order === 'desc' ? 'text-cyan-400' : 'text-white/40'}`}>최신순</button>
            <button onClick={() => setOrder('asc')} className={`text-xs ${order === 'asc' ? 'text-cyan-400' : 'text-white/40'}`}>오래된순</button>
          </div>
        </div>

        {/* 작성란 */}
        <div className="flex gap-3 mb-8">
          <input 
            value={commentInput} 
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력해주세요" 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-cyan-500/50 outline-none" 
          />
          <button 
            onClick={() => createComment.mutate(commentInput)}
            className="bg-cyan-500/20 text-cyan-300 px-6 rounded-xl text-sm font-bold border border-cyan-500/30"
          >
            작성
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {commentData?.pages.map((page) =>
            page.data.map((comment: any) => (
              <div key={comment.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 group">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-bold text-cyan-300">{comment.author.name}</span>
                  <div className="flex gap-3 items-center">
                    <span className="text-[10px] text-white/20">{new Date(comment.createdAt).toLocaleString()}</span>
                    {comment.author.name === myNickname && (
                      <div className="hidden group-hover:flex gap-2">
                        <button onClick={() => { setEditingId(comment.id); setEditInput(comment.content); }}>✏️</button>
                        <button onClick={() => deleteComment.mutate(comment.id)}>🗑️</button>
                      </div>
                    )}
                  </div>
                </div>
                
                {editingId === comment.id ? (
                  <div className="flex gap-2">
                    <input 
                      value={editInput} 
                      onChange={(e) => setEditInput(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 text-sm outline-none"
                    />
                    <button onClick={() => updateComment.mutate({ cid: comment.id, content: editInput })} className="text-cyan-400 text-xs">확인</button>
                    <button onClick={() => setEditingId(null)} className="text-white/40 text-xs">취소</button>
                  </div>
                ) : (
                  <p className="text-sm text-white/80">{comment.content}</p>
                )}
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