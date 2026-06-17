import { useMutation } from "@tanstack/react-query"
import { postLike } from "../../apis/lp.ts"
import { queryClient } from "../../App.tsx"
import { QUERY_KEY } from "../../constants/key.ts";
import type { RequestLpDto, ResponseLpDto, Likes } from "../../types/lp.ts";
import type { ResponseMyInfoDto } from "../../types/auth.ts";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
        onMutate: async (lp: RequestLpDto) => {
            //이 게시글에 관련된 쿼리를 취소(캐시된 데이터를 새로 불러오는 요청)
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.lps, lp.lpId]
            });

            //현재 게시글의 데이터를 캐시에서 가져와야.
            const previousLpPost = queryClient.getQueryData<ResponseLpDto>([QUERY_KEY.lps, lp.lpId]);

            //게시글 데이터를 복사해서 NewLpPost-> for 나중에 오류 발생시 이전 상태로 되돌리기 위함. 
            const newLpPost = { ...previousLpPost };

            //게시글에 저장된 좋아요 목록에서 현재 내가 눌럿던 좋아요 위치 찾기. 
            const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
            const userId = Number(me?.data?.id);
            const likeIndex =
                previousLpPost?.data?.likes.findIndex((like) => like.userId === userId) ?? -1;

            if (likeIndex >= 0) {
                previousLpPost?.data?.likes.splice(likeIndex, 1);
            } else {
                const newLike = { userId, lpId: lp.lpId } as Likes;
                previousLpPost?.data?.likes.push(newLike);
            }

            queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

            return { previousLpPost, newLpPost };


        },
        onError: (err, newLp, context) => {
            queryClient.setQueryData(
                [QUERY_KEY.lps, newLp.lpId],
                context?.previousLpPost?.data?.id,
            )
        },
        onSettled: async (data, error, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, variables.lpId],
            }
            )
        },
    });
}

export default usePostLike;
