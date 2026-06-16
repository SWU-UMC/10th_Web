import { useMutation } from "@tanstack/react-query"
import { postLike } from "../../apis/lp.ts"
import { queryClient } from "../../App.tsx"
import { QUERY_KEY } from "../../constants/key.ts";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, data?.data?.lpId],
                exact: true,

            })

        },
        //에러 발생시
        onError: (error, variables, context) => {},
        //요청 직전에 실행되기 직전에 실행되는 함수 : Optimistic 함수
        onMutate: (variables) => {
        },
        //요청이 끝난 후 실행
        onSettled:(data,error,variables, context) =>{},

    });
}

export default usePostLike;
