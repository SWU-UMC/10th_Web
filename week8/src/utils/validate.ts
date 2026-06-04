export interface UserSignInInformation {
  email: "";
  password: "";
}

function validateUser(values: UserSignInInformation) {
  const errors = {
    email: "",
    password: "",
  };

  // @와 .을 포함하는지 검사하는 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(values.email)) {
    errors.email = "올바른 이메일 형식을 입력해주세요.";
  }

  // 첨부 이미지의 에러 메시지 "비밀번호는 8자 이상이어야 합니다."에 맞춤 변경
  if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
}

export function validateSignIn(values: UserSignInInformation) {
  return validateUser(values);
}