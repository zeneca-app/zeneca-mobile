import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CryptoTokenButtonProps {
  token: string;
  iconSlot?: ReactNode;
  onPress: () => void;
  rightSlot?: ReactNode;
}

const CryptoTokenButton: React.FC<CryptoTokenButtonProps> = ({
  token,
  iconSlot = null,
  onPress,
  rightSlot = null,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row items-center gap-3"
    >
      {iconSlot && <View className="w-12 h-12">{iconSlot}</View>}
      <Text className="text-gray-10 caption-xl flex-1">{token}</Text>
      {rightSlot && <View className="w-12 h-12">{rightSlot}</View>}
    </TouchableOpacity>
  );
};

CryptoTokenButton.displayName = "CryptoTokenButton";

export default CryptoTokenButton;
