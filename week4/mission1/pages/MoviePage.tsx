import { useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MoiveCard";
import LoadingSpinner from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";


export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
        `https://api.themoviedb.org/3/movie/${category}?page=${page}`
    );  //데이터 가져오는 로직을 따로 분리 (커스텀 훅)

    const movies = data?.results ?? [];


    if(isError){
        return( 
        <div className="text-red-500 text-2xl">
            <span>에러가 발생했습니다.</span>
        </div>);
    }
    /*if(!isPending){
        return <LoadingSpinner/>;  //여기서 return돼서 아래 return이 안 보이는거
    }*/

    // 밑에 className은 특정 크기에 따라 컬럼 수가 달라지는 그리드 레이아웃 설정
    return (
    <>
        <div className="flex items-center justify-center gap-6 mt-5">
            <button
             className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled: bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
             disabled={page===1}
             onClick={()=>setPage(prev=>prev-1)}>{'<'}</button>
            <span>{page} 페이지</span>
            <button
             className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer"
             onClick={()=>setPage(prev=>prev+1)}>{'>'}</button>
            <span>{page} 페이지</span>
        </div>
        {isLoading &&(
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner/>
            </div>
        )}
        {!isLoading &&(
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-10">  
                {movies &&
                movies.map((movie)=>(
                    <MovieCard key={movie.id} movie={movie} category={category}/>
                ))}  
            </div>
        )}
        
        
    </>
    );//영화 데이터가 있을 때만 map 함수를 사용해서 MovieCard 컴포넌트로 영화 데이터를 전달 props로 전달할 때는 key값도 같이 전달해야 함
}