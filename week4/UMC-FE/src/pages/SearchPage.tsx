import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { getLps } from '../apis/lp'; 

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const debouncedQuery = useDebounce(searchInput, 300);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const isValidQuery = debouncedQuery.trim().length > 0;

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['lps', { search: debouncedQuery, order: 'desc' }],
        
        queryFn: ({ pageParam = 0 }) => getLps(pageParam as number | null, debouncedQuery, 'desc'),
        
        initialPageParam: 0, 
        
        getNextPageParam: (lastPage: any) => lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: isValidQuery,
        
        staleTime: 1000 * 60 * 5, 
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">검색</h2>
            
            {/* 검색창 UI */}
            <input 
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-full border p-4 rounded-lg mb-8 focus:ring-2 focus:ring-blue-500"
            />

            {/* 검색 결과가 없을 때 */}
            {!isValidQuery && (
                <p className="text-gray-500 text-center py-10">검색어를 입력해주세요.</p>
            )}

            {/* 로딩 중 */}
            {isLoading && isValidQuery && (
                <p className="text-center py-4">검색 중...</p>
            )}

            {/* 검색 결과 */}
            {isValidQuery && !isLoading && (
                <div className="grid grid-cols-2 gap-4">
                    {data?.pages.map((page: any, i: number) => (
                        <React.Fragment key={i}>
                            {page?.data?.map((item: any) => (
                                <div key={item.id} className="border p-4 rounded-lg">
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-sm text-gray-600 truncate">{item.content}</p>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            )}

            {isFetchingNextPage && <p className="text-center py-4">추가 결과를 불러오는 중...</p>}
            
            {/* 무한 스크롤 관측용 div */}
            <div ref={observerRef} className="h-10"></div>
        </div>
    );
};

export default SearchPage;