export type CommonResponse<T>={
    status: boolean;
    statueCode:number;
    message:string;
    data:T
};