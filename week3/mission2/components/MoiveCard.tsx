import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieCardProps {
    movie: Movie;
    category?: string;
}
    
//onMouseEnter은 영화 카드에 마우스가 올라갔는지 여부에 따라 isHovered 상태를 true로 변경하는 이벤트 핸들러, onMouseLeave는 마우스가 영화 카드에서 떠났을 때 isHovered 상태를 false로 변경
export default function MovieCard({ movie, category }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false); //영화 카드에 마우스가 올라갔는지(hover) 여부를 상태로 관리
    const navigate=useNavigate();

    return( 
    <div
    onClick={() => navigate(`/movies/${category}/${movie.id}`)}
    className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-44 transition-transform duration-300 hover:scale-105" //absoulte는 무조건 나를 따르라는 뜻, 영화 포스터 위에 영화 제목과 개요가 겹쳐서 보이도록 하기 위해 부모 요소에 relative 클래스 추가
    onMouseEnter={()=>setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    
        <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title} 영화의 이미지`  } 
        
        />
        
        {isHovered && (
             <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4 ' >    
                <h2 className="text-lg font-bold  leading-snug">{movie.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">{movie.overview}</p>
             </div>
        )}  
    </div>
    //line-clamp-5은 영화 개요가 너무 길어서 카드에서 넘칠 때 5줄까지만 보이도록 하는 클래스
    //leading은 줄 간격
    //bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md 블러처리
    //상하좌우 0으로 설정하는데 inset-0
    //isHovered 상태가 true일 때 영화 제목과 개요를 보여주는 조건부 렌더링
    );
}