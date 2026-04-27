import { NavLink } from "react-router-dom";

const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movie/popular', label: '인기 영화' },
    { to: '/movie/now_playing', label: '상영중' },
    { to: '/movie/top_rated', label: '평점 높은' },
    { to: '/movie/upcoming', label: '개봉 예정' },
];

export const Navbar = () => {
    return (
        <div className='flex gap-3 p-4'>
            {LINKS.map(({to, label}) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => 
                        isActive ? 'text-[#b2dab1] font-bold' : 'text-gray-500'
                    }>
                    {label}
                </NavLink>
            ))}
        </div>
    );
};