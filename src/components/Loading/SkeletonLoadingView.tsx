import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export const SkeletonView = ({ className }: { className?: string }) => {
  return <View className={`rounded-full bg-dark-skeleton ${className}`} />;
};

export const SkeletonOrderListItem = () => {
  return (
    <>
      <View className="flex-row gap-3 px-layout">
        <SkeletonView className="w-12 h-12  overflow-hidden" />
        <View className="flex-1 flex justify-center items-stretch gap-2">
          <SkeletonView className="h-4 w-1/2" />
          <SkeletonView className="h-4 w-1/3" />
        </View>
        <View className="flex-1 flex justify-center items-end gap-2">
          <SkeletonView className="h-4 w-12" />
          <SkeletonView className="h-4 w-10" />
        </View>
      </View>
      <View className="h-separator" />
    </>
  );
};

export const SkeletonStockListItem = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <>
      <View className={`flex-row gap-3 ${className}`}>
        <SkeletonView className="w-12 h-12  overflow-hidden" />
        <View className="flex-1 flex justify-center items-stretch gap-2">
          <SkeletonView className="h-4 w-1/2" />
          <SkeletonView className="h-4 w-1/3" />
        </View>
        <View className="flex-1 flex justify-center items-end gap-2">
          <SkeletonView className="h-4 w-12" />
        </View>
      </View>
      <View className="h-separator" />
    </>
  );
};

const SkeletonLoadingView = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const skeletonAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      skeletonAnimation();
    });
  }, []);

  useEffect(() => {
    skeletonAnimation();
  }, []);

  return (
    <Animated.View className={className} style={{ opacity }}>
      {children}
    </Animated.View>
  );
};

export default SkeletonLoadingView;
