import {Link, NavLink} from 'react-router-dom'
//여러번 link코드를 짜는걸 방지하기 위해 랩핑함
const LINKS=[
    {to:'/', label: '홈'},
    {to:'/movies/popular', label: '인기 영화'},
    {to:'/movies/now_playing', label: '상영 중'},
    {to:'/movies/top_rated', label: '평점 높은 영화'},
    {to:'/movies/upcoming', label: '개봉 예정'}
]


export default function Navbar() {
  return (
    <div className="flex gap-3 p-4">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive
              ? "text-lg text-blue-500 hover:text-blue-700 font-bold"
              : "text-gray-500"
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
