import { useEffect } from "react";
import { getMyInfo } from "../apis/auth";

const MyPage = () => {
    useEffect(() => {
        const getData = async() => {
            const response = await getMyInfo();
            console.log(response);
        }

        getData();
    }, []);
    return (
        <div>
            <h1>My Page</h1>
        </div>
    );
}

export default MyPage;