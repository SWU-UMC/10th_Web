import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MoviePage from './pages/MoviePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />, // 에러 발생 시 보여줄 페이지
    children: [
      {
        path: 'movies/:category', // 동적 라우팅 (popular, upcoming 등)
        element: <MoviePage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;