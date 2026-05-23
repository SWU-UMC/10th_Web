import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";

import type {
    RequestLpDto,
    ResponseLpDto,
    ResponseLikeLpDto,
} from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

type LikeContext = {
    previousLpPost?: ResponseLpDto;
};

function usePostLike() {
    return useMutation({
        mutationFn: postLike,

        onMutate: async (
            lp: RequestLpDto
        ): Promise<LikeContext> => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.lps, lp.lpId],
            });

            const previousLpPost =
                queryClient.getQueryData<ResponseLpDto>([
                    QUERY_KEY.lps,
                    lp.lpId,
                ]);

            if (!previousLpPost) {
                return { previousLpPost };
            }

            const me =
                queryClient.getQueryData<ResponseMyInfoDto>([
                    QUERY_KEY.myInfo,
                ]);

            const userId = Number(me?.data.id);

            const newLike = {
                userId,
                lpId: lp.lpId,
            };

            const newLpPost: ResponseLpDto = {
                ...previousLpPost,
                data: {
                    ...previousLpPost.data,
                    likes: [
                        ...previousLpPost.data.likes,
                        newLike as any,
                    ],
                },
            };

            queryClient.setQueryData(
                [QUERY_KEY.lps, lp.lpId],
                newLpPost
            );

            return { previousLpPost };
        },

        onError: (
            err: Error,
            newLp: RequestLpDto,
            context?: LikeContext
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