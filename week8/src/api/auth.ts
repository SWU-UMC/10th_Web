import axios from 'axios';

export interface UserInfoData {
  id?: number;
  email?: string;
  accessToken: string;
  refreshToken: string;
}

// 1. signUpData를 실제로 사용하고(read), 데이터도 명확히 return(반환)합니다.
export const postSignUp = async (signUpData: any): Promise<{ data: UserInfoData }> => {
  // baseUrl 설정에 따라 앞의 주소(http://localhost:8000)는 수정될 수 있습니다.
  return await axios.post('/v1/auth/sign-up', signUpData);
};

// 2. 로그아웃 함수도 정상적으로 return을 붙여줍니다.
export const postLogOut = async () => {
  return await axios.post('/v1/auth/sign-out');
};