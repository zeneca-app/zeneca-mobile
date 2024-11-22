import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/Text';
import { cssInterop } from "nativewind";
import { useTranslation } from 'react-i18next';
import * as Application from 'expo-application';
import { useUserStore } from '@/storage/userStore';
import { usePrivy } from "@privy-io/expo";
import { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Avatar from "@/assets/avatar.svg";


const ProfileScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { logout } = usePrivy();
    const queryClient = useQueryClient();
    const { user } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useUserStore((state) => state);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            setUser(undefined);
            queryClient.clear();
            await logout();
            navigation.navigate("Login");
        } catch (error) {
            console.error("ERRRORRRR", error);
        }
        setIsLoading(false);
    };
    cssInterop(Avatar, { className: "style" });

    const handleHistory = () => {
        navigation.navigate("OrderHistory");
    }

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
                        <Ionicons name={"receipt-outline"} size={24} color="white" className="mr-3" />
                        <Text className="text-lg text-white flex-1">{t("profile.history")}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#95929F" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        key={"withdraw"}
                        //onPress={() => navigation.navigate('Withdrawal')}
                        className="flex-row items-center bg-[#19181B] rounded-[40px] px-8 py-14 my-0.5"
                    >
                        <Ionicons name={"cash"} size={24} color="white" className="mr-3" />
                        <Text className="text-lg text-white flex-1">{t("profile.withdraw")}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#95929F" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        key={"logout"}
                        onPress={handleLogout}
                        className="flex-row items-center rounded-[40px] px-8 py-14 my-0.5"
                    >
                        <Ionicons name={"log-out-outline"} size={24} color="white" className="mr-3" />
                        <Text className="text-lg text-white flex-1">{t("profile.logout")}</Text>

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