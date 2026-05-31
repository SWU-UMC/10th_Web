import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar/Sidebar"; 
import { useSideBar } from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSideBar();

  return (
    <div className="h-dvh flex flex-col">
        <Navbar onMenuClick={toggle} />
        <Sidebar isOpen={isOpen} onClose={close} />

        <main className="flex-1 pt-15">
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default HomeLayout;