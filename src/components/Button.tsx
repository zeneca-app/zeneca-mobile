import { cssInterop } from "nativewind";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

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
  loadingSlot = null,
  className = "",
  disabled = false,
  variant = "solid",
  contentClasses = "",
  disabledContentClasses = "",
  children,
}: buttonProps) => {
  const defaultClasses = {
    solid: [
      "py-4 px-6 flex-row justify-center items-center rounded-full gap-2 transition-colors duration-500",
      disabled ? "bg-dark-content-disabled" : "bg-white",
    ].join(" "),
    outline: "py-4 px-6 flex-row justify-center items-center border border-white text-white rounded-full gap-2",
    link: "py-4 px-6 flex-row justify-center items-center text-white gap-2",
  };

  const defaultContentClasses = {
    solid: "text-dark-content-dark",
    outline: "text-white", 
    link: "text-white"
  };

  const defaultContentDisabledClasses = {
    solid: "text-dark-content-30",
    outline: "text-white",
    link: "text-white"
  };

  const conditionalContentClasses = disabled
    ? `${defaultContentDisabledClasses[variant]} ${disabledContentClasses}`
    : `${defaultContentClasses[variant]} ${contentClasses}`;

  cssInterop(ActivityIndicator, {
    colorClass: {
      target: false,
      nativeStyleToProp: {
        color: "color",
      },
    },
  });

  return (
    <Pressable
      onPress={() => !isLoading && !disabled && onPress()}
      className={`${defaultClasses[variant]} ${className}`}
    >
      <Text className={conditionalContentClasses}>
        {isLoading && (loadingSlot || (
          <ActivityIndicator
            size="small"
            colorClass={defaultContentClasses[variant]}
          />
        ))}
        {children}
      </Text>
    </Pressable>
  );
};

Button.displayName = "Button";

export default Button;