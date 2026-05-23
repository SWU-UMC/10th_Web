import { useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import LpCard from "../components/LpCard/LpCard";
import useDebounce from "../hooks/useDebounce";
const HomePage=()=>{
    //const {data, isLoading, isError}=useCustomFetch("url");
    //const{data, isLoading, isError}=useGetLpLits(cursor, limit, search, order); 
    const [search, setSearch]=useState("");
    const debouncedValue=useDebounce(search, 300); //훈 쓰고 0.3초 뒤에 데이터 요청이 가게
    const {
        data: lps,
        isFetching,
        isPending,
        hasNextPage,
        fetchNextPage,
        isError,
        } = useGetInfiniteLpList({
        limit: 50,
        search: debouncedValue,   //여기를 search에서 갈아끼움
        order: PAGINATION_ORDER.desc,
        });
        console.log(lps);
    /*const{data, isPending, isError}=useGetLpList({search});*/
    //ref는 특정한 html 요소를 감시할 수 있다.
    //inview 는 그 요소가 화면에 보이면 true
    const {ref, inView}=useInView({
        threshold:0

    });
    //다음 페이지(hasNextPage)가 있을 때 넘겨주는 것
    useEffect(()=>{
        if(inView){
            !isFetching && hasNextPage && fetchNextPage()
        }
    },[inView, isFetching, hasNextPage, fetchNextPage]);
    if(isPending){
        return <div className={"mt-20"}>Loading...</div>;

    }
    if (isError) {

    return <div className={"mt-20"}>Error</div>;
}

    return( 
        <div className="container mx-auto px-4 py-6">
            <input className={"border p-4 mt-6"}value={search} onChange={(e)=>setSearch(e.target.value)} />
            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                {lps?.pages
                    ?.map((page) => page.data)
                    ?.flat()
                    ?.map((lp) => (
                        <LpCard key={lp.id} lp={lp} />
                    ))}
            </div>
           
           <div ref={ref} className="h-2"></div>
        </div>
            
            
        
        
    );
};

export default HomePage;