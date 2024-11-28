import React from "react";
import { View } from "react-native";

export type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const CardHeader = ({ children, className }: CardHeaderProps) => {
  const defaultClasses =
    "rounded-tl-card rounded-tr-card bg-dark-background-100 px-layout py-8";

  return (
    <View className={`${defaultClasses}${className ? " " + className : ""}`}>
      {children}
    </View>
  );
};

CardHeader.displayName = "CardHeader";

export default CardHeader;
