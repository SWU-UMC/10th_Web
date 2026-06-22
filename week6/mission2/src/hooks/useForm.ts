/*이거를 좀 더 보는게 좋음 */
import {useState, useEffect} from "react";
import type { ChangeEvent } from "react";

interface UseFormProps<T>{
    initialValue: T; //형태 {email: '', password: ''}
    validate:(values: T)=>Record<keyof T, string>; //values에 T를 넘겨줘서 올바른지 체크하는 함수
}
function useForm<T>({initialValue, validate}: UseFormProps<T>){ //위에서 props로 T인 제너릭을 넘겨줬으니까 function이 이렇게 됨 
    const [values, setValues]=useState(initialValue); //위에 코드에서 initialvalue랑 validate 값을 받아온거임
    //border을 터치했을 때 나오게 
     //터치 됐으면 false, 아니면 true 여서 boolean
    const [touched, setTouched] = useState<Record<string, boolean>>();
    const [errors, setErrors] = useState<Record<string, string>>();
    //사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange=(name: keyof T, text:string)=>{
        setValues({
            ...values, //기존 값 유지
            [name]:text,
        });
    };//name과 text를 불러옴
    const handleBlur=(name: keyof T)=>{
        setTouched({
            ...touched,
            [name]:true,
        })
    }

    //이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps=(name:keyof T)=>{
        const value=values[name];
        const onChange=(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

        )=>handleChange(name, e.target.value);

        const onBlur=()=> handleBlur(name);
        
        return {value, onChange, onBlur};
    };
        //values가 변경될 때마다 에러 검증 로직이 실행됨.
        //{email: ''}
        useEffect(()=>{
            const newErrors=validate(values);
            setErrors(newErrors); //newErrors를 setErrors 안에 넣어줄 것임

            //오류 메시지 업뎃

        },[validate, values]);
    return{values, errors, touched, getInputProps};
}
export default useForm;