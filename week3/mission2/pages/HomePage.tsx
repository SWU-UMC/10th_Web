import {Outlet} from 'react-router-dom'
import Navbar from '../components/Navbar'
const HomePage=()=> {
  return (
    <>
        <Navbar/>   
        <Outlet/>
    </>
  ) //메뉴바는 항상 위에 고정, 
};
export default HomePage;
