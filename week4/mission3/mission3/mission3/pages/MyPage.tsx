import { useEffect } from "react";
import { getMyInf0 } from "../src/apis/auth";

const  MyPage=()=>{
    useEffect(()=>{
        const getData=async()=>{
            const response=await getMyInf0();
            console.log(response);
        };
        getData();
    
    },[]);
    
  return (
    <div>MyPage</div>
  )
}
export default MyPage;
