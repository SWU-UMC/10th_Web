
import useForm from "../hooks/useForm";
import type { UserSigninInformation } from "../utils/validate";
import { validateSignin } from "../utils/validate";


const LoginPage = () => {
    const {values, errors, touched, getInputProps} = 
    useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
    validate: validateSignin,
});

    const handleSubmit = () => {
        console.log(values);
    };

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
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
