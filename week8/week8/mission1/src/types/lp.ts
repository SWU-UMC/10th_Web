
import type { CommonResponse } from "../types/common";
export type Tag={
    id: number;
    name: string;
};  //Tag의 배열
export type Likes={
    id: number;
    userId: number;
    lpId: number;
}; //Likes의 배열
export type Lp={
    
        id: number;
        title:string;
        content: string;
        thumbnail:string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[]; //Tag의 배열
        likes: Likes[]; //Likes의 배열

};
export type RequestLpDto={
    lpId: number;
}
export type ResponseLpDto=CommonResponse<Lp>;
export interface ResponseLpListDto {
  data: Lp[];
  hasNext: boolean;
  nextCursor: number;
}
export type ResponseLikeLpDto=CommonResponse<{
    id:number;
    userId:number;
    lpId:number;
}>;
