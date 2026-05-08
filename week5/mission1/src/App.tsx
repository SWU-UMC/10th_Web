import "./App.css";
import{createBrowserRouter, RouterProvider} from "react-router-dom";
import type {RouteObject} from "react-router-dom";
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout"
import SignupPage from "./pages/SignupPage"
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
//1. 홈페이지
//2. 로그인 페이지
//3. 회원가입 페이지
//publicRoutes: 인증 없이 접근 가능한 라우트
const publicRoutes:RouteObject[]=[
  {
    path:"/",
    element: <HomeLayout/>, //홈페이지 연결, element에는 공유되는 구성(레이아웃, navbar랑 footer을 제외한 가운데 요소, 즉 outlet)이 들어가야함
    errorElement: <NotFoundPage/>,
    children:[
      {index:true, element: <HomePage/>}, //홈 경로, intdex: true 라는 것은 path:/이 두번 쓰일 수 없어서 부여
      {path:"login",element:<LoginPage/>},
      {path: 'signup', element: <SignupPage/>},
      {path:"/v1/auth/google/callback",element:<GoogleLoginRedirectPage/>}
    ]
  }
];
//protectedRoutes: 인증이 필요한 라우트
const protectedRoutes:RouteObject[]=[
  {
    path:"/",
    element: <ProtectedLayout/>, 
    errorElement: <NotFoundPage/>,
    children:[
      {
        path:"my",
        element: <MyPage/>,
      }
    ]
  }
]
const router=createBrowserRouter([...publicRoutes, ...protectedRoutes]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  );
}
export default App;
