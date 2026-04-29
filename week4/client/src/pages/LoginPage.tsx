import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { validateLogin } from '../utils/validate';
import { useBallAnimation } from '../hooks/useBallAnimation'; // 훅 가져오기

const LoginPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  
  const balls = useBallAnimation(containerRef);

  const { values, errors, touched, getTextInputProps } = useForm({
    initialValues: { email: '', password: '' },
    validate: validateLogin,
  });

  const isDisabled = 
  errors.email !== '' || 
  errors.password !== '' || 
  values.email === '' || 
  values.password === '';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      console.log('로그인 성공! 데이터:', values);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-[radial-gradient(circle_at_center,#101525_0%,#000000_100%)] overflow-hidden">
      
      
      {balls.map((ball) => (
        <div
          key={ball.id}
          className={`absolute rounded-full opacity-30 blur-2xl z-0 ${ball.color}`}
          style={{
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            left: `${ball.x - ball.size / 2}px`,
            top: `${ball.y - ball.size / 2}px`,
            transition: 'transform 0.1s linear',
          }}
        />
      ))}
      
      <div className="w-full max-w-sm p-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-10 transition-all duration-300">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white/50 hover:text-white font-bold text-lg transition-colors"
        >
          &lt;
        </button>

        <p className="text-center font-bold text-white/60 tracking-[0.3em] text-xs mb-1 mt-2">DORI</p>
        <h1 className="text-3xl font-extrabold text-center text-white mb-10 tracking-tight">로그인</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <input
              type="email"
              placeholder="이메일"
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

          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="비밀번호"
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