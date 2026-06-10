import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const HomeLayout = () => {
    const { accessToken, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* 1. 사이드바 (Sidebar) */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transform transition-transform duration-300 ease-in-out shadow-2xl
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* 사이드바 로고 영역 */}
                    <div className="p-6 border-b border-slate-700">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
                            LP <span className="text-blue-400">LIST</span>
                        </Link>
                    </div>

                    {/* 메뉴 리스트 */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link 
                            to="/lps" 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="fa-solid fa-compact-disc"></i>
                            <span className="font-medium">LP 목록</span>
                        </Link>

                        {/* 마이페이지 버튼 */}
                        <Link 
                            to="/my" 
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="fa-solid fa-user"></i>
                            <span className="font-medium">마이페이지</span>
                        </Link>
                    </nav>

                    {/* 사이드바 하단 정보 */}
                    <div className="p-4 bg-slate-900/50">
                        <p className="text-xs text-slate-400 text-center">© 2026 LP Management</p>
                    </div>
                </div>
            </aside>

            {/* 모바일 사이드바 배경 */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 md:hidden" 
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* 헤더 (Header) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar} 
                            className="text-gray-600 hover:text-gray-900 md:hidden focus:outline-none"
                        >
                            <svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                            </svg>
                        </button>
                        <h2 className="hidden md:block text-lg font-semibold text-gray-800 uppercase tracking-wider">Dashboard</h2>
                    </div>

                    {/* 우측 유저 정보/로그인 버튼 */}
                    <div className="flex items-center gap-4">
                        {accessToken ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                                    반갑습니다, <span className="text-blue-600 font-bold">소윤</span>님
                                </span>
                                <button 
                                    onClick={logout} 
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all rounded-md">로그인</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md">회원가입</Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* 실제 페이지 내용 */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomeLayout;