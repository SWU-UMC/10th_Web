import { useNavigate } from 'react-router-dom';

const LpCard = ({ lp }: { lp: any }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/lps/${lp.id}`)}
      className="group relative cursor-pointer rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/30"
    >
      {/* 카드 이미지 - 유리 속 사물 느낌 */}
      <div className="relative aspect-square overflow-hidden rounded-[18px]">
        <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        
        {/* 마우스 호버 시 상단에서 내려오는 반짝이는 빛 효과 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 정보 텍스트 */}
      <div className="mt-4 px-1">
        <h3 className="truncate font-bold text-white text-md tracking-tight group-hover:text-cyan-300 transition-colors">{lp.title}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            {new Date(lp.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs text-white/60">🤍 {lp.likes?.length || 0}</span>
        </div>
      </div>
      
      {/* 유리 질감의 핵심: 미세한 외곽선 빛 */}
      <div className="absolute inset-0 rounded-[24px] pointer-events-none border border-white/5 group-hover:border-white/20 transition-all" />
    </div>
  );
};

export default LpCard;