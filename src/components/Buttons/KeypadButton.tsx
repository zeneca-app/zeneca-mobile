import Text from "@/components/Text";
import { TouchableOpacity } from "react-native";

export type KeypadButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
};

const KeypadButton = ({ children, onPress }: KeypadButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-12 h-12 rounded-full flex items-center justify-center"
    >
      <Text className="text-dark-content-white text-body-xl">{children}</Text>
    </TouchableOpacity>
  );
};

KeypadButton.displayName = "KeypadButton";

export default KeypadButton;
