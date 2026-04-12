export const validateLogin = (values: any) => {
  const errors: any = {};

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!values.email || !emailRegex.test(values.email)) {
    errors.email = "유효하지 않은 이메일 형식입니다.";
  }

  
  if (!values.password || values.password.length < 6) {
    errors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  return errors; 
};