
export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null; // ⭐ 이것도 추가 (안 넣으면 undefined 됨)
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  // ⭐⭐ 핵심 수정
  return { getItem, setItem, removeItem };
};
