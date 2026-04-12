import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// 💡 주의: import './App.css' 가 있다면 지워주기!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소(/)로 들어가도 로그인 페이지가 나오게 설정 */}
        <Route path="/" element={<LoginPage />} />
        
        {/* 나중에 /login 주소로 분리할 때를 대비한 설정 */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;