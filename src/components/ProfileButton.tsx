import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@/components/BottomSheet/BottomSheet";
import Ionicons from "@expo/vector-icons//Ionicons";
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

  const profileOptionsRef = useRef<BottomSheetModal>(null);

  const defaultClasses =
    "rounded-full bg-gray-100 h-12 w-12 flex justify-center items-center";

  const handleOpenProfileOptions = () => {
    profileOptionsRef.current?.present();
  };

  return (
    <>
      <TouchableOpacity
        className={`${defaultClasses} ${className}`}
        onPress={() => navigation.navigate("Profile")}
      >
        {children ? (
          children
        ) : (
          <Ionicons name="person-sharp" size={20} color="white" />
        )}
      </TouchableOpacity>
      <FullScreenLoader visible={isLoading} />
    </>
  );
};

ProfileButton.displayName = "ProfileButton";
export default ProfileButton;
