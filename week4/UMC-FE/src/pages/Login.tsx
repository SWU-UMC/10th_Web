import useForm from '../hooks/useForm';
import { validateSignin, type UserSigninInfomation } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { getInputProps, errors, touched, values } = useForm<UserSigninInfomation>({
        initialValues: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
        const ok = await login(values);
        if (ok) navigate('/my');
    }

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    const canSubmit = Object.values(errors).every((error) => error === '');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col w-[300px] gap-4">
                <h1 className="text-2xl font-bold text-center mb-4">로그인</h1>
            
                <div className="flex flex-col gap-1">
                    <input 
                        {...getInputProps('email')}
                        className={`border border-[#ccc] w-full p-[10px] focus:border-[#807bff] outline-none rounded-sm`}
                        type="email"
                        placeholder="이메일"
                    />
                    {errors.email && touched.email && (
                        <p className="text-red-500 text-xs px-1">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        {...getInputProps('password')}
                        className={`border border-[#ccc] w-full p-[10px] focus:border-[#807bff] outline-none rounded-sm`}
                        type="password"
                        placeholder="비밀번호"
                    />
                    {errors.password && touched.password && (
                        <p className="text-red-500 text-xs px-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-full py-3 rounded-md text-lg font-medium transition-all
                        ${canSubmit 
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    로그인
                </button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className={`w-full py-3 rounded-md text-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md`}
                >
                    <div className = "flex items-center justify-center gap-4">
                        <img src="/images/google.svg" alt="Google Login" className="w-5 h-5" />
                        <span>구글 로그인</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Login;

