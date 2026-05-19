import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import MyPage from './pages/MyPage'; 
import GoogleCallback from './pages/GoogleCallback';
import LpListPage from './pages/LpListPage'; 
import Layout from './components/Layout'; 
import LpDetailPage from './pages/LpDetailPage';
import UploadPage from './pages/UploadPage';

// React Query 클라이언트 생성
const queryClient = new QueryClient();

// 공통 레이아웃 래퍼 
const LayoutWrapper = () => (
  <Layout>
    <Outlet /> 
  </Layout>
);

const router = createBrowserRouter([
  {
    element: <LayoutWrapper />,
    children: [
      { path: "/", element: <LpListPage /> }, 
      { path: "/lps/:lpid", element: <LpDetailPage /> },
      { path: "/upload", element: <UploadPage /> },
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "/mypage", element: <MyPage /> },
        ],
      },
    ],
  },
  
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/v1/auth/google/callback", element: <GoogleCallback /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;