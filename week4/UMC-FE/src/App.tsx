import './App.css'
import React, { useState } from 'react'; // 💡 useState 추가
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/myPage' // 경로 대소문자 확인 필요
import HomeLayout from './layouts/HomeLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import LpListPage from './pages/LpListPage'
import LpDetailPage from './pages/LpDetailPage';
import LpCreateModal from './components/LpCreateModal'; // 💡 모달 컴포넌트 임포트
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// publicRoutes: 인증 없이 접근 가능한 라우터
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'lps', element: <LpListPage /> },
      { path: 'lp/:lpId', element: <LpDetailPage /> },
    ]
  },
]

// protectedRoutes: 인증이 필요한 라우터
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'my',
        element: <MyPage />
      }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        
        <RouterProvider router={router} />

        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full text-3xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
        >
          +
        </button>

        {isModalOpen && (
          <LpCreateModal onClose={() => setIsModalOpen(false)} />
        )}

      </AuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;