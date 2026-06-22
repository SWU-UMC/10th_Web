import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

import type { RequestLpDto, ResponseLpDto, ResponseLikeLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

type LikeContext = {
    previousLpPost?: ResponseLpDto;
};

function usePostLike() {
    return useMutation({
            mutationFn: postLike,
    
            onMutate: async (lp: RequestLpDto) => {
                await queryClient.cancelQueries({
                    queryKey: [QUERY_KEY.lps, lp.lpId],
                });
    
                const previousLpPost: ResponseLpDto | undefined =
                    queryClient.getQueryData<ResponseLpDto>([
                        QUERY_KEY.lps,
                        lp.lpId,
                    ]);
    
                const newLpPost = { ...previousLpPost };
    
                const me: ResponseMyInfoDto | undefined =
                    queryClient.getQueryData<ResponseMyInfoDto>([
                        QUERY_KEY.myInfo,
                    ]);
    
                const userId: number = Number(me?.data.id);
    
                const likedIndex: number =
                    previousLpPost?.data.likes.findIndex(
                        (like: any) => like.userId === userId
                    ) ?? -1;
    
                if (likedIndex !== -1) {
                    previousLpPost?.data.likes.splice(likedIndex, 1);
                } else {
                    const newLike: { userId: number; lpId: number } = {
                        userId,
                        lpId: lp.lpId,
                    };
    
                    previousLpPost?.data.likes.push(newLike as any);
                }
    
                queryClient.setQueryData(
                    [QUERY_KEY.lps, lp.lpId],
                    newLpPost
                );
    
                return { previousLpPost, newLpPost };
            },
    
            onError: (
            err: Error,
            newLp: RequestLpDto,
            context?: { previousLpPost: ResponseLpDto | undefined }
        ) => {
                console.log(err, newLp);
    
                queryClient.setQueryData(
                    [QUERY_KEY.lps, newLp.lpId],
                    context?.previousLpPost
                );
            },
    
            onSettled: async (
                data: ResponseLikeLpDto | undefined,
                error: Error | null,
                variables: RequestLpDto
            ) => {
                await queryClient.invalidateQueries({
                    queryKey: [QUERY_KEY.lps, variables.lpId],
                });
            },
        });
}

export default usePostLike;