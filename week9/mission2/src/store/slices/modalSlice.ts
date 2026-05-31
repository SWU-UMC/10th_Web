import {createSlice} from "@reduxjs/toolkit"
export interface ModalState {
  isOpen: boolean;
}

const initialState: ModalState = {
  isOpen: false,
};
const modalSlice=createSlice({
    name:'modal',
    initialState,
    reducers:{
        openModal:(state)=>{
            state.isOpen = true;
            
        },
        closeModal:(state)=>{
            state.isOpen=false;
        }
        
    }
})
export const {openModal, closeModal}=modalSlice.actions;
const modalReducer=modalSlice.reducer;
//modalSlice 안에서 만들어진 reducer를 modalReducer라는 이름으로 저장
export default modalReducer;