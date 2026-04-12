// client/src/pages/LoginPage.tsx 최종본
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { validateLogin } from '../utils/validate';

// 벽에 튕기는 공 타입 정의
interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);

  // 커스텀 훅 가져오기 (이전 코드와 동일)
  const { values, errors, touched, getTextInputProps } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
  });

  const isDisabled = Object.keys(errors).length > 0 || values.email === '' || values.password === '';

  // 🔮 힙한 네온 공 5개 초기화 & 벽에 튕기는 로직 구현!
  useEffect(() => {
    // 공 5개 초기 세팅 (랜덤 위치, 랜덤 속도)
    const initialBalls: Ball[] = [
      { id: 1, x: 100, y: 100, vx: 3, vy: 2, size: 80, color: 'bg-cyan-400' },
      { id: 2, x: 300, y: 200, vx: -2, vy: 4, size: 120, color: 'bg-pink-400' },
      { id: 3, x: 500, y: 400, vx: 2, vy: -3, size: 60, color: 'bg-yellow-300' },
      { id: 4, x: 200, y: 500, vx: -3, vy: -2, size: 100, color: 'bg-lime-400' },
      { id: 5, x: 600, y: 150, vx: 4, vy: 1, size: 90, color: 'bg-violet-400' },
    ];
    setBalls(initialBalls);

    // 튕기는 애니메이션 로직
    const animate = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy, size } = ball;
          const radius = size / 2;

          // x축 벽 충돌 검사
          if (x - radius + vx < 0 || x + radius + vx > width) vx *= -1;
          // y축 벽 충돌 검사
          if (y - radius + vy < 0 || y + radius + vy > height) vy *= -1;

          return { ...ball, x: x + vx, y: y + vy, vx, vy };
        })
      );
      requestAnimationFrame(animate); // 다음 프레임 요청
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId); // 컴포넌트 언마운트 시 애니메이션 정지
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      console.log('로그인 성공! 보낼 데이터:', values);
    }
  };

  return (
    // 🔮 배경: 심해처럼 깊은 남색 그라데이션
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-[radial-gradient(circle_at_center,#101525_0%,#000000_100%)] overflow-hidden">
      
      {/* 🔮 미션 2. 벽에 튕겨다니는 힙한 네온 공들 */}
      {balls.map((ball) => (
        <div
          key={ball.id}
          className={`absolute rounded-full opacity-30 blur-2xl z-0 ${ball.color}`}
          style={{
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            left: `${ball.x - ball.size / 2}px`,
            top: `${ball.y - ball.size / 2}px`,
            transition: 'transform 0.1s linear', // 부드러운 이동을 위한 약간의 트랜지션
          }}
        />
      ))}
      
      {/* 🔮 미션 1. 진짜 '유리 컴포넌트' 로그인 카드 */}
      {/* (backdrop-blur-xl: 강력한 유리 서리 효과, border-white/20: 반투명 네온 테두리) */}
      <div className="w-full max-w-sm p-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 transition-all duration-300">
        
        {/* 뒤로 가기 버튼 (<) */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white/50 hover:text-white font-bold text-lg transition-colors"
        >
          &lt;
        </button>

        {/* 로고 & 타이틀 */}
        <p className="text-center font-bold text-white/60 tracking-[0.3em] text-xs mb-1 mt-2">DORI</p>
        <h1 className="text-3xl font-extrabold text-center text-white mb-10 tracking-tight">로그인</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* 이메일 입력 폼 */}
          <div className="flex flex-col gap-1.5">
            <input
              type="email"
              placeholder="이메일"
              // 유리 느낌의 반투명 인풋창 (focus시 네온 민트 테두리)
              className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 placeholder:text-white/30 transition-all duration-200 ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-white/10 focus:ring-cyan-300'
              }`}
              {...getTextInputProps('email')}
            />
            {errors.email && touched.email && (
              <p className="text-red-400 text-xs ml-1.5">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 폼 */}
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="비밀번호"
              // 유리 느낌의 반투명 인풋창 (focus시 네온 핑크 테두리)
              className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 placeholder:text-white/30 transition-all duration-200 ${
                errors.password && touched.password
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-white/10 focus:ring-pink-300'
              }`}
              {...getTextInputProps('password')}
            />
            {errors.password && touched.password && (
              <p className="text-red-400 text-xs ml-1.5">{errors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 (사파이어 네온 스타일) */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full p-4 mt-6 font-bold rounded-xl transition-all duration-300 ${
              isDisabled
                ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)]'
            }`}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;