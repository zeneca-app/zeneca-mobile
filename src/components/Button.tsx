import React from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";

export type buttonProps = {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingSlot?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  disabledClasses?: string;
};

const Button = ({
  onPress,
  isLoading,
  loadingSlot = null,
  className,
  disabled = false,
  children,
  disabledClasses = "",
}: buttonProps) => {
  const defaultClasses =
    "py-5 px-6 flex-row justify-center items-center bg-white text-dark-content-dark rounded-full gap-2 transition-colors duration-300";

  const defaultDisabledClasses = "!bg-dark-content-disabled ";

  const handlePress = () => {
    if (!isLoading && !disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${defaultClasses} ${className} ${disabled ? defaultDisabledClasses + " " + disabledClasses : ""}`}
    >
      {isLoading && !loadingSlot ? <ActivityIndicator size="small" color="#ffffff" /> : children}
    </TouchableOpacity>
  );
};

Button.displayName = "Button";

export default Button;
