import { View } from "react-native";

export type SeparatorProps = {
  className?: string;
};

const Separator = ({ className = "" }) => (
  <View className={`h-separator ${className}`} />
);

Separator.displayName = "Separator";

export default Separator;
