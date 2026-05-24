import { useEffect } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean; 
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    return (
        <div 
            className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            onClick={onClose}
        >
            <aside 
                className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h2 className="text-xl font-bold dark:text-white">돌려돌려LP판</h2>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <Link to="/Mypage" onClick={onClose} className="text-lg hover:text-blue-500 dark:text-gray-300">👤 마이페이지</Link>
                        <Link to="/search" onClick={onClose} className="text-lg hover:text-blue-500 dark:text-gray-300">🔍 찾기</Link>
                    </nav>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
