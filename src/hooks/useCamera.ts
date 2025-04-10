import { Camera, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequesting, setIsRequesting] = useState(false);

  const getPermission = async () => {
    try {
      setIsRequesting(true);
      if (!permission?.granted) {
        const result = await requestPermission();
        return result.granted;
      }
      return permission.granted;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  // Request permission on mount for Android
  useEffect(() => {
    if (Platform.OS === 'android' && !permission?.granted && !isRequesting) {
      getPermission();
    }
  }, [permission?.granted]);

  return {
    permission,
    getPermission,
    isRequesting
  };
};

export { useCamera };
