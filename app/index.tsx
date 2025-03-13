import GradientCircle from "@/assets/zeneca-gradient-circle.svg";
import Logo from "@/assets/zeneca-logo-bright.svg";
import LogoLetter from "@/assets/zeneca-logo-letters.svg";
import Button from "@/components/Button";
import { useNavigation } from "@react-navigation/native";
import { cssInterop } from "nativewind";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  View,
} from "react-native";

/**
 * Login Screen Component
 * 
 * Pure entry point for the authentication flow:
 * - Displays app branding
 * - Provides access to login options
 * - No authentication logic (moved to LoginOptions)
 * 
 * This simplification:
 * 1. Makes the component more focused
 * 2. Removes potential race conditions
 * 3. Centralizes auth logic in LoginOptions
 * 4. Improves state management
 */
const WelcomeScreen = () => {
  const { t } = useTranslation();

  /**
   * Navigates to the login options screen
   * Single responsibility: Navigation to auth methods
   */
 
  // Enable CSS interop for SVG components
  cssInterop(LogoLetter, { className: "style" });

  return (
    <SafeAreaView className="flex-1 justify-start items-stretch bg-basic-black">
      <View className="flex flex-1 justify-between items-stretch px-layout">
        {/* Logo and Gradient Section */}
        <View className="relative flex justify-center items-center w-full">
          <GradientCircle className="relative" />
          <View className="absolute flex justify-center items-center">
            <Logo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12" />
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 flex justify-between">
          {/* App Description */}
          <View className="flex flex-1 justify-center items-center gap-6">
            <LogoLetter className="h-8 w-full" />
            <View>
              <Text className="caption-xl text-gray-50 text-center">
                {t("login.description_line_1")}
              </Text>
              <Text className="caption-xl text-gray-50 text-center">
                {t("login.description_line_2")}
              </Text>
            </View>
          </View>

          {/* Login Button */}
          <View className="flex items-stretch justify-start gap-buttons">
            <Button href="/signup" className="w-full">
              <Text className="button-m">{t("login.signUpButton")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

WelcomeScreen.displayName = "WelcomeScreen";
export default WelcomeScreen;
