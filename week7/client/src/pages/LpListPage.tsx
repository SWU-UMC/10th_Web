import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import api from '../apis/axios';
import LpCard from '../components/LpCard';

const LpListPage = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 및 입력 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // 서버에서 받은 실제 이미지 경로
  const [previewUrl, setPreviewUrl] = useState(''); // 브라우저 미리보기용 경로

  // 1. 이미지 업로드 Mutation (/v1/uploads)
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data.imageUrl; // 서버가 반환한 URL
    },
    onSuccess: (url) => {
      setThumbnailUrl(url);
    },
    onError: () => alert('이미지 업로드에 실패했어요!')
  });

  // 2. LP 게시글 생성 Mutation (/v1/lps)
  const createLpMutation = useMutation({
    mutationFn: (newLp: any) => api.post('/lps', newLp),
    onSuccess: () => {
      // 등록 성공 시 목록 새로고침 및 모달 닫기
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => alert(error.response?.data?.message || 'LP 생성 실패!')
  });

  // 폼 초기화 함수
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
      setPreviewUrl(URL.createObjectURL(file)); // 화면에 즉시 보여주기
      uploadImageMutation.mutate(file); // 서버로 전송해서 URL 받아오기
    }
  };

  // 최종 등록 핸들러
  const handleAddLp = () => {
    if (!title || !content) return alert('제목과 내용을 입력해주세요!');
    if (!thumbnailUrl) return alert('이미지가 업로드 중입니다. 잠시만 기다려주세요!');

    createLpMutation.mutate({
      title,
      content,
      thumbnail: thumbnailUrl, // 업로드 성공해서 받은 URL을 전달
      tags,
      published: true
    });
  };

  // 무한 스크롤 데이터 패칭
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: async ({ pageParam = undefined }) => {
      const res = await api.get('/lps', { params: { order: sort, cursor: pageParam, limit: 10 } });
      return res.data.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-8 relative min-h-screen bg-black text-white">
      {/* 정렬 버튼 영역 */}
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

      {/* LP 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading && [...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[24px] border border-white/10" />
        ))}
        {data?.pages.map((page) =>
          page.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
        )}
      </div>
      <div ref={ref} className="h-20 w-full" />

      {/*  LP 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="glass-panel w-full max-w-md p-8 rounded-[40px] flex flex-col gap-4 mx-4 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black mb-2 text-pink-500 text-center">New Vinyl</h2>
            
            {/* LP 이미지 클릭 영역 */}
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
              {/* 숨겨진 인풋 */}
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
            
            {/* 태그 입력 영역 */}
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
            
            {/* 태그 리스트 */}
            <div className="flex flex-wrap gap-2 min-h-[30px]">
              {tags.map(t => (
                <span key={t} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                  #{t} <button onClick={() => setTags(tags.filter(tag => tag !== t))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>

            {/* 제출 버튼 */}
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

      {/* 우측 하단 플로팅 버튼 */}
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