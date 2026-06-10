import {Link} from "react-router-dom";

interface LpCardProps {
    lp: {
        id: number;
        title: string;
        thumbnail: string;
        content: string;
        createdAt?: string;
        likes?: number;
    }
}

const LpCard = ({lp}: LpCardProps) => {
    return (
        <Link
            to={`/lp/${lp.id}`}
            className="group relative block overflow-hidden rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
        >
            <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-48 object-cover"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-bold">{lp.title}</h3>
                <p className="text-sm opacity-75">{lp.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-200">
                    <span>{lp.createdAt || "최근 업로드"}</span>
                    <span className="flex items-center gap-1">
                        ❤️ {lp.likes || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default LpCard;