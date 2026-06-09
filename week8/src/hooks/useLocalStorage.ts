export const useLocalStorage = () => {
  const setItem = (key: string, value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("로컬스토리지 저장 실패:", error);
    }
  };

  const getItem = (key: string) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("로컬스토리지 로드 실패:", error);
      return null;
    }
  };

  const removeItem = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("로컬스토리지 삭제 실패:", error);
    }
  };

  return { setItem, getItem, removeItem };
};