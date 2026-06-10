import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const linkStyle = "text-sm font-medium transition-colors hover:text-gray-900";
    const activeStyle = "text-green-500 font-bold"; 

    return (
        <nav className="flex items-center gap-6 p-4 border-b border-gray-100 bg-white sticky top-0 z-50">
            <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : "text-gray-400"}`}>
                홈
            </NavLink>
            <NavLink to="/popular" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : "text-gray-400"}`}>
                인기 영화
            </NavLink>
            <NavLink to="/now-showing" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : "text-gray-400"}`}>
                상영 중
            </NavLink>
            <NavLink to="/top-rated" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : "text-gray-400"}`}>
                평점 높은
            </NavLink>
            <NavLink to="/upcoming" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : "text-gray-400"}`}>
                개봉 예정
            </NavLink>
        </nav>
    );
};

export default Navbar;