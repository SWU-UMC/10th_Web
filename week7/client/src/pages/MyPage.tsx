import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../apis/axios';
import { useBallAnimation } from '../hooks/useBallAnimation';

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const balls = useBallAnimation(containerRef);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

  // 내 정보 조회
  const { data: user } = useQuery({
    queryKey: ['userMe'],
    queryFn: async () => {
      const res = await api.get('/users/me');
      return res.data.data;
    }
  });

  // 프로필 수정 Mutation
  const updateProfile = useMutation({
    mutationFn: (newData: any) => api.patch('/users/me', newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMe'] });
      setIsEditMode(false);
    }
  });

  // 회원 탈퇴 Mutation
  const quitMutation = useMutation({
    mutationFn: () => api.delete('/users/me'),
    onSuccess: () => {
      localStorage.clear();
      navigate('/login');
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-black overflow-hidden text-white p-6">
      {balls.map((ball) => (
        <div key={ball.id} className={`absolute rounded-full opacity-20 blur-3xl z-0 ${ball.color}`}
          style={{ width: ball.size, height: ball.size, left: ball.x - ball.size / 2, top: ball.y - ball.size / 2 }} />
      ))}

      <div className="w-full max-w-sm p-10 glass-panel rounded-[40px] relative z-10 flex flex-col items-center gap-8 border border-white/10">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
          <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"} alt="avatar" />
        </div>

        <div className="text-center space-y-2">
          {isEditMode ? (
            <div className="space-y-3">
              <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/5 border border-white/20 p-2 rounded-lg text-center w-full" placeholder="Name" />
              <input value={editBio} onChange={e => setEditBio(e.target.value)} className="bg-white/5 border border-white/20 p-2 rounded-lg text-center w-full text-sm" placeholder="Bio" />
              <div className="flex gap-2">
                <button onClick={() => updateProfile.mutate({ name: editName, bio: editBio })} className="text-cyan-400 text-xs font-bold">저장</button>
                <button onClick={() => setIsEditMode(false)} className="text-white/30 text-xs">취소</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-black text-cyan-300">{user?.name}</p>
                <button onClick={() => { setIsEditMode(true); setEditName(user?.name); setEditBio(user?.bio || ''); }}>⚙️</button>
              </div>
              <p className="text-sm text-white/40 italic">"{user?.bio || '자기소개가 없습니다'}"</p>
              <p className="text-xs text-white/20">{user?.email}</p>
            </>
          )}
        </div>

        <div className="w-full space-y-3">
          <button onClick={() => navigate('/')} className="w-full p-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 transition-colors">홈으로</button>
          <button onClick={handleLogout} className="w-full p-4 bg-white/5 rounded-2xl font-bold text-white/40 hover:text-white">로그아웃</button>
          <button onClick={() => setIsQuitModalOpen(true)} className="w-full pt-4 text-[10px] text-white/10 hover:text-red-500">탈퇴하기</button>
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {isQuitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-10 rounded-[30px] text-center border border-white/10">
            <p className="text-xl font-bold mb-8">정말 탈퇴하시겠습니까?</p>
            <div className="flex gap-4">
              <button onClick={() => quitMutation.mutate()} className="flex-1 bg-white/10 py-3 rounded-xl hover:bg-red-500 transition-colors">예</button>
              <button onClick={() => setIsQuitModalOpen(false)} className="flex-1 bg-pink-500 py-3 rounded-xl font-bold">아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;