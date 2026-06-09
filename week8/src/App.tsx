import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage'; // 파일명 대소문자 일치
import MyPage from './pages/MyPage';

// 🔒 1. 비로그인 유저를 로그인창으로 튕겨내는 바리케이드 (영상 속 ProtectedLayout)
const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  // 토큰이 없으면 로그인 페이지로 강제 이동 (Redirect)
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 자식 컴포넌트(MyPage 등)를 보여줌
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />, // 메인 홈 페이지 레이아웃
    children: [
      // 🔓 누구나 접근 가능한 페이지
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignUpPage /> }, // 주소창 경로 설정
      
      // 🔒 로그인한 사람만 들어갈 수 있는 비밀 구역
      {
        element: <ProtectedLayout />, // 자물쇠 설치!
        children: [
          { path: 'my', element: <MyPage /> } // http://localhost:5173/my
        ]
      }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}