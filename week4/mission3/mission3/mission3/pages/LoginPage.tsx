import type { UserSigninInformation } from "../pages/utils/validate";
import { validateSignin } from "../pages/utils/validate";
import {postSignin} from "../src/apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useForm from "../hooks/useForm"
import{LOCAL_STORAGE_KEY} from "../src/constants/key";


const LoginPage=()=> {
    const { setItem }=useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {values, errors, touched, getInputProps}=useForm<UserSigninInformation>({
        initialValue:{
            email:"",
            password:"",
        },
        validate: validateSignin,
    });
    const handleSubmit=async()=>{
        console.log(values);
        try{
            const response=await postSignin(values);
            //토큰 저장
            setItem(response.data.accessToken);
            console.log(response);
        }catch(error: any){
        alert(error?.message);}
        
    };
    
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
