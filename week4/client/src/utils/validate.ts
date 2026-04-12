export const validateLogin = (values: any) => {
  const errors: any = {};

  // 이메일 유효성 검사 정규식 (@와 . 포함 여부)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!values.email || !emailRegex.test(values.email)) {
    errors.email = "유효하지 않은 이메일 형식입니다.";
  }

  // 비밀번호 길이 검사 (미션 조건: 6자 미만일 경우 에러)
  if (!values.password || values.password.length < 6) {
    errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  return errors; // 에러가 없으면 빈 객체가 반환됨
};