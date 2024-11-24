import { Text as RNText, TextProps } from "react-native";

const Text = ({ ...props }: TextProps & { className?: string }) => {
  const className = props?.className || "";
  return <RNText {...props} className={`${className}`} />;
};

Text.displayName = "Text";

export default Text;
