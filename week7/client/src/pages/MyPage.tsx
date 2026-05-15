import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import api from '../apis/axios';
import { useBallAnimation } from '../hooks/useBallAnimation';
import LpCard from '../components/LpCard';
import { useInView } from 'react-intersection-observer';

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const balls = useBallAnimation(containerRef);
  const { ref, inView } = useInView();

  // 탭 상태: 'likes' (좋아요 한 LP), 'my' (내가 작성한 LP)
  const [activeTab, setActiveTab] = useState<'likes' | 'my'>('likes');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');

  // 1. 내 정보 조회
  const { data: user } = useQuery({
    queryKey: ['userMe'],
    queryFn: async () => {
      const res = await api.get('/users/me');
      return res.data.data;
    }
  });

  // 2. 탭에 따른 리스트 무한 스크롤 (명세서 v1/lps/likes/me 또는 v1/lps/user 사용)
  const { data: listData, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['myList', activeTab, sort],
    queryFn: async ({ pageParam = undefined }) => {
      const endpoint = activeTab === 'likes' ? '/lps/likes/me' : '/lps/user';
      const res = await api.get(endpoint, { params: { order: sort, cursor: pageParam, limit: 10 } });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  // 3. 닉네임 변경 낙관적 업데이트
  const updateNickname = useMutation({
    mutationFn: (newName: string) => api.patch('/users/nickname', { nickname: newName }),
    onMutate: async (newName) => {
      await queryClient.cancelQueries({ queryKey: ['userMe'] });
      const previousUser = queryClient.getQueryData(['userMe']);
      queryClient.setQueryData(['userMe'], (old: any) => ({ ...old, name: newName }));
      setIsEditMode(false);
      return { previousUser };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['userMe'] }),
  });

  // 스크롤 감지
  if (inView && hasNextPage) fetchNextPage();

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* 배경 애니메이션 */}
      <div className="fixed inset-0 pointer-events-none">
        {balls.map((ball) => (
          <div key={ball.id} className={`absolute rounded-full opacity-10 blur-3xl ${ball.color}`}
            style={{ width: ball.size, height: ball.size, left: ball.x - ball.size / 2, top: ball.y - ball.size / 2 }} />
        ))}
      </div>

      {/* 상단 프로필 섹션 */}
      <div className="pt-20 pb-10 flex flex-col items-center gap-6 relative z-10">
        <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 overflow-hidden">
          <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"} className="w-full h-full object-cover" />
        </div>
        
        <div className="text-center">
          {isEditMode ? (
            <div className="flex items-center gap-2 border-b border-cyan-500">
              <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-transparent text-2xl font-black outline-none text-center" autoFocus />
              <button onClick={() => updateNickname.mutate(editName)}>✔️</button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-black">{user?.name}</p>
              <button onClick={() => { setIsEditMode(true); setEditName(user?.name); }} className="text-white/40 hover:text-white">⚙️</button>
            </div>
          )}
          <p className="text-cyan-400 font-bold mt-1 text-sm">프론트 짱</p>
          <p className="text-white/20 text-xs mt-1">{user?.email}</p>
        </div>
      </div>

      {/* 탭 메뉴  */}
      <div className="flex justify-center border-b border-white/5 relative z-10">
        <button 
          onClick={() => setActiveTab('likes')}
          className={`px-8 py-4 font-black text-sm transition-all ${activeTab === 'likes' ? 'text-white border-b-2 border-white' : 'text-white/30'}`}
        >
          내가 좋아요 한 LP
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`px-8 py-4 font-black text-sm transition-all ${activeTab === 'my' ? 'text-white border-b-2 border-white' : 'text-white/30'}`}
        >
          내가 작성한 LP
        </button>
      </div>

      {/* 리스트 섹션 */}
      <div className="max-w-5xl mx-auto p-8 relative z-10">
        {/* 정렬 버튼 */}
        <div className="flex justify-end mb-6 gap-2">
          {['asc', 'desc'].map(o => (
            <button key={o} onClick={() => setSort(o as any)} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${sort === o ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10'}`}>
              {o === 'asc' ? '오래된순' : '최신순'}
            </button>
          ))}
        </div>

        {/* 그리드 리스트 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {listData?.pages.map(page => 
            page.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
          )}
        </div>
        <div ref={ref} className="h-20" />
      </div>
    </div>
  );
};

export default MyPage;