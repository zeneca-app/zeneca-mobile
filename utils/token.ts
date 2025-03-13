import * as SecureStore from 'expo-secure-store';

const tokenCache = {
    async getToken(key: string) {
      try {
        const token = await SecureStore.getItemAsync(key);
        return token;
      } catch (err) {
        console.error('[TokenCache] Error getting token:', err);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.error('[TokenCache] Error saving token:', err);
        throw err; // Propagate the error to handle it in the auth flow
      }
    },
    async deleteToken(key: string) {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (err) {
        console.error('[TokenCache] Error deleting token:', err);
        throw err;
      }
    }
  };

export default tokenCache;