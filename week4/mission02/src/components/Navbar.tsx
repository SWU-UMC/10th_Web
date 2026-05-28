import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken } = useAuth();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        navigate(`/?q=${value}`, { replace: true }); 
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
            <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                    <button 
                        onClick={onMenuClick}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link 
                        to="/"
                        className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                        돌려돌려LP판
                    </Link>
                </div>
                <div className="space-x-6">
                    {!accessToken && (
                        <> 
                        <Link
                        to="/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                        로그인
                        </Link>
                        <Link
                            to="/signup"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                        >
                        회원가입
                        </Link>
                        </>
                    )}
                    {accessToken && (
                        <>
                            <Link 
                            to="/Mypage"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                            >
                            마이페이지
                            </Link>
                            <input 
                                className="border p-2 rounded-sm" 
                                placeholder="검색"
                                value={search} 
                                onChange={handleSearch} 
                            /> 
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;