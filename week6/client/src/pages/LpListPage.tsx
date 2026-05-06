// pages/LpListPage.tsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../apis/axios';
import LpCard from '../components/LpCard';

const LpListPage = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useQuery({
    queryKey: ['lps', sort],
    queryFn: async () => {
      const res = await api.get('/lps', { params: { order: sort, limit: 20 } });
      return res.data.data;
    },
    staleTime: 60000, 
  });

  return (
    <div className="p-8">
      {/* 정렬 토글 */}
      <div className="flex justify-end mb-8 gap-2">
        {['desc', 'asc'].map((order) => (
          <button
            key={order}
            onClick={() => setSort(order as any)}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${sort === order ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-white/40 border border-white/10'}`}
          >
            {order === 'desc' ? '최신순' : '오래된순'}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading ? (
          [...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-3xl" />)
        ) : (
          data?.data.map((lp: any) => <LpCard key={lp.id} lp={lp} />)
        )}
      </div>
    </div>
  );
};

export default LpListPage;