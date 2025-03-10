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
}

const LoginButton: React.FC<LoginButtonProps> = ({
  icon,
  text,
  onPress,
  isPrimary = true,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Pressable
      className={`
        flex-row w-full h-[55px] rounded-[25px] justify-center items-center mb-[25px]
        ${isPrimary ? 'bg-white' : 'bg-[#252328]'}
        ${disabled ? 'opacity-50' : ''}
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
          className="mr-[10px]"
        />
      )}
      <View className="ml-[15px]">
        <Text
          className={`
            text-base font-[Manrope_500Medium]
            ${isPrimary ? 'text-[#darkHighlight]' : 'text-white'}
            ${disabled ? 'text-[#999]' : ''}
          `}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

export default LoginButton;
