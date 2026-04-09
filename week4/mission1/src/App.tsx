import './App.css';
import MoviePage from '../pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';  
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import MovieDetailPage from'../pages/MovieDetailPage';




const router=createBrowserRouter([  //길을 만드는 도구
  {
    path:'/',   //사용자가 처음 들어왔을 때를 보여주는거, 홈을 뜻한다고 생각하기
    element: <HomePage/>,   //이 화면을 보여줘!라는 뜻, HomePage 기준으로 아래 애들을 보여줌
    errorElement:<NotFoundPage/>, //없는 주소로 오면 이 에러 페이지를 보여줘라는 뜻
    children:[   //홈이라는 큰 틀 안에 들어갈 자식 페이지들
     {
      path:'movies/:category',   //movies/인기영화 처럼 카테고리가 붙으면
      element:<MoviePage/>,  //영화 목록 페이지를 보여줘
     },
     {
      
      path:'movies/:category/:movieId',  //영화/카테고리/123번 영화 처럼 상세 주소면 
      element:<MovieDetailPage/> // 영화 상세 페이지를 보여줘
      },
      {
        path: '*',   //지도에 없는 주소로 들어오면
        element: <NotFoundPage />
      }
        
    ], //홈페이지를 기준으로 자식 요소를 내려줌, 이 자식 요소를 보여주기 위해서는 HomePage에서 outlet을 선언해줘야 함
  },
  
]);
function App() {
  return <RouterProvider router={router}/>;
}

export default App;
