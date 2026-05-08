import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const  MyPage=()=>{
  const navigate=useNavigate();
  const {logout, userInfo}=useAuth();
    const handleLogout=async()=>{
        await logout();
        navigate('/');
    };
    return (
        <div>
          <h1>{userInfo?.name}님 환영합니다.</h1>
          <h1>{userInfo?.email}</h1>

          <button className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
           onClick={handleLogout}>로그아웃</button>
        </div>
    );
}
export default MyPage;
