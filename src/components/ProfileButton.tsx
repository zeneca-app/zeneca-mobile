import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { useUserStore } from "@/storage/userStore";
import Ionicons from "@expo/vector-icons//Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import FullScreenLoader from "./FullScreenLoader";

export type ProfileButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const ProfileButton = ({
  children = undefined,
  className,
}: ProfileButtonProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore((state) => state);

  const profileOptionsRef = useRef<BottomSheetModal>(null);

  const { logout } = usePrivy();

  const defaultClasses =
    "rounded-full bg-gray-100 h-12 w-12 flex justify-center items-center";

  const handleOpenProfileOptions = () => {
    profileOptionsRef.current?.present();
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setUser(undefined);
      await logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("ERRRORRRR", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <TouchableOpacity
        className={`${defaultClasses} ${className}`}
        onPress={handleOpenProfileOptions}
      >
        {children ? (
          children
        ) : (
          <Ionicons name="person-sharp" size={20} color="white" />
        )}
      </TouchableOpacity>
      <BottomSheet ref={profileOptionsRef}>
        <BottomSheetView className="px-layout items-stretch rounded-card m-2 flex gap-buttons pb-14">
          <Button onPress={handleLogout}>
            <AntDesign name="logout" size={16} color="black" />
            <Text className="text-button-m">{t("home.logout.title")}</Text>
          </Button>
        </BottomSheetView>
      </BottomSheet>
      <FullScreenLoader visible={isLoading} />
    </>
  );
};

ProfileButton.displayName = "ProfileButton";
export default ProfileButton;