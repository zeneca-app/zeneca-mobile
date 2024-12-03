import { Text, TouchableOpacity, View } from "react-native";

export type BottomSheetButtonProps = {
  label: string;
  caption?: string;
  icon: React.ReactElement;
  onPress: () => void;
};

const BottomSheetButton = ({
  icon,
  label,
  caption = undefined,
  onPress,
}: BottomSheetButtonProps) => {
  return (
    <TouchableOpacity className="flex-row gap-3" onPress={onPress}>
      <View className="w-12 h-12 rounded-full bg-basic-black flex justify-center items-center ">
        {icon}
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-white button-m">{label}</Text>
        {caption && (
          <Text className="text-gray-50 caption-xl">{caption}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

BottomSheetButton.displayName = "BottomSheetButton";

export default BottomSheetButton;
