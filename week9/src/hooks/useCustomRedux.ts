import { useDispatch as useDefaultDispatch, useSelector as useDefaultSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useDispatch = () => useDefaultDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;