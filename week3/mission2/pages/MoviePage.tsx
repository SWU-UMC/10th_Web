import { useEffect, useState} from "react";
import axios from "axios";
import  type {Movie, MovieResponse}  from "../types/movie";
import MovieCard from "../components/MoiveCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {
    const [movies, setMovies]=useState<Movie[]>([]); //영화 데이터를 담을 빈 배열 생성, 데이터를 받아오는 상태
    //1. 로딩 상태
    const [isPending, SetIsPending]=useState(false); 
    //2. 에러 상태
    const [isError, SetIsError]=useState(false);
    //3. 페이지
    const[page, setPage]=useState(1);
    //동적으로 받기 위해
    const {category}=useParams<{category:string;}>();
    useEffect(():void=>{    //이 경우는 데이터를 성공적으로 가져왔을 때
        const fetchMovies=async():Promise<void> =>{

            SetIsPending(true);
            try{
                const {data} =await axios(   //fentch 대신 axios 사용 //콘솔 눌렀을 때 data안에 데이터가 담겨있으니까 {data}로 받음
                `https://api.themoviedb.org/3/movie/${category}?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        
                    },
                }
            );
            //axios 를 활용하면 {const result=await response.json(); //json 형태로 변환 및 풀어줌} 이거 안해줘도 됨
            setMovies(data.results); //영화 데이터는 data 안에 results라는 배열로 담겨있음, 그것을 movies 상태에 저장
            SetIsPending(false);
            } catch{
                SetIsError(true);
            } // 실패했을 경우는 catch 해서 잡아줌
            finally{
                SetIsPending(false);
            }
            
        };
       fetchMovies();
    },[category, page]);//언제 렌더링할래에 대한 답, []안에 넣는것들이 변경됨, 페이지를 넘길 때마다 위에 코드들을 재실행 시켜야 하니까 page를 넘겨줘야 함

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
        {isPending &&(
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner/>
            </div>
        )}
        {!isPending &&(
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