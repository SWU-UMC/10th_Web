import './App.css';
import MoviePage from '../pages/MoviePage';

function App() {
  console.log(import.meta.env.VITE_TMDB_KEY);   // 콘솔에 환경변수 출력
  return (
    <>
      <MoviePage/>
    </>
  );//MoviePage 연결
}

export default App;
