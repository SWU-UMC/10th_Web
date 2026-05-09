import useGetLpList from "../hooks/queries/useGetLpList";
import { useState } from "react";
const HomePage=()=>{
    //const {data, isLoading, isError}=useCustomFetch("url");
    //const{data, isLoading, isError}=useGetLpLits(cursor, limit, search, order); 
    const [search, setSearch]=useState("");
    const{data, isPending, isError}=useGetLpList({search});
    if(isPending){
        return <div className={"mt-20"}>Loading...</div>;

    }
    if(!isError){
        return <div className={"mt-20"}>Error</div>
    }
    return( 
        <div>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} />
            {data?.map((lp)=><h1>{lp.title}</h1>)}
        </div>
        
    );
};

export default HomePage;