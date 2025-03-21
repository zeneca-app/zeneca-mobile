import { colors } from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

interface LoginButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress: () => void;
  isPrimary?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  testID?: string;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  icon,
  text,
  onPress,
  isPrimary = true,
  isLoading = false,
  disabled = false,
  testID,
  className,
}) => {
  return (
    <Pressable
      testID={testID}
      className={`
        flex-row w-full h-[55px] rounded-full justify-center items-center mb-6
        ${isPrimary ? 'bg-white' : 'bg-dark-background-80'}
        ${disabled ? 'opacity-50' : ''}
        ${className || ''}
      `}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? colors.darkHighlight : "white"}
        />
      ) : (
        <Ionicons
          name={icon}
          size={24}
          color={isPrimary ? colors.darkHighlight : "white"}
          className="mr-2.5"
        />
      )}
      <View className="ml-4">
        <Text
          className={`
            text-body-s font-medium
            ${isPrimary ? 'text-dark-content-dark' : 'text-white'}
            ${disabled ? 'text-dark-content-disabled' : ''}
          `}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default LoginButton;
