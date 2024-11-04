import React from "react";
import { TouchableOpacity, View } from "react-native";

export type PillButtonProps = {
  className?: string;
  children: React.ReactNode;
  activeClasses?: string;
  isActive?: boolean;
  onPress?: () => void;
};

const PillButton = ({
  className = "",
  activeClasses = "",
  isActive = false,
  children,
  onPress,
}: PillButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full transition-colors duration-300 ${className} ${isActive ? activeClasses : ""}`}
    >
      <View>{children}</View>
    </TouchableOpacity>
  );
};

PillButton.displayName = "PillButton";

export default PillButton;
