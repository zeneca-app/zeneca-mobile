import GeneralLoader from "@/assets/general-loader.svg";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export type LoaderSpinnerProps = {
  className?: string;
};

const LoaderSpinner = ({ className = "" }: LoaderSpinnerProps) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  return (
    <Animated.View
      className={className}
      style={{
        transform: [
          {
            rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    >
      <GeneralLoader className="w-12 h-12" />
    </Animated.View>
  );
};

LoaderSpinner.displayName = "LoaderSpinner";

export default LoaderSpinner;
