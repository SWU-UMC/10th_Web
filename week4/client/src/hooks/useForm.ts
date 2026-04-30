import { useState, useEffect, type ChangeEvent } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  // 사용자가 인풋을 터치(클릭 후 포커스 아웃)했는지 확인해서 에러를 띄우기 위함
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  // 값이 바뀔 때마다 유효성 검사 실행
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [values]);

  const getTextInputProps = (name: keyof T) => ({
    name,
    value: values[name] as string,
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return { values, errors, touched, getTextInputProps };
}

export default useForm;