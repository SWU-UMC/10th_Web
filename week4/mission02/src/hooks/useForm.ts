import { useEffect, useState } from "react";

interface UseFormProps<T> {
    initialValue: T; 
    // 값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValue);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

    // 입력값이 변경될 때마다 호출되는 함수
    const handleChange = (name: keyof T, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    }

    const handleBlur = (name: keyof T) => {
        setTouched(prev => ({ ...prev, [name]: true }));
    }

    const getInputProps = (name: keyof T) => {
        const value: T[keyof T] = values[name];

        const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return { value, onChange, onBlur };
    };

    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors); // 오류 메세지 업뎃
    }, [validate, values]);

    return { values, errors, touched, getInputProps };

};

export default useForm;