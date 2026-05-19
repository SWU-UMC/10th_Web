import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import api from '../apis/axios';
import LpCard from '../components/LpCard';
import { useDebounce } from '../hooks/useDebounce';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'tag'>('title');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 최근 검색어 상태 (로컬스토리지)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const { ref, inView } = useInView();

  // 디바운스된 검색어 저장
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item !== debouncedQuery.trim());
        const updated = [debouncedQuery.trim(), ...filtered].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [debouncedQuery]);

  const handleDeleteRecent = (textToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== textToDelete);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // React Query 데이터 페칭
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lps', debouncedQuery, searchType],
    queryFn: async ({ pageParam = undefined }) => {
      const params: any = { cursor: pageParam, limit: 10, order: 'desc' };
      if (debouncedQuery.trim()) {
        if (searchType === 'title') params.search = debouncedQuery;
        else params.tag = debouncedQuery;
      }
      const res = await api.get('/lps', { params });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 min-h-screen bg-black text-white flex flex-col">
      <div className="w-full max-w-2xl mx-auto pt-10 pb-12 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center border-b border-white/40 px-1 py-2 focus-within:border-pink-500 transition-colors">
            <span className="text-white/60 text-lg mr-3">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full bg-transparent outline-none text-white text-md placeholder:text-white/20"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs px-1">✕</button>
            )}
          </div>

          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'title' | 'tag')}
            className="bg-neutral-900 border border-white/20 text-white rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
          >
            <option value="title">제목</option>
            <option value="tag">태그</option>
          </select>
        </div>

        {/* 최근 검색어 */}
        <div className="flex flex-col gap-2 min-h-[40px] mt-2">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-white/80">최근 검색어</span>
            {recentSearches.length > 0 && (
              <button onClick={handleClearAllRecent} className="text-white/30 hover:text-white">모두 지우기</button>
            )}
          </div>
          {recentSearches.length === 0 ? (
            <p className="text-xs text-white/20 italic pl-1">최근 검색 내역이 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {recentSearches.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSearchQuery(item)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs cursor-pointer"
                >
                  <span className="text-white/70">{item}</span>
                  <button onClick={(e) => handleDeleteRecent(item, e)} className="text-white/30 hover:text-red-400 text-[10px]">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-white/5 mb-8" />

      {/* ────────────────── 하단 목록 결과 영역 ────────────────── */}
      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {isLoading && [...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[24px]" />)}
          {data?.pages[0]?.data.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/30 text-sm">일치하는 LP가 없습니다. 🥲</div>
          )}
          {data?.pages.map((page) => page.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />))}
        </div>
        {hasNextPage && <div ref={ref} className="h-20 w-full" />}
      </div>
    </div>
  );
};

export default SearchPage;