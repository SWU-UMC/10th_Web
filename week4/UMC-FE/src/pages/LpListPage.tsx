import { useState } from "react";
import { getLps } from "../apis/lp";
import { useQuery } from "@tanstack/react-query";
import LpSkeletonList from "./LpSkeletonList";
import ErrorRetry from "../components/ErrorRetry";
import LpCard from "../components/LpCard";

export interface Lp {
    id: number;
    title: string;
    thumbnail: string;
    content: string;
    createdAt?: string;
    likes?: number;
}

const LpListPage = () => {
    const [sort, setSort] = useState("latest");

    const {data, isLoading, isError, refetch} = useQuery<Lp[]>({
        queryKey: ["lps", sort], // sort가 변경될 때마다 쿼리가 새로 실행됨
        queryFn: () => getLps(sort),
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });

    if (isLoading) return <LpSkeletonList />;
    if (isError) return <ErrorRetry onRetry={() => refetch()} />;
    console.log("서버에서 온 데이터:", data);

    return (
        <div>
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={() => setSort("latest")} className={sort === "latest"? "font-bold" : ""}>최신순</button>
                <button onClick={() => setSort("oldest")} className={sort === "oldest"? "font-bold" : ""}>오래된순</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.map((lp) => (
                    <LpCard key={lp.id} lp={lp} />
                ))}
            </div>
        </div>
    );
};

export default LpListPage;