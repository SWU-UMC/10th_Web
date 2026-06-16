import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { useQuery } from "@tanstack/react-query";

function useGetLpDetail(lpId: number) {
    return useQuery({
        queryKey:[QUERY_KEY.lps, lpId],
        queryFn:() => getLpDetail({lpId}),
    })
    
}
export default useGetLpDetail;