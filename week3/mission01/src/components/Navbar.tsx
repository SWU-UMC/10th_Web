import { NavLink } from "react-router-dom";

const LINKS = [
    { name: "홈", path: "/" },
    { name: "인기 영화", path: "/movies/popular" },
    { name: "상영 중", path: "/movies/now_playing" },
    { name: "개봉 예정", path: "/movies/upcoming" },
    { name: "높은 평점", path: "/movies/top_rated" },
];

export const Navbar = () => {
    return (
        <div className="flex gap-3 p-4">
            {LINKS.map(({ name, path }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => {
                        return isActive ? "text-[#dda5e3] font-bold" : "text-gray-500"; 
                    }}
                >
                    {name}
                </NavLink>
            ))}
        </div>
    );
}