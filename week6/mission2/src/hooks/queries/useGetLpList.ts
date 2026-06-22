import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";
const initialLpListData:ResponseLpListDto = {
    status: true,
    statusCode: 200,
    message: "",
    data: {
        data: []
    },
    nextCursor: 0,
    hasNext: false,
};

function useGetLpList({cursor, search, order, limit}:PaginationDto) {
    return useQuery<ResponseLpListDto, Error, ResponseLpListDto["data"]["data"]>({
        queryKey: [QUERY_KEY.lps,search, order,search, limit], //쿼리 키는 캐싱과 쿼리 식별에 사용되는 고유한 키입니다. 배열 형태로 여러 요소를 포함할 수 있습니다.
        queryFn:()=>getLpList({
            cursor,
            search,
            order,
            limit,
        }),
        //데이터가 신선하다고 간주하는 시간
        //이 시간동안은 캐시된 데이터를 그대로 사용합니다. 컴포넌트가 마운트 되거나 창에 포커스가 들어오는 경우도 재요청
        //5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄인다.

        staleTime: 1000*60*5,
        //사용되지 않는(비활성 상태)인 쿼리 데이터가 캐시에 남아있는 시간
        //stateTime이 지나고 데이터가 신선하지 않더라도 일정 시간 동안 메모리에 보관
        //그 이후에 해당 쿼리가 전혀 사용되지 않으면 gcTime이 지난 후에 제거한다
        //예) 10분동안 사용되지 않으면 해당 캐시 데이터가 삭제되어 다시 요청 시 데이터를 받아오게 합니다.
        gcTime: 1000*60*10, //10분
        //조건에 따라 쿼리를 실행 여부 제어
        //enabled:Boolean(search), //초기에는 false로 설정하여 쿼리가 자동으로 실행되지 않도록 합니다. 외부에서 받아와야 할 때 ()=> 구조로 진행해야함
        refetchInterval: 1000*60, //5분마다 자동으로 데이터를 새로고침하여 최신 상태 유지
        //retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정합니다.
        //기본 값은 3회 정도, 네트워크 오류 등 임시적인 문제를 보완할 수 있습니다.
        
        //initialData: 쿼리 실행 전 미리 제공할 초기 데이터를 설정합니다.
        //컴포넌트가 렌더링 될 때 빈 데이터 구조를 미리 제공해서 로딩 전에도 안전하게 UI를 구성할 수 있게 해주는 애다.
        //initialData: initialLpListData,

        //파라미터가 변경될 때 이전 데이터를 유지하여 UI 깜빡임을(Flicking)을 줄여줍니다.
        //ex) 페이지네이션 시 페이지 전환 사이에 이전 데이터를 보여주어 사용자 경험을 향상시킨다.
        //keepPrecviousData:true,

        select:(data)=>data.data.data,
    });//외부에서 받아와야 할 때 ()=> 구조로 진행해야함
} //홈페이지에서 받아야 함
export default useGetLpList;

