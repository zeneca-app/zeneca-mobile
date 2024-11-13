import LineHome from "@/assets/line-home.svg";
import ProfileButton from "@/components/ProfileButton";
import { useUserStore } from "@/storage/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { ImageBackground, SafeAreaView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import TopNavBar, { TopNavBarProps } from "./TopNavBar";

export type LoggedLayoutProps = {
  children: React.ReactNode;
} & TopNavBarProps;

const LoggedLayout = ({
  children,
  navLeft = null,
  navCenter = null,
  navRight = null,
  wrapperClasses = "",
}: LoggedLayoutProps) => {
  const navigation = useNavigation();

  /*   const { user } = useUserStore();

  if (!user) {
    navigation.navigate("Login");
  } */

  return (
    <SafeAreaView
      className={`flex-1 items-stretch bg-basic-black relative font-sans`}
    >
      <ImageBackground source={LineHome} resizeMode="cover" />
      <ImageBackground source={LineHome} resizeMode="cover" />
      <TopNavBar
        wrapperClasses={wrapperClasses}
        navLeft={navLeft ? navLeft : <DefaultLeftNav />}
        navCenter={navCenter}
        navRight={navRight}
      />
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

function DefaultLeftNav() {
  const navigation = useNavigation();

  const currentRoute = useRoute();

  const withBackButton = currentRoute.name !== "Home";

  if (withBackButton) {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color="white" />
      </TouchableOpacity>
    );
  }

  return <ProfileButton />;
}

LoggedLayout.displayName = "LoggedLayout";

export default LoggedLayout;
