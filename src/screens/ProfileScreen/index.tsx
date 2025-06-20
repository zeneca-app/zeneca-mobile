import Avatar from "@/assets/avatar.svg";
import Text from "@/components/Text";
import { useUserStore } from "@/storage/";
import { useKYCStatusStore } from "@/storage/kycStatusStore";
import { Ionicons } from "@expo/vector-icons";
import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import * as Application from "expo-application";
import { cssInterop } from "nativewind";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { logout } = usePrivy();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUserStore((state) => state);
  const { reset } = useKYCStatusStore((state) => state);

  const handleLogout = async () => {
    try {
      reset();
      setIsLoading(true);
      setUser(undefined);
      queryClient.clear();
      await logout();
      // Close modal first, then navigate to Login
      //navigation.navigate("Login");
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsLoading(false);
  };
  cssInterop(Avatar, { className: "style" });

  const handleHistory = () => {
    navigation.navigate("OrderHistory");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Header with close button */}
        <View className="px-5 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-end"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar and Name */}
        <View className="items-center mt-4 mb-12">
          <View className="w-24 h-24 rounded-full items-center justify-center mb-4">
            <Avatar className="h-24 w-full" />
          </View>
          <Text className="text-xl text-white">{user?.email}</Text>
        </View>

        {/* Menu Items */}
        <View className="space-y-2">
          <TouchableOpacity
            key={"history"}
            onPress={handleHistory}
            className="flex-row items-center bg-[#19181B] rounded-[40px] px-8 py-14 my-0.5"
          >
            <Ionicons
              name={"receipt-outline"}
              size={24}
              color="white"
              className="mr-3"
            />
            <Text className="text-lg text-white flex-1">
              {t("profile.history")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#95929F" />
          </TouchableOpacity>
          <TouchableOpacity
            key={"withdraw"}
            onPress={() => navigation.navigate("Withdrawl")}
            className="flex-row items-center bg-[#19181B] rounded-[40px] px-8 py-14 my-0.5"
          >
            <Ionicons name={"cash"} size={24} color="white" className="mr-3" />
            <Text className="text-lg text-white flex-1">
              {t("profile.withdraw")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#95929F" />
          </TouchableOpacity>
          <TouchableOpacity
            key={"logout"}
            onPress={handleLogout}
            className="flex-row items-center rounded-[40px] px-8 py-14 my-0.5"
          >
            <Ionicons
              name={"log-out-outline"}
              size={24}
              color="white"
              className="mr-3"
            />
            <Text className="text-lg text-white flex-1">
              {t("profile.logout")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version Number */}
        <View className="absolute bottom-8 w-full items-center">
          <Text className="text-sm text-gray-400">
            {t("profile.version")} {Application.nativeApplicationVersion}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
