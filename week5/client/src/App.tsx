import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import MyPage from './pages/MyPage'; 
import GoogleCallback from './pages/GoogleCallback'; // 추가!

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  

  { path: "/v1/auth/google/callback", element: <GoogleCallback /> },

  {
    element: <ProtectedRoute />, 
    children: [
      { path: "/mypage", element: <MyPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;