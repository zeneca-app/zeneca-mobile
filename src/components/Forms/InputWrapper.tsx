import JumpingInputLabel from "@/components/Forms/JumpingInputLabel";
import Text from "@/components/Text";
import COLORS from "@/constants/colors";
import { useCallback, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const errorColor = COLORS.semantic.danger;
const defaultColor = COLORS.gray[50];

export type InputWrapperProps = {
  label: string;
  isFocused: boolean;
  error: string;
  children: React.ReactNode;
  leftSlot?: React.ReactNode;
  hint?: string;
  required?: boolean;
};

const InputWrapper = ({
  label = "",
  isFocused,
  error,
  children,
  labelClasses = "",
  leftSlot = null,
  hint = "",
  required = false,
}: InputWrapperProps) => {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const colorOpacity = useRef(new Animated.Value(0)).current;

  const renderError = useCallback(() => {
    Animated.parallel([
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderDefault = useCallback(() => {
    Animated.parallel([
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (Boolean(error)) {
      renderError();
    } else {
      renderDefault();
    }
  });

  const color = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultColor, errorColor], // Colors: Tomato to DodgerBlue
  });

  return (
    <View className="flex items-stretch">
      <View
        className={`flex-row items-stretch justify-start ${leftSlot !== null ? "gap" : ""}`}
      >
        {leftSlot}
        <View className="flex-1 justify-start items-stretch">
          <View className="input-wrapper flex relative items-stretch justify-start">
            <JumpingInputLabel
              label={required ? `${label}*` : label}
              isFocused={isFocused}
              isErrored={Boolean(error)}
              className={labelClasses}
            >
              {children}
            </JumpingInputLabel>
          </View>
        </View>
      </View>

      <Animated.View
        className="h-px rounded-full"
        style={{ backgroundColor: color }}
      />
      <Animated.View className="h-6 w-full">
        {Boolean(error) ? (
          <Text className="text-semantic-danger text-caption-l">{error}</Text>
        ) : (
          <Text className="text-gray-50 text-caption-l">{hint}</Text>
        )}
      </Animated.View>
    </View>
  );
};

InputWrapper.displayName = "InputWrapper";

export default InputWrapper;
