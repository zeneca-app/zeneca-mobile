import * as SecureStore from "expo-secure-store";

const tokenCache = {
    getToken(key: string) {
        return SecureStore.getItemAsync(key);
    },
    saveToken(key: string, value: string) {
        return SecureStore.setItemAsync(key, value);
    },
};

export default tokenCache;