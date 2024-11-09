import GeneralLoader from "@/assets/general-loader.svg";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, Modal, View } from "react-native";

interface FullScreenLoaderProps {
  visible: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible }) => {
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
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex flex-1 justify-center items-center bg-gray-alpha-90">
        <Animated.View
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
      </View>
    </Modal>
  );
};

export default FullScreenLoader;
