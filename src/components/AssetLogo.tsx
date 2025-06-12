import Text from "@/components/Text";
import { STOCKS } from "@/constants/stocks";
import React from "react";
import { Image, View, ViewStyle } from "react-native";

interface AssetLogoProps {
  symbol?: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: ViewStyle;
  fallbackComponent?: React.ReactNode;
  bgColorClass?: string;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const fontSizeMap = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};

export const AssetLogo: React.FC<AssetLogoProps> = ({
  symbol,
  logoUrl,
  size = "md",
  className = "",
  style,
  fallbackComponent,
}) => {
  // Get size classes
  const sizeClass = sizeMap[size];
  const fontSize = fontSizeMap[size];

  // Check if stock logo exists in constants
  const isLogoAvailable =
    symbol && STOCKS && STOCKS[symbol as keyof typeof STOCKS]?.logo;

  // Base container classes
  const containerClasses = `${sizeClass} rounded-full overflow-hidden ${className}`;

  // Render stock logo from constants
  if (isLogoAvailable) {
    const Logo = STOCKS[symbol as keyof typeof STOCKS].logo;
    return <Logo style={{ height: "100%", width: "100%" }} />;
  }

  // Render custom fallback if provided
  if (fallbackComponent) {
    return (
      <View className={containerClasses} style={style}>
        {fallbackComponent}
      </View>
    );
  }

  // Render logo from URL if available
  if (logoUrl) {
    return (
      <View className={containerClasses} style={style}>
        <Image
          source={{ uri: logoUrl }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
          onError={(error) => {
            console.warn(`Failed to load image for ${symbol}:`, error);
          }}
        />
      </View>
    );
  }

  // Default fallback - first letter of symbol in a circle
  return (
    <View
      className={`${containerClasses} flex items-center justify-center`}
      style={style}
    >
      <Text className={`${fontSize} text-gray-40 font-bold`}>
        {symbol?.[0]?.toUpperCase() || "?"}
      </Text>
    </View>
  );
};

export default AssetLogo;
