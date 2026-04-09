import type { UserSigninInformation } from "../pages/utils/validate";
import { validateSignin } from "../pages/utils/validate";
import {useState} from "react";
import useForm from "../hooks/useForm"

const LoginPage=()=> {
    const {values, errors, touched, getInputProps}=useForm<UserSigninInformation>({
        initialValue:{
            email:"",
            password:"",
        },
        validate: validateSignin,
    });
    const handleSubmit=()=>{};
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input 
                {...getInputProps("email")}
                type={"email"} className={"border border-[#ccc] w-[300px] p-[10px] focus: border-[#807bff] rounded-sm"} 
                placeholder={"이메일"}/>
                {errors?.email && touched?.email &&(<div className="text-red-500 text-sm">{errors.email}</div>)}
                <input
                {...getInputProps("password")}
                type={"password"} className={"border border-[#ccc] w-[300px] p-[10px] focus: border-[#807bff] rounded-sm"} 
                placeholder={"비밀번호"}/>
                <button type="button" onClick={handleSubmit} disabled={false} className="w-full bg-green-600 text-white py-3 rounded-md text-lg font-medium hover: bg-green-700 transition-colors cursor-pointer disabled:bg-gray-300">
                    로그인</button>  
            </div>
        </div>
    );//로그인 하기 전에는 false여서 녹색, 하고 나서는 true 여서 회색
};

export default LoginPage;
