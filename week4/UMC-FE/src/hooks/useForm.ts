import { useEffect, useState, type ChangeEvent } from 'react';

interface UseFormOptions<T> {
    initialValues: T; // {email: '', password: ''}
    // 값이 올바른 지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormOptions<T>) {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (name: keyof T, value: string) => {
        setValues ( {
            ...values,
            [name]: value,

        });
    };
    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        });
    };

    // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur};
    };

    // value가 바뀔 때마다 에러 검증 로직 실행
    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors);   // 오류 메시지 업데이트
    }, [validate, values]);

    return { values, errors, touched, getInputProps };
}

export default useForm;