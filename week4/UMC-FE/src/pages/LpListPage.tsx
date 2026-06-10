import React, { useState, useEffect, useRef } from "react";
import { getLps } from "../apis/lp";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import LpSkeletonList from "./LpSkeletonList";
import ErrorRetry from "../components/ErrorRetry";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";
import { useThrottle } from "../hooks/useThrottle";

export interface Lp {
    data: any[];
    id: number;
    title: string;
    thumbnail: string;
    content: string;
    nextCursor: number;
    hasNext: boolean;
    createdAt?: string;
    likes?: number;
}

const LpListPage = () => {
    const [sort, setSort] = useState("latest");
    const [scrollY, setScrollY] = useState(0);
    const throttledScrollY = useThrottle(scrollY, 300);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const {data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["lps", sort], // sort가 변경될 때마다 쿼리가 새로 실행됨
        queryFn: ({pageParam = null}) => getLps(sort, pageParam as number | null),
        initialPageParam: null,
        getNextPageParam: (lastPage: any) => {
            return lastPage.hasNext ? lastPage.nextCursor : undefined;
        },
        staleTime: 5 * 60 * 1000, // 5분
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight; 

        if (throttledScrollY + windowHeight >= documentHeight - 200) {
            if (hasNextPage && !isFetchingNextPage) {
                console.log("👉 바닥 감지! 다음 페이지 데이터를 불러옵니다.");
                fetchNextPage();
            }
        }
    }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div>
                <div className="flex justify-end gap-2 mb-4">
                    <button className="font-bold text-gray-400">최신순</button>
                    <button className="text-gray-400">오래된순</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <LpCardSkeleton key={`initial-skel-${i}`} />
                    ))}
                </div>
            </div>
        );
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {threshold: 1.0} // 100% 보일 때 실행
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage]);

    console.log("리액트 쿼리 데이터:", data);

    if (isLoading) {
        return (
            <div>
                <div className="flex justify-end gap-2 mb-4">
                    <button className="font-bold text-gray-400">최신순</button>
                    <button className="text-gray-400">오래된순</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <LpCardSkeleton key={`initial-skel-${i}`} />
                    ))}
                </div>
            </div>
        );
    }
    if (isError) return <ErrorRetry onRetry={() => refetch()} />;

    return (
        <div>
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={() => setSort("latest")} className={sort === "latest"? "font-bold" : ""}>최신순</button>
                <button onClick={() => setSort("oldest")} className={sort === "oldest"? "font-bold" : ""}>오래된순</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.pages.map((page:any, pageIndex: number) => (
                    <React.Fragment key={pageIndex}>
                        {page?.data?.map((lp: any) => (
                            <LpCard key={lp.id} lp={lp} />
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <LpCardSkeleton key={`bottom-skel-${i}`} />
                    ))}
                </div>
            )}

            <div ref={observerRef} className="h-10 mt-4 w-full"></div>
        </div>
    );
};

export default LpListPage;