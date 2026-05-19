import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      alert("구글 로그인에 성공했습니다! ");
      navigate('/mypage');
    } else {
      alert("로그인 정보를 가져오지 못했습니다.");
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen bg-black flex items-center justify-center text-white">
      <p className="animate-pulse">구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallback;