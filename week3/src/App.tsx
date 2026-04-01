import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1) 만든 페이지 import
import HomePage from './pages/home';
import NotFound from './pages/not-found';
import Popular from './pages/popular';
import NowShowing from './pages/now-showing';
import TopRated from './pages/top-rated';
import Upcoming from './pages/upcoming';
import RootLayout from './layout/root-layout';

// 2) 라우터에 연결
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'popular',
        element: <Popular />,
      },
      {
        path: 'now-showing',
        element: <NowShowing />,
      },
      {
        path: 'top-rated',
        element: <TopRated />,
      },
      {
        path: 'upcoming',
        element: <Upcoming />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
