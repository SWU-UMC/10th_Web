import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { useSideBar } from "../hooks/useSidebar"; 

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const { isOpen, toggle, close } = useSideBar();

    if (!accessToken) {
        return (
            <Navigate to={"/login"}replace />
        );
    }

    return (
        <div className="h-dvh flex flex-col">
            <Navbar onMenuClick={toggle} />
            <Sidebar isOpen={isOpen} onClose={close} />
            
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default ProtectedLayout;