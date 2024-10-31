import useLoggedUserActions from "@/hooks/useLoggedUserActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export type ProfileButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

const ProfileButton = ({
  children = undefined,
  className,
}: ProfileButtonProps) => {
  const { onLogout } = useLoggedUserActions;

  const defaultClasses =
    "rounded-full bg-gray-100 h-12 w-12 flex justify-center items-center";

  return (
    <TouchableOpacity
      className={`${defaultClasses} ${className}`}
      onPress={onLogout}
    >
      {children ? (
        children
      ) : (
        <Ionicons name="person-sharp" size={20} color="white" />
      )}
    </TouchableOpacity>
  );
};

ProfileButton.displayName = "ProfileButton";
export default ProfileButton;
