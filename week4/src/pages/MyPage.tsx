import { useEffect, useState } from "react";
import { getMyInfo, type ResponseMyInfoDto } from "../apis/auth"

const MyPage=()=>{
    const [data,setData]=useState<ResponseMyInfoDto | null>(null);
    useEffect(() => {
        const getData = async() =>{
            try{
                const response = await getMyInfo();
                setData(response);
            } catch (error) {
                console.error(error);
            }
        };

        getData();
    }, []);
    return <div>
        {data?.data?.name} {data?.data?.email}
    </div>
}
export default MyPage;