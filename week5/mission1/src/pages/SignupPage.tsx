import {z} from "zod";
import {useForm} from "react-hook-form";
import type {SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import{postSignup}from "../apis/auth";


const schema=z.object({
  email:z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
  password: z.string().min(8, {
    message: "비밀번호는 8자 이상이어야 한다",
  }).max(20, {
    message: "비밀번호는 20자 이하여야 한다",
  }),
  passwordCheck:
  z.string().min(8, {
    message: "비밀번호는 8자 이상이어야 한다",
  }).max(20, {
    message: "비밀번호는 20자 이하여야 한다",
  }),
  name:z.string().min(1, {message: "이름을 입력해주세요"})
  ,
})
.refine((data)=>data.password===data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다",
    path: ['passwordCheck'],
});

type FormFields=z.infer<typeof schema>

const SignupPage = () => {
  const {register, handleSubmit, formState:{errors, isSubmitting},}=useForm<FormFields>({
    defaultValues:{
      name:"",
      email:"",
      password:"",
    },
    resolver:zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit:SubmitHandler<FormFields>=async(data)=>{
    //passwordcheck 값은 안 보내고 싶을 때(그걸 빼고)
    const{passwordCheck, ... rest}=data;
    const response=await postSignup({
  ...rest,
  avatar: "",});
    
    console.log(response);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">

        <input 
          {...register("email")}
          type={"email"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
          ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"이메일"}
        />

        {errors.email&&(
          <div className={'text-red-500 text-sm'}>{errors.email.message}</div>
        )}

        <input
          {...register("password")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
          ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
          placeholder={"비밀번호"}
        />
        {errors.password&&(
          <div className={'text-red-500 text-sm'}>{errors.password.message}</div>
        )}
        <input
          {...register("passwordCheck")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
          ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`} 
          placeholder={"비밀번호 확인"}
        />
        {errors.passwordCheck&&(
          <div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>
        )}

        <input
          {...register("name")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
          ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"이름"}
        />
        {errors.name&&(
          <div className={'text-red-500 text-sm'}>{errors.name.message}</div>
        )}

        <button
          disabled={isSubmitting}
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-green-600 text-white py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:bg-gray-300"
        >
          회원가입
        </button>  

      </div>
    </div>
  );
};

export default SignupPage;