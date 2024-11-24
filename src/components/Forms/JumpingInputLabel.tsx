import Text from "@/components/Text";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export type JumpingInputLabelProps = {
  label: string;
  isFocused: boolean;
  children: React.ReactNode;
  isErrored?: boolean;
  className?: string;
};

const JumpingInputLabel = ({
  label,
  isFocused,
  isErrored,
  children,
}: JumpingInputLabelProps) => {
  const initialRender = useRef(false);
  const labelScale = useRef(new Animated.Value(isFocused ? 0.75 : 1)).current;
  const labelPosition = useRef(new Animated.Value(isFocused ? 0 : 16)).current;

  const dropLabel = useCallback(() => {
    Animated.parallel([
      Animated.timing(labelScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(labelPosition, {
        toValue: 16,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const raiseLabel = useCallback(() => {
    Animated.parallel([
      Animated.timing(labelScale, {
        toValue: 0.75,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      if (!isFocused) {
        dropLabel();
      } else {
        raiseLabel();
      }
    }
  }, [isFocused, dropLabel, raiseLabel]);

  return (
    <View className="flex items-stretch">
      <View className="overflow-visible relative h-4">
        <Animated.View
          className="absolute overflow-visible"
          style={{
            transform: [
              {
                scale: labelScale,
              },
              {
                translateY: labelPosition,
              },
            ],
          }}
        >
          <Text
            className={`absolute body-s ${isErrored ? "text-semantic-danger" : "text-gray-50"}`}
          >
            {label}
          </Text>
        </Animated.View>
      </View>
      {children}
    </View>
  );
};

JumpingInputLabel.displayName = "JumpingInputLabel";

export default JumpingInputLabel;
