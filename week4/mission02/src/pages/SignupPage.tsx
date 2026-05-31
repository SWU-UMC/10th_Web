import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";


const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, {
      message: "비밀번호는 8자 이상이어야 합니다."
    })
    .max(20, {
      message: "비밀번호는 20자 이하여야 합니다."
    }),
  passwordCheck: z
    .string()
    .min(8, {
      message: "비밀번호는 8자 이상이어야 합니다."
    })
    .max(20, {
      message: "비밀번호는 20자 이하여야 합니다."
    }),
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
})
.refine((data) => data.password === data.passwordCheck, {
      message: "비밀번호가 일치하지 않습니다.",
      path:['passwordCheck'],
});

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async(data) => {
    const {passwordCheck, ...rest} = data;

    const response = await postSignup(rest);

    console.log(response);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4">
      <div className="w-full max-w-xs flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">새로운 계정</h1>

        <div className="flex flex-col gap-3">
          <input //이메일 칸
            {...register("email")}
            className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="email"
            placeholder="이메일"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}

          <input //비밀번호 칸
            {...register("password")}
            className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="password"
            placeholder="비밀번호"
          />
            {errors.password && (
            <div className="text-red-500 text-sm">{errors.password.message}</div>
          )}

          <input //비밀번호 확인 칸
            {...register("passwordCheck")}
            className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="password"
            placeholder="비밀번호 확인"
          />
          {errors.passwordCheck && (
            <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
          )}

          <input //이름 칸
            {...register("name")}
            className={`"w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="name"
            placeholder="이름"
          /> 
            {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}

          <button
            disabled={isSubmitting}
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
          회원가입
          </button>
        </div>
      </div>
    </div>
  )

}

export default SignupPage;