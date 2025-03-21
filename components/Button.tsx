import { cssInterop } from "nativewind";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { Link } from "expo-router";

export type buttonProps = {
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingSlot?: React.ReactNode;
  className?: string;
  contentClasses?: string;
  disabledContentClasses?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "link";
  testID?: string;
};

const Button = ({
  onPress,
  href,
  isLoading,
  loadingSlot = null,
  className = "",
  disabled = false,
  variant = "solid",
  contentClasses = "",
  disabledContentClasses = "",
  children,
  testID,
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

  const ButtonContent = () => (
    <Text className={conditionalContentClasses}>
      {isLoading && (loadingSlot || (
        <ActivityIndicator
          size="small"
          color={defaultContentClasses[variant] === "text-white" ? "#FFFFFF" : "#000000"}
        />
      ))}
      {children}
    </Text>
  );

  if (href) {
    return (
      <Link href={href} asChild disabled={disabled || isLoading}>
        <Pressable testID={testID} className={`${defaultClasses[variant]} ${className}`}>
          <ButtonContent />
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={() => !isLoading && !disabled && onPress?.()}
      className={`${defaultClasses[variant]} ${className}`}
    >
      <ButtonContent />
    </Pressable>
  );
};

Button.displayName = "Button";

export default Button;