import React, { cloneElement, ReactElement } from "react";
import { TouchableOpacity, View } from "react-native";

export type buttonProps = {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingSlot?: React.ReactNode;
  className?: string;
  contentClasses?: string;
  disabledContentClasses?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "link";
};

const Button = ({
  onPress,
  isLoading,
  loadingSlot,
  className,
  disabled = false,
  variant = "solid",
  contentClasses = "",
  disabledContentClasses = "",
  children,
}: buttonProps) => {
  const defaultClasses = {
    solid: `py-4 px-6 flex-row justify-center items-center rounded-full gap-2 transition-colors duration-500 ${disabled ? "bg-dark-content-disabled" : "bg-white"}`,
    outline:
      "py-4 px-6 flex-row justify-center items-center border border-white text-white rounded-full gap-2",
    link: "py-4 px-6 flex-row justify-center items-center text-white gap-2",
  };

  const defaultContentClasses = {
    solid: "text-dark-content-dark",
    outline: "text-white",
    link: "text-white",
  };

  const defaultContentDisabledClasses = {
    solid: "text-dark-content-30",
    outline: "text-white",
    link: "text-white",
  };

  const conditionalContentClasses = disabled
    ? `${defaultContentDisabledClasses[variant]} ${disabledContentClasses}`
    : `${defaultContentClasses[variant]} ${contentClasses}`;

  const handlePress = () => {
    if (!isLoading && !disabled) {
      onPress();
    }
  };

  const renderChildrenWithDefaultClasses = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return cloneElement(child, {
          className: `transition-colors duration-500 h-6 ${conditionalContentClasses} ${child.props.className}`,
        });
      }
      return child;
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${defaultClasses[variant]} ${className}`}
    >
      {isLoading && loadingSlot
        ? { loadingSlot }
        : renderChildrenWithDefaultClasses(children)}
    </TouchableOpacity>
  );
};

Button.displayName = "Button";

export default Button;
