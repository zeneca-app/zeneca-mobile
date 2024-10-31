import React from "react";
import { TouchableOpacity } from "react-native";

export type buttonProps = {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingSlot?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const Button = ({
  onPress,
  isLoading,
  loadingSlot,
  className,
  disabled = false,
  children,
}: buttonProps) => {
  const defaultClasses =
    "py-4 px-6 flex-row justify-center items-center bg-white text-dark-content-dark rounded-full gap-2";

  const handlePress = () => {
    if (!isLoading && !disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${defaultClasses} ${className}`}
    >
      {isLoading && loadingSlot ? { loadingSlot } : children}
    </TouchableOpacity>
  );
};

Button.displayName = "Button";

export default Button;
