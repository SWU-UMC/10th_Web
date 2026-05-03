export const useLocalStorage = <T>(key: string) => {
    const setItem = (value: unknown) => {
        try {
            if (typeof value === 'string') {
                window.localStorage.setItem(key, value);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return null;
            try {
                return JSON.parse(item) as T;
            } catch {
                return item as unknown as T;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return { setItem, getItem, removeItem };
};