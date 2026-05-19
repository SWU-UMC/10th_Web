import { useState, useEffect } from 'react';

/**
 * 값을 일정 시간 지연시켜 반환하는 useDebounce 훅
 * @param value 디바운싱할 실시간 입력값
 * @param delay 지연 시간 (ms)
 */


export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. 타이머 설정 로그 (영상 기준)
    console.log(`입력: ${value} ... debounce 타이머 설정`);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      console.log(`🔔 디바운스 완료! 최종 값 변경 ->`, value);
    }, delay);

    // 2. 언마운트 또는 의존성(value, delay) 변경 시 기존 타이머 clear
    return () => {
      console.log(`❌ 이전 debounce 타이머 취소 (clearTimeout) -> 현재값: ${value}`);
      clearTimeout(timer);
    };
  }, [value, delay]); // delay 변경도 즉시 반영되도록 의존성 배열에 추가

  return debouncedValue;
}