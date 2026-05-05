import "./App.css";
import{createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "../pages/HomePage"
import NotFoundPage from "../pages/NotFoundPage"
import LoginPage from "../pages/LoginPage";
import HomeLayout from "../src/layouts/HomeLayout"
import SignupPage from "../pages/SignupPage"
import MyPage from "../pages/MyPage";
//1. 홈페이지
//2. 로그인 페이지
//3. 회원가입 페이지

const router=createBrowserRouter([
  {
    path:"/",
    element: <HomeLayout/>, //홈페이지 연결, element에는 공유되는 구성(레이아웃, navbar랑 footer을 제외한 가운데 요소, 즉 outlet)이 들어가야함
    errorElement: <NotFoundPage/>,
    children:[
      {index:true, element: <HomePage/>}, //홈 경로, intdex: true 라는 것은 path:/이 두번 쓰일 수 없어서 부여
      {path:"login",element:<LoginPage/>},
      {path: 'signup', element: <SignupPage/>},
      {path:"my",element:<MyPage/>},
    ]
  },
]);
function App() {
  return (<RouterProvider router={router} />); // 라우터 호출
}
export default App;
