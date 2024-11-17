import JumpingInputLabel from "@/components/Forms/JumpingInputLabel";
import Text from "@/components/Text";
import { useCallback, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

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
  leftSlot = null,
  hint = "",
  required = false,
}: InputWrapperProps) => {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const colorOpacity = useRef(new Animated.Value(0)).current;

  const isErrored = Boolean(error);

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
  }, [error, renderError, renderDefault]);

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
              isErrored={isErrored}
            >
              {children}
            </JumpingInputLabel>
          </View>
        </View>
      </View>

      <View
        className={`h-px rounded-full ${isErrored ? "bg-semantic-danger" : "bg-gray-50"}`}
      />
      <View className="h-6 w-full">
        {Boolean(error) ? (
          <Text className="text-semantic-danger text-caption-l">{error}</Text>
        ) : (
          <Text className="text-gray-50 text-caption-l">{hint}</Text>
        )}
      </View>
    </View>
  );
};

InputWrapper.displayName = "InputWrapper";

export default InputWrapper;
