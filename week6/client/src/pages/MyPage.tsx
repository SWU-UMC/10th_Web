import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBallAnimation } from '../hooks/useBallAnimation'; 
import api from '../apis/axios'; 


interface UserData {
  id: number;
  name: string;
  email: string;
}

const MyPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const balls = useBallAnimation(containerRef);

  
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
       
        const token = localStorage.getItem('accessToken');
        
        
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status) {
          setUser(response.data.data); 
        }
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
        
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert('로그아웃 되었습니다.');
    navigate('/login', { replace: true });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-black overflow-hidden text-white font-sans">
      
      {balls.map((ball) => (
        <div 
          key={ball.id} 
          className={`absolute rounded-full opacity-30 blur-2xl z-0 ${ball.color}`}
          style={{ 
            width: ball.size, 
            height: ball.size, 
            left: ball.x - ball.size / 2, 
            top: ball.y - ball.size / 2 
          }} 
        />
      ))}

      <div className="w-full max-sm:max-w-[320px] max-w-sm p-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl relative z-10 flex flex-col items-center gap-8">
        
        <div className="w-full relative">
          <p className="text-center font-bold text-white/60 tracking-[0.3em] text-xs mt-2">DORI</p>
          <h1 className="text-3xl font-extrabold text-center text-white mt-4 mb-2">마이페이지</h1>
        </div>

        <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-inner">
        
          <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>

        <div className="text-center flex flex-col gap-2">
          <p className="text-xl font-bold text-white">
            <span className="text-cyan-300">{user ? user.name : '...'}</span>님, 환영합니다!
          </p>
          <p className="text-sm text-white/60 px-4">
            {user ? user.email : '데이터를 불러오는 중입니다'}
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
          <button 
            className="w-full p-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all text-sm"
            onClick={() => navigate('/', { replace: true })} 
          >
            메인 페이지로 이동
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full p-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-all text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;