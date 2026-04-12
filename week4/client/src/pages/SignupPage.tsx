import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signupSchema, type SignupFormValues } from '../utils/validate';

interface Ball { id: number; x: number; y: number; vx: number; vy: number; size: number; color: string; }

const SignupPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [step, setStep] = useState(1);

  
  const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm<SignupFormValues>();

  const formData = watch(); 
  const onSignupSubmit = (data: SignupFormValues) => {
   
    const result = signupSchema.safeParse(data);
    
   
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as any, { message: issue.message });
      });
      return;
    }

    
    console.log('회원가입 성공:', data);
    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    navigate('/login');
  };

  
  const handleNext = () => {
    clearErrors();
    const result = signupSchema.safeParse(formData);
    
    if (!result.success) {
      
      const stepErrors = result.error.issues.filter(issue => {
        if (step === 1) return issue.path.includes("email");
        if (step === 2) return issue.path.includes("password") || issue.path.includes("confirmPassword");
        return false;
      });

      if (stepErrors.length > 0) {
        stepErrors.forEach(issue => setError(issue.path[0] as any, { message: issue.message }));
        return; 
      }
    }
    setStep(step + 1);
  };

 
  useEffect(() => {
    const initialBalls: Ball[] = [
      { id: 1, x: 100, y: 100, vx: 3, vy: 2, size: 80, color: 'bg-cyan-400' },
      { id: 2, x: 300, y: 200, vx: -2, vy: 4, size: 120, color: 'bg-pink-400' },
      { id: 3, x: 500, y: 400, vx: 2, vy: -3, size: 60, color: 'bg-yellow-300' },
      { id: 4, x: 200, y: 500, vx: -3, vy: -2, size: 100, color: 'bg-lime-400' },
      { id: 5, x: 600, y: 150, vx: 4, vy: 1, size: 90, color: 'bg-violet-400' },
    ];
    setBalls(initialBalls);
    const animate = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setBalls((prev) => prev.map((b) => {
        let { x, y, vx, vy, size } = b;
        if (x - size / 2 + vx < 0 || x + size / 2 + vx > width) vx *= -1;
        if (y - size / 2 + vy < 0 || y + size / 2 + vy > height) vy *= -1;
        return { ...b, x: x + vx, y: y + vy, vx, vy };
      }));
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-screen relative bg-black overflow-hidden">
      {balls.map((ball) => (
        <div key={ball.id} className={`absolute rounded-full opacity-30 blur-2xl z-0 ${ball.color}`}
          style={{ width: ball.size, height: ball.size, left: ball.x - ball.size / 2, top: ball.y - ball.size / 2 }} />
      ))}

      <div className="w-full max-sm:max-w-[320px] max-w-sm p-10 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl relative z-10">
        <button type="button" onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="absolute top-6 left-6 text-white/50 hover:text-white font-bold">&lt;</button>
        <p className="text-center font-bold text-white/60 tracking-[0.3em] text-xs mb-1 mt-2">DORI</p>
        <h1 className="text-3xl font-extrabold text-center text-white mb-10">회원가입</h1>

        <form onSubmit={handleSubmit(onSignupSubmit)} className="flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input {...register("email")} placeholder="이메일" className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 transition-all ${errors.email ? 'border-red-500' : 'border-white/10 focus:ring-cyan-300'}`} />
                {errors.email && <p className="text-red-400 text-xs ml-1.5">{errors.email.message}</p>}
              </div>
              <button type="button" onClick={handleNext} className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-xl">다음</button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input type="password" {...register("password")} placeholder="비밀번호" className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 transition-all ${errors.password ? 'border-red-500' : 'border-white/10 focus:ring-pink-300'}`} />
                {errors.password && <p className="text-red-400 text-xs ml-1.5">{errors.password.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <input type="password" {...register("confirmPassword")} placeholder="비밀번호 확인" className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:ring-pink-300'}`} />
                {errors.confirmPassword && <p className="text-red-400 text-xs ml-1.5">{errors.confirmPassword.message}</p>}
              </div>
              <button type="button" onClick={handleNext} className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-xl">다음</button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <svg className="w-14 h-14 text-white/20" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
              </div>
              <div className="w-full flex flex-col gap-1.5">
                <input {...register("nickname")} placeholder="닉네임" className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white text-center transition-all ${errors.nickname ? 'border-red-500' : 'border-white/10 focus:ring-green-300'}`} />
                {errors.nickname && <p className="text-red-400 text-xs text-center">{errors.nickname.message}</p>}
              </div>
              <button type="submit" className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg">회원가입 완료</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;