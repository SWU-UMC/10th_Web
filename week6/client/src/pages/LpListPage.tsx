import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import api from '../apis/axios';
import LpCard from '../components/LpCard';

const LpListPage = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const { ref, inView } = useInView(); // 스크롤 감지용 센서

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
  queryFn: async ({ pageParam = undefined }) => { 
    const res = await api.get('/lps', { 
      params: { 
        order: sort, 
        cursor: pageParam,
        limit: 10 
      } 
    });
    return res.data.data;
  },
  initialPageParam: undefined, 
  getNextPageParam: (lastPage) => {
    return lastPage.hasNext ? lastPage.nextCursor : undefined;
  },
});
 
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-8">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-8 gap-2">
        {['desc', 'asc'].map((order) => (
          <button
            key={order}
            onClick={() => setSort(order as any)}
            className={`px-5 py-2 rounded-full text-xs font-black transition-all ${sort === order ? 'bg-white text-black' : 'bg-white/5 text-white/40'}`}
          >
            {order === 'desc' ? '최신순' : '오래된순'}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* 1. 초기 로딩 스켈레톤 UI (체크리스트 반영) */}
        {isLoading && [...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[24px] border border-white/10" />
        ))}

        {/* 2. 실제 데이터 렌더링 */}
        {data?.pages.map((page) =>
          page.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
        )}

        {/* 3. 추가 로딩 중일 때 하단 스켈레톤 UI */}
        {isFetchingNextPage && [...Array(5)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[24px]" />
        ))}
      </div>

      {/* 4. 스크롤 트리거 지점 */}
      <div ref={ref} className="h-20 w-full" />
    </div>
  );
};

export default LpListPage;