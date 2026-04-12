import { z } from 'zod';


export const signupSchema = z.object({
  email: z.string()
    .nonempty({ message: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string()
    .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
  confirmPassword: z.string()
    .nonempty({ message: "비밀번호 재확인을 입력해주세요." }),
  nickname: z.string()
    .min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "비밀번호가 일치하지 않습니다.",
});

export type SignupFormValues = z.infer<typeof signupSchema>;


export const loginSchema = z.object({
  email: z.string().email({ message: "유효하지 않은 이메일 형식입니다." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;