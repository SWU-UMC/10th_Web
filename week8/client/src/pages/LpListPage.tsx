import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../apis/axios';
import LpCard from '../components/LpCard';
import { useDebounce } from '../hooks/useDebounce';

const LpListPage = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL의 쿼리 스트링 감지 (?searchMode=true 일 때만 검색창 활성화)
  const [searchParams] = useSearchParams();
  const isSearchMode = searchParams.get('searchMode') === 'true';

  // 검색어 및 검색 타입 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'tag'>('title');
  
  // 디바운스 훅 연동 (0.3초 지연)
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 최근 검색어 상태 관리 (로컬스토리지 연동)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // 디바운스된 검색어가 있으면 최근 검색어 기록 리스트에 추가
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item !== debouncedQuery.trim());
        const updated = [debouncedQuery.trim(), ...filtered].slice(0, 5); // 최근 5개 유지
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [debouncedQuery]);

  // 최근 검색어 개별 삭제
  const handleDeleteRecent = (textToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== textToDelete);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // 최근 검색어 전체 삭제
  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // 검색 모드가 아닐 때는 입력값 완전히 비워주기
  useEffect(() => {
    if (!isSearchMode) {
      setSearchQuery('');
    }
  }, [isSearchMode]);

  // 모달 및 LP 추가 입력 상태 관리 (기존 유지)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState(''); 

  // 1. 이미지 업로드 Mutation (기존 유지)
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data.imageUrl;
    },
    onSuccess: (url) => {
      setThumbnailUrl(url);
    },
    onError: () => alert('이미지 업로드에 실패했어요!')
  });

  // 2. LP 게시글 생성 Mutation (기존 유지)
  const createLpMutation = useMutation({
    mutationFn: (newLp: any) => api.post('/lps', newLp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => alert(error.response?.data?.message || 'LP 생성 실패!')
  });

  // 폼 초기화
  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setThumbnailUrl('');
    setPreviewUrl('');
  };

  // 사진 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      uploadImageMutation.mutate(file);
    }
  };

  // 최종 등록 핸들러
  const handleAddLp = () => {
    if (!title || !content) return alert('제목과 내용을 입력해주세요!');
    if (!thumbnailUrl) return alert('이미지가 업로드 중입니다. 잠시만 기다려주세요!');

    createLpMutation.mutate({
      title,
      content,
      thumbnail: thumbnailUrl,
      tags,
      published: true
    });
  };

  // 3. 무한 스크롤 데이터 패칭 (검색 쿼리 가변 연동)
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lps', sort, debouncedQuery, searchType, isSearchMode],
    queryFn: async ({ pageParam = undefined }) => {
      const params: any = { 
        order: sort, 
        cursor: pageParam, 
        limit: 10 
      };
      
      // 검색창이 열려 있고, 디바운스된 검색어가 있을 때만 파라미터 분기 주입
      if (isSearchMode && debouncedQuery.trim()) {
        if (searchType === 'title') {
          params.search = debouncedQuery;
        } else {
          params.tag = debouncedQuery;
        }
      }
      
      const res = await api.get('/lps', { params });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 relative min-h-screen bg-black text-white flex flex-col">
      
      {/* ────────────────── 상단 1/3 영역: 사이드바 '찾기' 클릭 시에만 활성화 ────────────────── */}
      {isSearchMode && (
        <div className="w-full max-w-2xl mx-auto pt-4 pb-10 flex flex-col gap-4 transition-all duration-300">
          {/* 인풋 영역 */}
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

            {/* 정렬 옵션 셀렉트 박스 */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'title' | 'tag')}
              className="bg-neutral-900 border border-white/20 text-white rounded-xl px-4 py-2 text-sm outline-none cursor-pointer focus:border-pink-500"
            >
              <option value="title">제목</option>
              <option value="tag">태그</option>
            </select>
          </div>

          {/* 최근 검색어 기록판 */}
          <div className="flex flex-col gap-2 min-h-[40px] mt-2">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-white/80">최근 검색어</span>
              {recentSearches.length > 0 && (
                <button onClick={handleClearAllRecent} className="text-white/30 hover:text-white transition-colors">
                  모두 지우기
                </button>
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
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/30 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors"
                  >
                    <span className="text-white/70">{item}</span>
                    <button onClick={(e) => handleDeleteRecent(item, e)} className="text-white/30 hover:text-red-400 text-[10px]">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr className="border-white/5 mt-4" />
        </div>
      )}

      {/* ────────────────── 하단 2/3 영역: 정렬 및 리스트 공통 메인 영역 ────────────────── */}
      {/* 최신순 / 오래된순 정렬 필터 */}
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

      {/* LP 카드 배치 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading && [...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[24px] border border-white/10" />
        ))}
        {data?.pages.map((page) =>
          page.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
        )}
      </div>
      
      {/* 무한스크롤 감지 스파이존 */}
      <div ref={ref} className="h-20 w-full" />

      {/* LP 추가 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="glass-panel w-full max-w-md p-8 rounded-[40px] flex flex-col gap-4 mx-4 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-2 text-pink-500 text-center">New Vinyl</h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-44 h-44 mx-auto cursor-pointer group mb-4"
            >
              <img 
                src={previewUrl || "https://cdn-icons-png.flaticon.com/512/26/26559.png"} 
                className={`w-full h-full rounded-full object-cover shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-white/10 transition-all ${uploadImageMutation.isPending ? 'opacity-30' : 'group-hover:scale-105 group-hover:rotate-12'}`} 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold tracking-widest">UPLOAD PHOTO</span>
              </div>
              {uploadImageMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
            </div>

            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="LP Name" 
              className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan-500 transition-colors text-sm" 
            />
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="LP Content" 
              className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none h-24 resize-none text-sm" 
            />
            
            <div className="flex gap-2">
              <input 
                value={tagInput} 
                onChange={e => setTagInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setTags([...tags, tagInput]), setTagInput(''))}
                placeholder="LP Tag" 
                className="flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl outline-none text-sm" 
              />
              <button 
                onClick={() => { if(tagInput) setTags([...tags, tagInput]); setTagInput(''); }}
                className="bg-white/10 px-5 rounded-2xl font-bold text-xs hover:bg-white/20"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[30px]">
              {tags.map(t => (
                <span key={t} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                  #{t} <button onClick={() => setTags(tags.filter(tag => tag !== t))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>

            <button 
              onClick={handleAddLp}
              disabled={createLpMutation.isPending || uploadImageMutation.isPending}
              className="bg-pink-500 p-4 rounded-2xl font-black text-lg mt-4 hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20 disabled:bg-gray-700"
            >
              {createLpMutation.isPending ? 'CREATING...' : 'Add LP'}
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(236,72,153,0.4)] z-50 hover:scale-110 active:scale-95 transition-all"
      >
        +
      </button>
    </div>
  );
};

export default LpListPage;