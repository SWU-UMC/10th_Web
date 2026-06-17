import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainSearchPage from './pages/MainSearchPage'; 
import MovieDetailPage from './pages/MovieDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 검색 페이지 */}
        <Route path="/" element={<MainSearchPage />} /> 
        
        {/* 상세 페이지 라우팅 */}
        <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;