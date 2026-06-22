import type { PaginationDto } from "../types/common";
import { axiosInstance } from "./axios.ts";
import type { ResponseLpListDto } from "../types/lp";
export const getLpList=async(paginationDto:PaginationDto):Promise<ResponseLpListDto>=>{
    const{data}=await axiosInstance.get('v1.lps',{
        params: paginationDto
    }); //GET요청을 보내 주소와 함께 paginationDto를 쿼리 파라미터로 전달함. 
    return data; //데이터만 반환
};//paginationDto를 받아 데이터를 얼마나 가져올지, 어디서부터 가져올지, 검색어는 뭔지, 정렬 방식은 뭔지 등을 서버에 전달함. 
//Promise<> 부분이 함수가 어떤 데이터를 반환하는지 계약서처럼 명확하게 적어주는 것