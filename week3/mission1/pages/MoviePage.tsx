import { useEffect, useState} from "react";
import axios from "axios";
import  type {Movie}  from "../types/movie";
import MovieCard from "../components/MoiveCard";
export default function MoviePage() {
    const [movies, setMovies]=useState<Movie[]>([]); //영화 데이터를 담을 빈 배열 생성
    useEffect(():void=>{
        const fetchMovies=async():Promise<void> =>{
            const {data} =await axios(   //fentch 대신 axios 사용 //콘솔 눌렀을 때 data안에 데이터가 담겨있으니까 {data}로 받음
                'https://api.themoviedb.org/3/movie/popular',
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        
                    }
                }
            );
            //axios 를 활용하면 {const result=await response.json(); //json 형태로 변환 및 풀어줌} 이거 안해줘도 됨
            setMovies(data.results); //영화 데이터는 data 안에 results라는 배열로 담겨있음, 그것을 movies 상태에 저장
        }; //데이터를 호출할 때 useEffect 사용
        //const response = fetch(url); // 이렇게 쓰면 Promise라서 바로 값을 못 씀/ 그래서 async, await 사용해서 값을 받아옴
        //useEffect(async () => { 이렇게 쓰면서 async가 함수가 될 수 없기 때문에 fetchMovies 함수를 따로 만들어서 async, await 사용
        fetchMovies(); //호출
    },[]);
    console.log(movies[0]?.adult); //영화 데이터가 잘 들어왔는지 콘솔로 확인 //undefined 처리

    // 밑에 className은 특정 크기에 따라 컬럼 수가 달라지는 그리드 레이아웃 설정
    return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-10">  
        {movies &&
        movies.map((movie)=>(
            <MovieCard key={movie.id} movie={movie} />
        ))}  
    </div>
    );//영화 데이터가 있을 때만 map 함수를 사용해서 MovieCard 컴포넌트로 영화 데이터를 전달 props로 전달할 때는 key값도 같이 전달해야 함
}