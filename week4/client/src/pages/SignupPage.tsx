import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signupSchema, type SignupFormValues } from '../utils/validate';
import { useBallAnimation } from '../hooks/useBallAnimation'; 
import api from '../apis/axios'; 

const SignupPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  
  const balls = useBallAnimation(containerRef);

  const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm<SignupFormValues>();
  const formData = watch(); 

  
  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      
      const response = await api.post('/auth/signup', {
        name: data.nickname, 
        email: data.email,
        password: data.password,
      });

      if (response.data.status) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } catch (error: any) {
      
      const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      alert(message);
    }
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
          {/* 1단계: 이메일 */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input {...register("email")} placeholder="이메일" className={`w-full p-4 bg-white/5 border rounded-xl outline-none text-white focus:ring-2 transition-all ${errors.email ? 'border-red-500' : 'border-white/10 focus:ring-cyan-300'}`} />
                {errors.email && <p className="text-red-400 text-xs ml-1.5">{errors.email.message}</p>}
              </div>
              <button type="button" onClick={handleNext} className="w-full p-4 mt-2 bg-blue-600 text-white font-bold rounded-xl">다음</button>
            </div>
          )}

          {/* 2단계: 비밀번호 */}
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

          {/* 3단계: 닉네임 */}
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