import { useEffect, useState } from "react";
import { getMyInfo, type ResponseMyInfoDto } from "../apis/auth"

const MyPage=()=>{
    const [data,setData]=useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async() =>{
            const response = await getMyInfo();
            console.log(response);
        };

        getData();
    }, [])
    return <div>
        {data?.data?.name} {data?.data?.email}
    </div>
}
export default MyPage;