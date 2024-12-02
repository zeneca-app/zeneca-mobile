import React from "react";
import LineHome from "@/assets/line-home.svg";
import ProfileButton from "@/components/ProfileButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, SafeAreaView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export type LoggedLayoutProps = {
  children: React.ReactNode;
  navLeft?: React.ReactNode;
  navCenter?: React.ReactNode;
  navRight?: React.ReactNode;
  wrapperClasses?: string;
};

const LoggedLayout = ({
  children,
  navLeft = null,
  navCenter = null,
  navRight = null,
  wrapperClasses = "",
}: LoggedLayoutProps) => {
  return (
    <SafeAreaView
      className={`flex-1 items-stretch bg-basic-black relative font-sans`}
    >
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

export function LeftNav({ onPress }: { onPress?: () => void }) {
  const navigation = useNavigation();

  const currentRoute = useRoute();

  const withBackButton = currentRoute.name !== "Home";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  if (withBackButton) {
    return (
      <TouchableOpacity onPress={handlePress}>
        <Ionicons name="chevron-back" size={22} color="white" />
      </TouchableOpacity>
    );
  }

  return <ProfileButton />;
}

LoggedLayout.displayName = "LoggedLayout";

export default LoggedLayout;