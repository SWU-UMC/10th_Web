import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import type { UserSigninInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [navigate, accessToken]);
    
    
    const {values, errors, touched, getInputProps} = 
    useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
    validate: validateSignin,
});

    const handleSubmit = async () => {
            await login(values);
    };

    const handleGoogleLogin = () => {
        window.location.href = 
            import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    // 오류가 있거나 입력값이 비어있을때 버튼 비활성화
    const isDisabled = 
    Object.values(errors || {}).some((error: any) => error.length > 0) ||
    Object.values(values).some((value) => value === ""); 

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4">
            <div className="w-full max-w-xs flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">로그인</h1>
                
                <div className="flex flex-col gap-3">
                    <input
                        {...getInputProps("email")}
                        name="email"
                        className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        type="email"
                        placeholder="이메일"
                    />
                   {errors?.email && touched?.email && (
                    <div className="text-red-500 text-rm">{errors.email}</div>
                   )}
                    <input
                        {...getInputProps("password")}
                        className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        type="password"
                        placeholder="비밀번호"
                    />
                    {errors?.password && touched?.password && (
                    <div className="text-red-500 text-rm">{errors.password}</div>
                   )}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isDisabled}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                    로그인
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                         // disabled={isDisabled}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                    <div className="flex items-center justify-center gap-4">
                        <img 
                            src={"/images/google.svg"}
                            alt="Google Icon"
                            />
                        <span>구글 로그인</span>
                    </div>
                    </button>
                    
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
