import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext.tsx";
import useDeleteLike from "../hooks/mutations/useDeleteLike.ts";
import usePostLike from "../hooks/mutations/usePostLike.ts"

const LpDetailPage = () => {
    const { lpId } = useParams();
    const { accessToken } = useAuth();
    const { data: lp, isPending, isError } = useGetLpDetail(Number(lpId));

    const { data: me } = useGetMyInfo(accessToken);
    const { mutate: likeMutate } = usePostLike()
    const { mutate: dislikeMutate } = useDeleteLike()


    const isLiked = lp?.data?.likes
        .map((like) => like.userId)
        .includes(me?.data?.id as number);

    const handleLikeLp = async () => {
        likeMutate({ lpId: Number(lpId) });
    }
    const handleDislikeLp = async () => {
        dislikeMutate({ lpId: Number(lpId) })
    }

    if (isPending && isError) {
        return <></>;
    }
    return (
        <div className={"mt-12"}>
            <h1>{lp?.data?.id}</h1>
            <h1>{lp?.data?.title}</h1>
            <img src={lp?.data?.thumbnail} alt={lp?.data?.title} />
            <p>{lp?.data?.content}</p>

            <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
                <Heart
                    color={isLiked ? "red" : "black"}
                    fill={isLiked ? "red" : "transparent"}
                />
            </button>
        </div>
    );
};
export default LpDetailPage;