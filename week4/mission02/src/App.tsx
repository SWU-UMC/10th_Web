import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomeLayout from './layouts/HomeLayout'
import MyPage from './pages/MyPage'
import { Authprovider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import LpDetailpage from './pages/LpDetailPage'
import ThrottlePage from './pages/ThrottlePage'

// 1.홈페이지
// 2.로그인 페이지
// 3.회원가입 페이지

// 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      { path: 'lps/:lpId', element: <LpDetailpage /> },
      { path: '/throttle', element: <ThrottlePage /> },
    ]
  }
];

// 인증이 필요한 라우트
const protectedRoutes:RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "Mypage",
        element: <MyPage />
      }
    ]
  }
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient =  new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Authprovider>
        <RouterProvider router={router} />
      </Authprovider>
      {import.meta.env.DEV &&<ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App
