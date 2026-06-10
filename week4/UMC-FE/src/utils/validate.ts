export type UserSigninInfomation = {
    email: string;
    password: string;
}

function validateUser(values: UserSigninInfomation) {
    const errors = {
        email: '',
        password: '',
    }

    if (!values.email) {
        errors.email = '이메일을 입력해주세요.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!values.password) {
        errors.password = '비밀번호를 입력해주세요.';
    } else if (values.password.length < 8 || values.password.length > 20) {
        errors.password = '비밀번호는 8자 이상 20자 이하여야 합니다.';
    }

    return errors;
}

function validateSignin (values: UserSigninInfomation) {
    return validateUser(values);
}

export { validateSignin };