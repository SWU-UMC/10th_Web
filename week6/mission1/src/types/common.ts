import type { PAGINATION_ORDER} from "../enums/common";
export type CommonResponse<T>={
    status: boolean;
    statusCode:number;
    message:string;
    data:T;
}; //일반적인 API 응답 구조
export type CursorBasedResponse<T>={
    status: boolean;
    statusCode:number;
    message:string;
    data:T;
    nextCursor:number;
    hasNext:boolean;
};//무한 스크롤 / 페이지네이션용 응답 받을 때, nextCursor는 다음 페이지의 시작점, hasNext는 다음 페이지 존재 여부

export type PaginationDto={
    cursor?:number;
    limit?:number;
    search?:string;
    order?:PAGINATION_ORDER;  //자동 import
} //서버에 보내는 요청 파라미터, cursor는 다음 페이지의 시작점, limit는 페이지당 아이템 수, search는 검색어, order는 정렬 방식
//여기서 data 안에 뭐가 들어갈지 모르니까 제네릭 <T>로 처리
