import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

  const isLogin = !!localStorage.getItem('accessToken'); 
  if (!isLogin) {
    alert('로그인이 필요한 페이지입니다!');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;