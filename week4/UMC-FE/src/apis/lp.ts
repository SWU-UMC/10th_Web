import {axiosInstance} from './axios';

// 목록 조회
export const getLps = async (
    cursor: number | null = 0, 
    search: string = "", 
    order: string = "desc"
) => {
    const { data } = await axiosInstance.get('/v1/lps', {
        params: {
            cursor: cursor || 0,
            limit: 10,
            search: search || undefined,
            order: order
        }
    });
    
    return data.data; 
};

// 상세 조회
export const getLpDetail = async (lpId: number) => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpId}`);
    console.log("상세 페이지 데이터:", data);
    return data.data;
};

// lp 작성
export const postLp = async (payload: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
}) => {
    const { data } = await axiosInstance.post('/v1/lps', payload);
    return data;
};

// 댓글 목록 조회
export const getLpComments = async (lpId: string, order: string, cursor: number | null) => {
    const url = cursor
        ? `/v1/lps/${lpId}/comments?order=${order}&cursor=${cursor}`
        : `/v1/lps/${lpId}/comments?order=${order}`;
    const {data} = await axiosInstance.get(url);

    return data.data;
}


// 댓글 작성
export const postComment = async (lpId: string, payload: { content: string }) => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, payload);
    return data; 
};

// 댓글 수정
export const updateComment = async (cId: number, payload: { content: string }) => {
    const { data } = await axiosInstance.patch(`/v1/comments/${cId}`, payload);
    return data;
};

// 댓글 삭제
export const deleteComment = async (cId: number) => {
    const { data } = await axiosInstance.delete(`/v1/comments/${cId}`);
    return data;
};