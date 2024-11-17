import { Text as RNText, TextProps } from "react-native";

const Text = ({ ...props }: TextProps & { className?: string }) => {
  const className = props?.className || "";
  return (
    <RNText
      className={`font-sans transition-colors duration-300 text-inherit ${className}`}
      {...props}
    />
  );
};

Text.displayName = "Text";

export default Text;
