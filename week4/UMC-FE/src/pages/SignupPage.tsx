import {z} from "zod"; 
import {useForm, type SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { data } from "react-router-dom";
import { is } from "zod/locales";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
    password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    passwordCheck: z
    .string()
    .min(8, { message: "비밀번호 확인은 최소 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호 확인은 최대 20자 이하여야 합니다." }),
    name: z.string().min(2, { message: "이름은 최소 2자 이상이어야 합니다." })
})
.refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const { register, handleSubmit, trigger, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        defaultValues: { name: "", email: "", password: "", passwordCheck: "" },
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const emailValue = watch("email");
    const passwordValue = watch("password");
    const passwordCheckValue = watch("passwordCheck");

    const nextStep = async (fields: (keyof FormFields)[]) => {
        const isValid = await trigger(fields);
        if (isValid) setStep((prev) => prev + 1);
    };

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const { passwordCheck, ...rest } = data;
        try {
            await postSignup(rest);
            alert("회원가입이 완료되었습니다!");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col w-[300px] gap-6">
                <h1 className="text-2xl font-bold text-center mb-2">회원가입</h1>
                
                {step > 1 && (
                    <div className="text-sm text-gray-500 border-b pb-2">
                        <p>이메일: {emailValue}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    
                    {step === 1 && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">이메일 주소</label>
                            <input 
                                {...register('email')}
                                className="border border-[#ccc] w-full p-[10px] focus:border-[#807bff] outline-none rounded-sm"
                                type="email"
                                placeholder="이메일을 입력하세요"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            <button
                                type="button"
                                onClick={() => nextStep(['email'])}
                                disabled={!emailValue || !!errors.email}
                                className="mt-4 bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-300"
                            >
                                다음
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">비밀번호</label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        className="border border-[#ccc] w-full p-[10px] pr-10 focus:border-[#807bff] outline-none rounded-sm"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="비밀번호 (8~20자)"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-3 top-3 w-5 h-5 rounded-full border-2 transition-colors 
                                            ${showPassword ? "bg-[#807bff] border-[#807bff]" : "bg-white border-gray-300"}`}
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">비밀번호 확인</label>
                                <div className="relative">
                                    <input
                                        {...register('passwordCheck')}
                                        className="border border-[#ccc] w-full p-[10px] pr-10 focus:border-[#807bff] outline-none rounded-sm"
                                        type={showPasswordCheck ? "text" : "password"}
                                        placeholder="비밀번호 다시 입력"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                        className={`absolute right-3 top-3 w-5 h-5 rounded-full border-2 transition-colors 
                                            ${showPasswordCheck ? "bg-[#807bff] border-[#807bff]" : "bg-white border-gray-300"}`}
                                    />
                                </div>
                                {errors.passwordCheck && <p className="text-red-500 text-xs">{errors.passwordCheck.message}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={() => nextStep(['password', 'passwordCheck'])}
                                disabled={!passwordValue || !passwordCheckValue || !!errors.password || !!errors.passwordCheck}
                                className="mt-2 bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-300"
                            >
                                다음
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">이름</label>
                            <input 
                                {...register('name')}
                                className="border border-[#ccc] w-full p-[10px] focus:border-[#807bff] outline-none rounded-sm"
                                type="text"
                                placeholder="이름을 입력하세요"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting || !!errors.name}
                                className="w-full py-3 rounded-md text-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md disabled:bg-gray-300 disabled:text-gray-500"
                            >
                                회원가입 완료
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignupPage;