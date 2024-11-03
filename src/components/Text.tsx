import { Text as RNText, TextProps } from "react-native";

const Text = ({ ...props }: TextProps & { className?: string }) => {
  const className = props?.className || "";
  return (
    <RNText
      {...props}
      className={`font-sans transition-colors duration-300 ${className}`}
    />
  );
};

Text.displayName = "Text";

export default Text;
