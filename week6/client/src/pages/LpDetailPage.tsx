import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../apis/axios';
import { useEffect } from 'react';


const LpDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');


    useEffect(() => {
        if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        navigate('/login', { state: { from: `/lps/${lpid}` } });
        }
    }, [isLoggedIn, navigate, lpid]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['lp', lpid],
        queryFn: async () => {
        const res = await api.get(`/lps/${lpid}`);
        return res.data.data;
        },
        enabled: isLoggedIn, // 로그인 되었을 때만 쿼리 실행
    });

  if (isLoading) return <div className="p-20 text-center text-white">데이터를 불러오는 중...</div>;
  if (isError) return <div className="p-20 text-center text-red-400">에러가 발생했습니다.</div>;

  return (
    <div className="flex justify-center items-center p-10 min-h-full">
      <div className="bg-white/5 backdrop-blur-md p-10 rounded-[40px] w-full max-w-4xl border border-white/10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-400 rounded-full" />
            <span className="font-bold text-lg">{data?.nickname || '익명'}</span>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-cyan-400">✏️</button>
            <button className="hover:text-red-400">🗑️</button>
          </div>
        </div>

        <h1 className="text-4xl font-black mb-6">{data?.title}</h1>
        
        <div className="flex flex-col items-center gap-8">
          <img src={data?.thumbnail} className="w-80 h-80 object-cover rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-white/5" />
          <p className="text-white/70 text-center leading-relaxed max-w-2xl">{data?.content}</p>
        </div>

        <div className="mt-10 flex justify-center items-center gap-2">
          <button className="text-2xl">❤️</button>
          <span className="text-lg font-bold">{data?.likes || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;