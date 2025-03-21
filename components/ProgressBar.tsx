import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

const ProgressBar = ({ progress }: { progress: number }) => {
  const scaleX = useRef(new Animated.Value(progress)).current;

  const previousProgress = useRef(progress);

  useEffect(() => {
    Animated.timing(scaleX, {
      toValue: progress,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      previousProgress.current = progress;
    });
  }, [progress]);

  return (
    <View className="flex-1 w-full justify-center items-stretch">
      <View className="bg-dark-content-disabled relative h-1 rounded-full overflow-hidden">
        <Animated.View
          className="absolute top-0 left-0 h-full rounded-full overflow-hidden w-full"
          style={{
            transformOrigin: "left",
            transform: [{ scaleX: scaleX }],
          }}
        >
          <LinearGradient
            colors={["#8A6FF6", "#EAE5FF", "#90EFD5", "#8A6FF6", "#8A6FF6"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View className="h-full w-full" />
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;