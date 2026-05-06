import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const BurgerIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    width="48" 
    height="48" 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M7.95 11.95h32m-32 12h32m-32 12h32" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // 로그인 상태 확인 (인터셉터에서 저장한 토큰 기준)
  const userNickname = localStorage.getItem('nickname'); 
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.clear();
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden">
      {/* 1. 사이드바 (반응형) */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform bg-white/5 backdrop-blur-2xl border-r border-white/10 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter text-cyan-400 mb-10">DOLIGO</h2>
          <nav className="flex flex-col gap-6 font-medium text-white/60">
            <Link to="/" className="hover:text-white transition-colors">찾기</Link>
            <Link to="/mypage" className="hover:text-white transition-colors">마이페이지</Link>
          </nav>
        </div>
        <button className="absolute bottom-10 left-8 text-sm text-white/30 hover:text-white" onClick={() => alert('탈퇴하시겠어요?')}>탈퇴하기</button>
      </aside>

      {/* 사이드바 외부 영역 클릭 시 닫기 (모바일) */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* 2. 헤더 */}
        <header className="h-20 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md border-b border-white/5 z-30">
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-xl" onClick={() => setIsSidebarOpen(true)}>
            <BurgerIcon className="w-8 h-8 text-white" />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-light"><strong className="text-cyan-300">{userNickname}</strong>님 반갑습니다.</span>
                <button onClick={handleLogout} className="text-xs border border-white/20 px-4 py-2 rounded-full hover:bg-white/10">로그아웃</button>
              </>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => navigate('/login')} className="text-sm font-bold">로그인</button>
                <button onClick={() => navigate('/signup')} className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full">회원가입</button>
              </div>
            )}
          </div>
        </header>

        {/* 3. 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>

        {/* 4. 플로팅 버튼 (+) */}
        <button 
          onClick={() => navigate('/upload')}
          className="absolute bottom-8 right-8 w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-110 transition-transform z-40"
        >
          <span className="text-3xl font-light">+</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;