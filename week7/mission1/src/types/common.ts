import type { PAGINATION_ORDER} from "../enums/common";
export type CommonResponse<T>={
    status: boolean;
    statusCode:number;
    message:string;
    data:T;
}; //일반적인 API 응답 구조
export type CursorData<T> = {
  data: T;
  nextCursor: number | null;
  hasNext: boolean;
};

export type CursorBasedResponse<T> = CommonResponse<CursorData<T>>;

export type PaginationDto={
    cursor?:number;
    limit?:number;
    search?:string;
    order?:PAGINATION_ORDER;  //자동 import
} //서버에 보내는 요청 파라미터, cursor는 다음 페이지의 시작점, limit는 페이지당 아이템 수, search는 검색어, order는 정렬 방식
//여기서 data 안에 뭐가 들어갈지 모르니까 제네릭 <T>로 처리
