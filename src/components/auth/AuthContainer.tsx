import React from "react";
import { SafeAreaView, View } from "react-native";

interface AuthContainerProps {
  children: React.ReactNode;
  padding?: boolean;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  padding = true,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-basic-black">
      <View className={`flex-1 ${padding ? "px-layout" : ""}`}>{children}</View>
    </SafeAreaView>
  );
};
