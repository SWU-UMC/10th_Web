import { type CommonResponse } from "./common";

// 영상 21:15 부분 정의
export interface RequestSignUpDto {
  email: string;
  name: string;      // 닉네임 필드
  password: string;
}

export interface UserInfoData {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ResponseSignUpDto = CommonResponse<UserInfoData>;