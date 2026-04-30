
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseSignupDto,
  ResponseSigninDto,
  ResponseMyInfoDto
} from "../types/auth.ts";
import {axiosInstance} from "../types/axios.ts"
export const postSignup=async(body: RequestSignupDto):Promise<ResponseSignupDto>=>{
    const {data}=await axiosInstance.post("/v1/auth/signup",
        body);
    return data;
};
export const postSignin=async(body: RequestSigninDto):Promise<ResponseSigninDto>=>{
    const {data}=await axiosInstance.post("/v1/auth/signin", body);
    
    return data;
};
export const getMyInf0=async():Promise<ResponseMyInfoDto>=>{
    const {data}=await axiosInstance.get("/v1/users/me",{
        
    });
    
    return data;
};
