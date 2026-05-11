import {axiosInstance} from './axios';

// 목록 조회
export const getLps = async (sort: string) => {
    const {data} = await axiosInstance.get(`/v1/lps?sort=${sort}`);
    return data.data.data;
};

// 상세 조회
export const getLpDetail = async (lpId: number) => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpId}`);
    console.log("상세 페이지 데이터:", data);
    return data.data;
};