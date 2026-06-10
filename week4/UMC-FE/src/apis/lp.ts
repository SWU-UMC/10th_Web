import {axiosInstance} from './axios';

// 목록 조회
export const getLps = async (sort: string, cursor: number | null = null) => {
    const url = cursor ? `/v1/lps?sort=${sort}&cursor=${cursor}` : `v1/lps?sort=${sort}`
    const {data} = await axiosInstance.get(url);
    return data.data;
};

// 상세 조회
export const getLpDetail = async (lpId: number) => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpId}`);
    console.log("상세 페이지 데이터:", data);
    return data.data;
};

// 댓글 목록 조회
export const getLpComments = async (lpId: string, order: string, cursor: number | null) => {
    const url = cursor
        ? `/v1/lps/${lpId}/comments?order=${order}&cursor=${cursor}`
        : `/v1/lps/${lpId}/comments?order=${order}`;
    const {data} = await axiosInstance.get(url);

    return data.data;
}