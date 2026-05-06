import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { type LoginFormValues } from '../utils/validate';
import { useBallAnimation } from '../hooks/useBallAnimation';

const LoginPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const balls = useBallAnimation(containerRef); 

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

 
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/signin', data);
      if (response.data.status) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        
    
        localStorage.setItem('nickname', response.data.data.name); 
        
        alert(`${response.data.data.name}님 환영합니다!`);
        navigate('/'); // 메인으로 이동
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '로그인 실패');
    }
  };

 
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-black overflow-hidden">
      {balls.map((ball) => (
        <div key={ball.id} className={`absolute rounded-full opacity-30 blur-2xl z-0 ${ball.color}`}
          style={{ width: ball.size, height: ball.size, left: ball.x - ball.size / 2, top: ball.y - ball.size / 2 }} />
      ))}
      
      <div className="w-full max-w-sm p-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl relative z-10">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-white/50 hover:text-white font-bold">&lt;</button>
        <p className="text-center font-bold text-white/60 tracking-[0.3em] text-xs mt-2">DORI</p>
        <h1 className="text-3xl font-extrabold text-center text-white mb-8">로그인</h1>
        
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full p-4 mb-6 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
        >
          <img src="/google_logo.svg" width="20" alt="google" />
          구글로 시작하기
        </button>

        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/20"></div>
          <span className="text-white/40 text-sm font-bold">OR</span>
          <div className="flex-1 h-[1px] bg-white/20"></div>
        </div>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="flex flex-col gap-4">
          <input {...register("email")} placeholder="이메일" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-300" />
          {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          
          <input type="password" {...register("password")} placeholder="비밀번호" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-300" />
          {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          
          <button type="submit" className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30">로그인</button>
          <button type="button" onClick={() => navigate('/signup')} className="text-center text-white/40 text-sm hover:text-white mt-2">회원가입 하러가기</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;