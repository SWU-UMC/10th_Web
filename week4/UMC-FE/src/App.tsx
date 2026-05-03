import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './pages/Login'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/myPage'
import HomeLayout from './layouts/HomeLayout'


// 1. 홈페이지
// 2. 로그인 페이지
// 3. 회원가입 페이지

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {index: true, element: <HomePage />},
      {path: 'login', element: <Login />},
      {path: 'signup', element: <SignupPage />},
      {path: 'my', element: <MyPage />},
    ]
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App;
