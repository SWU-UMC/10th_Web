import './App.css';
import MoviePage from '../pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import MovieDetailPage from'../pages/MovieDetailPage';




const router=createBrowserRouter([
  {
    path:'/',
    element: <HomePage/>,   //HomePage 기준으로 아래 애들을 보여줌
    errorElement:<NotFoundPage/>,
    children:[
     {
      path:'movies/:category',   //카테고리에 따라 영화를 나누고 싶음
      element:<MoviePage/>,
     },
     {
      
      path:'movies/:category/:movieId',
      element:<MovieDetailPage/>
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
        
    ], //홈페이지를 기준으로 자식 요소를 내려줌, 이 자식 요소를 보여주기 위해서는 HomePage에서 outlet을 선언해줘야 함
  },
  
]);
function App() {
  return <RouterProvider router={router}/>;
}

export default App;
