import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const getPermission = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  };


  return {
    permission,
    getPermission,
  };
};

export { useCamera };
