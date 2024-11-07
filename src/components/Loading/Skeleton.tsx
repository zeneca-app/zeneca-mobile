import ExpoSkeletonLoading from "expo-skeleton-loading";
import { View } from "react-native";

const SkeletonDigits = () => {
  return <View className="w-" />;
};

const SkeletonLoading = ({ children }: { children: React.ReactNode }) => {
  return (
    <ExpoSkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
      {children}
    </ExpoSkeletonLoading>
  );
};

export default SkeletonLoading;
