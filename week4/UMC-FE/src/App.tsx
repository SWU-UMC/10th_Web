import './App.css'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/myPage'
import HomeLayout from './layouts/HomeLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import LpListPage from './pages/LpListPage'
import LpDetailPage from './pages/LpDetailPage';
import {QueryClient, QueryClientProvider, QueryErrorResetBoundary} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

// publicRoutes: 인증 없이 접근 가능한 라우터
const publicRoutes:RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <Login />},
      {path: 'signup', element: <SignupPage />},
      {path: 'lps', element: <LpListPage />},
      {path: 'lp/:lpId', element: <LpDetailPage />},
    ]
  },
]
// protectedRoutes: 인증이 필요한 라우터
const protectedRoutes:RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path:'my',
        element: <MyPage />
      }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default App;
