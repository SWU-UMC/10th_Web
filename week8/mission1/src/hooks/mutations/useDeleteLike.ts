import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
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

function useDeleteLike() {
    return useMutation({
        mutationFn: deleteLike,

        onMutate: async (lp: RequestLpDto) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.lps, lp.lpId],
            });

            const previousLpPost: ResponseLpDto | undefined =
                queryClient.getQueryData<ResponseLpDto>([
                    QUERY_KEY.lps,
                    lp.lpId,
                ]);

            const me: ResponseMyInfoDto | undefined =
                queryClient.getQueryData<ResponseMyInfoDto>([
                    QUERY_KEY.myInfo,
                ]);

            const userId: number = Number(me?.data.id);

            const likedIndex: number =
                previousLpPost?.data.likes.findIndex(
                    (like: any) => like.userId === userId
                ) ?? -1;

            const newLpPost = {
                ...previousLpPost,
                data: {
                    ...previousLpPost?.data,
                    likes:
                        likedIndex !== -1
                            ? previousLpPost?.data.likes.filter(
                                  (like: any) =>
                                      like.userId !== userId
                              )
                            : previousLpPost?.data.likes,
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

export default useDeleteLike;