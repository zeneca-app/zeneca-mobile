import BaseLogo from "@/assets/base-logo.svg";
import CopyIcon from "@/assets/copy.svg";
import USDCLogo from "@/assets/usdc.svg";
import CryptoNetworkButton from "@/components/Buttons/CryptoNetworkButton";
import Card from "@/components/Card";
import LoggedLayout from "@/components/LoggedLayout";
import { useUserStore } from "@/storage/";
import { shortenAddressLonger } from "@/utils/address";
import Clipboard from "@react-native-clipboard/clipboard";
import { toast } from "burnt";
import { cssInterop } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DepositCrypto = () => {
  const { t } = useTranslation();
  const { user: storedUser } = useUserStore((state) => state);

  const walletAddress = storedUser?.wallets[0]
    .smart_account_address as `0x${string}`;

  const copyToClipboard = () => {
    Clipboard.setString(walletAddress);
    toast({
      title: t("depositCrypto.addressCopied"),
      preset: "done",
    });
  };

  cssInterop(CopyIcon, { className: "style" });

  return (
    <LoggedLayout>
      <Text className="heading-s text-gray-10 px-layout pb-layout-l pt-layout-s">
        {t("depositCrypto.title")}
      </Text>

      <ScrollView className="flex-1 px-layout">
        <View className="flex gap w-full">
          <Card className="py-layout-s">
            <CryptoNetworkButton
              token="USDC"
              iconSlot={<USDCLogo width={40} height={40} />}
              onPress={() => {}}
            />
          </Card>
          <Card className="py-layout-s">
            <CryptoNetworkButton
              token="BASE"
              iconSlot={<BaseLogo width={40} height={40} />}
              onPress={() => {}}
            />
          </Card>

          <Card className="flex items-stretch justify-start gap-xs py-layout">
            <Text className="text-gray-50 caption-l">
              {t("depositCrypto.addressLabel")}
            </Text>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-dark-content-white body-s flex-1">
                {shortenAddressLonger(walletAddress)}
              </Text>
              <TouchableOpacity
                className="w-10 h-10 flex items-center justify-center"
                onPress={copyToClipboard}
              >
                <CopyIcon className="w-6 h-6" />
              </TouchableOpacity>
            </View>
          </Card>
          <View className="h-px bg-dark-background-100" />
        </View>
        <View className="text-center flex gap items-stretch pt-layout-l px-layout-l">
          <Text className="caption-xs text-gray-50 text-left">
            {t("depositCrypto.infoText")}
          </Text>

          <Text className="caption-xs text-gray-50 text-left">
            {t("depositCrypto.disclaimerText")}
          </Text>
        </View>
      </ScrollView>
    </LoggedLayout>
  );
};

DepositCrypto.displayName = "DepositCrypto";

export default DepositCrypto;
