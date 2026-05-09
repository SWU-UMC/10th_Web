import type { CursorBasedResponse } from "../types/common";
export type Tag={
    id: number;
    name: string;
};  //Tag의 배열
export type Likes={
    id: number;
    userId: number;
    lpId: number;
}; //Likes의 배열
export type ResponseLpListDto = CursorBasedResponse<{
    data:{
        id: number;
        title:string;
        content: string;
        thumbnail:string;
        published: boolean;
        authorld:number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[]; //Tag의 배열
        likes: Likes[]; //Likes의 배열
    }[];
}>//data안에 뭐가 들어갈지 모르니까 제네릭 <T>로 처리, 여기서는 LP 리스트니까 data 안에 id와 title이 들어가는 형태로 정의
