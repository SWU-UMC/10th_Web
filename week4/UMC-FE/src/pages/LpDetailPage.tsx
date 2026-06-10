import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLpDetail } from '../apis/lp';
import { useQuery } from '@tanstack/react-query';
import LpDetailSkeleton from './LpDetailSkeleton';

const LpDetailPage = () => {
    const { lpId } = useParams();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 보호 라우트
    if (!accessToken) {
        if (window.confirm("로그인이 필요한 페이지입니다. 로그인 페이지로 이동하시겠습니까?")) {
            navigate("/login", { state: { from: location } });
        } else {
            navigate(-1); // 이전 페이지로 이동
        }
        return null;
    }

    const {data, isLoading, isError} = useQuery ({
        queryKey: ['lp', lpId],
        queryFn: () => getLpDetail(Number(lpId)),
        enabled: !!lpId, // lpId가 있을 때만 쿼리 실행
    });

    if (isLoading) return <LpDetailSkeleton />;
    if (isError) return <div>LP 정보를 불러오는 중 오류가 발생했습니다.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 썸네일 이미지 */}
            <img 
                src={data.thumbnail} 
                alt={data.title} 
                className="w-full h-[400px] object-cover rounded-xl shadow-md" 
            />
            
            <div className="mt-8">
                {/* 제목 */}
                <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                
                {/* 작성자 정보 & 날짜 */}
                <div className="flex items-center gap-3 mt-4 text-gray-600 border-b pb-4">
                    <img 
                        src={data.author.avatar} 
                        alt="프로필" 
                        className="w-10 h-10 rounded-full border"
                    />
                    <div>
                        <p className="font-medium text-gray-800">{data.author.name}</p>
                        <p className="text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-wrap">
                    {data.content}
                </p>
            </div>
        </div>
    );
};

export default LpDetailPage;