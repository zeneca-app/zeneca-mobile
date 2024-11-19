import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export const useCheckUpdate = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkUpdate = async () => {
    try {
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    checkUpdate,
    isChecking,
  };
};
