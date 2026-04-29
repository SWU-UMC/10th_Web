import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

// 라우터 설정 객체를 따로 생성
const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;