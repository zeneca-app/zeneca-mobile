import Text from "@/components/Text";
import COLORS from "@/constants/colors";
import convertHexToRGBA from "@/utils/hexToRGBA";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const errorColor = convertHexToRGBA(COLORS.semantic.danger);
const defaultColor = convertHexToRGBA(COLORS.gray[50]);

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
  className = "",
}: JumpingInputLabelProps) => {
  const initialRender = useRef(false);
  const labelScale = useRef(new Animated.Value(1)).current;
  const labelPosition = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

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

  const renderErrorColor = useCallback(() => {
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderDefaultColor = useCallback(() => {
    Animated.timing(colorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    console.log("isErrored", isErrored);
    if (isErrored) {
      renderErrorColor();
    } else {
      renderDefaultColor();
    }
  }, [isErrored, renderErrorColor, renderDefaultColor]);

  const color = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultColor, errorColor], // Colors: Tomato to DodgerBlue
  });

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
          <Animated.Text
            className="absolute text-body-s"
            style={{ color: color }}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </View>
      {children}
    </View>
  );
};

JumpingInputLabel.displayName = "JumpingInputLabel";

export default JumpingInputLabel;
