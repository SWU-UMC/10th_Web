import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 상태(토큰 있음)라면 로그인 창에 못 머물게 홈으로 튕겨냄
    if (accessToken) {
      alert('이미 로그인된 상태입니다.');
      navigate('/', { replace: true });
    }
  }, [accessToken, navigate]);

  return (
    <div>
      {/* ⚠️ 여기에 질문자님이 만들어두신 원래 로그인 화면 UI 디자인 코드(Tailwind 등)가 들어와야 합니다! */}
      <h2>로그인 페이지</h2>
    </div>
  );
}