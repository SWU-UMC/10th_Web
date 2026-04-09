import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
     const params = useParams();
    
    console.log(params);
    return <div>영화 상세 페이지{params.movieId}</div>
}

export default MovieDetailPage;