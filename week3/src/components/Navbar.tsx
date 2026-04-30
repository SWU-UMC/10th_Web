import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: '/movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '평점 높은' },
    { to: '/movies/upcoming', label: '개봉 예정' },
  ];

  return (
    <nav className="flex gap-4 p-4 bg-gray-900">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? 'text-[#bedab1] font-bold' : 'text-gray-500 hover:text-white'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}