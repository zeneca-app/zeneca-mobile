import React from "react";
import { View } from "react-native";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  const defaultClasses = "rounded-card bg-dark-background px-layout py-9 m-px";

  return (
    <View className={`${defaultClasses}${className ? " " + className : ""}`}>
      {children}
    </View>
  );
};

Card.displayName = "Card";

export default Card;
