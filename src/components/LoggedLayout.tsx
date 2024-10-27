import LineHome from "@/assets/line-home.svg";
import ProfileButton from "@/components/ProfileButton";
import React from "react";
import { ImageBackground, SafeAreaView, View } from "react-native";

export type LoggedLayoutProps = {
  children: React.ReactNode;
  navLeft?: React.ReactNode;
  navCenter?: React.ReactNode;
  navRight?: React.ReactNode;
};

const LoggedLayout = ({
  children,
  navLeft = null,
  navCenter = null,
  navRight = null,
}: LoggedLayoutProps) => {
  return (
    <SafeAreaView className="flex-1 items-stretch bg-basic-black relative">
      <ImageBackground source={LineHome} resizeMode="cover" />
      <View className="flex-row px-layout h-12 items-center">
        <View className="w-12 pr-3">
          {navLeft ? navLeft : <DefaultLeftNav />}
        </View>
        <View className="flex-1">{navCenter}</View>
        <View className="w-12">{navRight}</View>
      </View>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
};

function DefaultLeftNav() {
  return <ProfileButton />;
}

LoggedLayout.displayName = "LoggedLayout";

export default LoggedLayout;
