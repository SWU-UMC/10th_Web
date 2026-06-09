import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";

// 1. Zod 스키마 정의 (영상 05:00~07:15 & 정제 매칭)
const signUpSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
  passwordCheck: z.string().min(6, "비밀번호 재확인은 필수 입력 항목입니다."),
  name: z.string().min(1, "닉네임을 입력해주세요!"),
}).refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordCheck"],
});

type SignUpFields = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const navigate = useNavigate();
  // 💡 전역 AuthContext 감시 센터 우산에서 회원가입 핸들러 함수를 가져옵니다.
  const { signup } = useAuth();
  
  // 3단계 스텝 관리 상태 관리 ('EMAIL' -> 'PASSWORD' -> 'PROFILE')
  const [step, setStep] = useState<"EMAIL" | "PASSWORD" | "PROFILE">("EMAIL");
  const [showPassword, setShowPassword] = useState(false); // 눈동자 토글 제어

  // 2. React Hook Form 연동 (영상 07:35 ~ 09:35 구조 그대로 반영)
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // 실시간 검증을 위해 모드 주입 (영상 14:50)
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
  });

  // 입력값 감시
  const currentEmail = watch("email");
  const currentPassword = watch("password");
  const currentPasswordCheck = watch("passwordCheck");
  const currentName = watch("name");

  // 각 단계별 유효성 검사 통과 여부에 따른 버튼 활성화 트리거 변수들
  const isEmailValid = currentEmail && !errors.email;
  const isPasswordValid = currentPassword && currentPasswordCheck && !errors.password && !errors.passwordCheck;
  const isProfileValid = currentName && !errors.name;

  // 다음 스텝 클릭 처리 핸들러
  const handleNextStep = async (fields: ("email" | "password" | "passwordCheck")[]) => {
    const isValid = await trigger(fields);
    if (isValid) {
      if (step === "EMAIL") setStep("PASSWORD");
      else if (step === "PASSWORD") setStep("PROFILE");
    }
  };

  // 최종 폼 제출 (AuthContext 내부 로직과 깔끔하게 연결)
  const onSubmitForm = async (data: SignUpFields) => {
    try {
      // 💡 토큰 저장 및 상태 처리는 AuthContext의 signup 내부에서 완벽하게 처리됩니다.
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      // 가입 및 로그인 절차가 정상 완료되면 홈으로 이동시킵니다.
      navigate("/");
      
    } catch (error) {
      console.error("회원가입 에러:", error);
    }
  };

  return (
    <div className="w-[360px] px-4 flex flex-col gap-6">
      
      {/* 상단 네비 바 */}
      <div className="relative flex justify-center items-center w-full">
        <button
          type="button"
          onClick={() => {
            if (step === "PROFILE") setStep("PASSWORD");
            else if (step === "PASSWORD") setStep("EMAIL");
            else navigate(-1);
          }}
          className="absolute left-0 text-gray-400 hover:text-white text-xl cursor-pointer"
        >
          &lt;
        </button>
        <h2 className="text-md font-semibold text-center tracking-wide">회원가입</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-6">
        
        {/* STEP 1: 이메일 입력 단계 */}
        {step === "EMAIL" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium pl-1">이메일 주소</label>
              <input
                type="email"
                placeholder="이메일을 입력해주세요!"
                className={`w-full bg-[#1c1c1e] border rounded-lg p-3 text-sm focus:outline-none ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-gray-800 focus:border-[#ff2a85]"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs pl-1 font-medium">{errors.email.message}</span>
              )}
            </div>

            <button
              type="button"
              disabled={!isEmailValid}
              onClick={() => handleNextStep(["email"])}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                isEmailValid ? "bg-[#ff2a85] text-white cursor-pointer" : "bg-[#1c1c1e] text-gray-500 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {/* STEP 2: 비밀번호 설정 단계 */}
        {step === "PASSWORD" && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* 상단 이메일 정보 노출 */}
            <div className="text-sm text-gray-400 pl-1">
              이메일: <span className="text-white font-medium">{currentEmail}</span>
            </div>

            {/* 비밀번호 입력란 */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs text-gray-400 font-medium pl-1">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요!"
                  className={`w-full bg-[#1c1c1e] border rounded-lg p-3 pr-10 text-sm focus:outline-none ${
                    errors.password ? "border-red-500" : "border-gray-800 focus:border-[#ff2a85]"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm cursor-pointer"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs pl-1 font-medium">{errors.password.message}</span>
              )}
            </div>

            {/* 비밀번호 재확인 입력란 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium pl-1">비밀번호 재확인</label>
              <input
                type="password"
                placeholder="비밀번호를 한 번 더 입력해주세요!"
                className={`w-full bg-[#1c1c1e] border rounded-lg p-3 text-sm focus:outline-none ${
                  errors.passwordCheck ? "border-red-500" : "border-gray-800 focus:border-[#ff2a85]"
                }`}
                {...register("passwordCheck")}
              />
              {errors.passwordCheck && (
                <span className="text-red-500 text-xs pl-1 font-medium">{errors.passwordCheck.message}</span>
              )}
            </div>

            <button
              type="button"
              disabled={!isPasswordValid}
              onClick={() => handleNextStep(["password", "passwordCheck"])}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                isPasswordValid ? "bg-[#ff2a85] text-white cursor-pointer" : "bg-[#1c1c1e] text-gray-500 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {/* STEP 3: 프로필 및 닉네임 설정 단계 */}
        {step === "PROFILE" && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            {/* 프로필 이미지 UI (미션 조건: 시각적 UI만 완성도 있게 배치) */}
            <div className="flex flex-col items-center gap-2 my-2">
              <div className="w-20 h-20 bg-[#2c2c2e] rounded-full border border-gray-700 flex justify-center items-center relative overflow-hidden group">
                <span className="text-2xl text-gray-400">👤</span>
                <div className="absolute inset-0 bg-black/40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-xs text-gray-300">편집</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">프로필 사진 설정 (선택)</span>
            </div>

            {/* 닉네임 입력 필드 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium pl-1">닉네임</label>
              <input
                type="text"
                placeholder="닉네임을 입력해주세요!"
                className={`w-full bg-[#1c1c1e] border rounded-lg p-3 text-sm focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-800 focus:border-[#ff2a85]"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-xs pl-1 font-medium">{errors.name.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isProfileValid || isSubmitting}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                isProfileValid && !isSubmitting
                  ? "bg-[#ff2a85] text-white cursor-pointer hover:bg-[#e02074]"
                  : "bg-[#1c1c1e] text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "회원가입 처리 중..." : "회원가입 완료"}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}