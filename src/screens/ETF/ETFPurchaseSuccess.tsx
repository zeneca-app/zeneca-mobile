import Button from "@/components/Button";
import LoggedLayout from "@/components/LoggedLayout";
import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BigNumber from "bignumber.js";
import { Dimensions, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, MotiText, MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";


const { width, height } = Dimensions.get("screen");

const _size = width * 0.1;
const _color = "#5A10EF";
const _delay = 100;
const _duration = 300;
const _counterSize = 102;


const ETFPurchaseSuccess = ({ route }) => {
  const { etf, amount = 0 } = route.params;

  const navigation = useNavigation();

  const { t } = useTranslation();

  const handleContinue = () => {
    //reset go back action
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const [progress, setProgress] = React.useState(17);
  const hasVoted = React.useRef(false);
  const [active, setActive] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(true)
    }, 1000); // 5000ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array means this runs once on mount


  return (
    <LoggedLayout
      wrapperClasses=" h-24"
    >
      <View className="flex flex-row items-center justify-start gap-s px-layout">
        <View className="w-14 h-14 border border-solid border-semantic-success rounded-full flex justify-center items-center">
          <Ionicons name="checkmark" size={24} color="#04AE92" />
        </View>
      </View>

      <View className="flex flex-1 pb-layout">
        <Text className="text-heading-s text-gray-10 px-layout">
          {t("etfPurchase.success.title")}
        </Text>
        <View className="flex flex-row items-center justify-start gap-s px-layout">
          <Text className="text-body-s text-gray-50">
            {t("etfPurchase.success.subtitle")}
          </Text>
        </View>
      </View>
      <View className="px-layout">
        <Button className="" onPress={handleContinue}>
          <Text className="text-button-m">
            {t("etfPurchase.success.done_button")}
          </Text>
        </Button>
      </View>
      <View style={{ zIndex: -1 }}>
        {/* Green Background */}
        <MotiView
          animate={{
            scale: active ? 100 : 1,
          }}
          transition={{
            type: "timing",
            duration: _duration * 1.8,
          }}
          style={{
            position: "absolute",
            width: _size,
            height: _size,
            borderRadius: _size / 2,
            backgroundColor: _color,
            alignItems: "center",
            justifyContent: "center",
            opacity: active ? 1 : 0 
          }}
        />
        <Pressable
         
        >
          <MotiView
            transition={{
              type: "timing",
              duration: _duration,
            }}
            style={{
              width: _size,
              height: _size,
              borderRadius: 1,
              alignItems: "center",
              justifyContent: "center",
              
            }}>

          </MotiView>
        </Pressable>
      </View>
    </LoggedLayout>
  );
};

ETFPurchaseSuccess.displayName = "ETFPurchaseSuccess";

export default ETFPurchaseSuccess;
