
export const storage = {
    set(key: string, value: any, useSession = false) {
        const str = JSON.stringify(value);
        if (useSession) {
            sessionStorage.setItem(key, str);
        } else {
            localStorage.setItem(key, str);
        }
    },
    get<T = any>(key: string, useSession = false): T | null {
        const str = useSession ? sessionStorage.getItem(key) : localStorage.getItem(key);
        if (!str) return null;
        try {
            return JSON.parse(str) as T;
        } catch {
            return null;
        }
    },
    remove(key: string, useSession = false) {
        if (useSession) {
            sessionStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }
    },
    clear(useSession = false) {
        if (useSession) {
            sessionStorage.clear();
        } else {
            localStorage.clear();
        }
    },
};
