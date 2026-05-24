import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    navigate('/'); // 로그아웃 성공 후 홈으로 이동
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔒 마이 페이지 (인증된 유저 전용)</h1>
      <p>Swagger 문서에서 자물쇠가 걸려있던 회원정보 조회 API 등을 요청할 수 있는 안전한 공간입니다.</p>
      
      <button 
        onClick={handleLogoutClick}
        style={{
          cursor: 'pointer',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none'
        }}
      >
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;