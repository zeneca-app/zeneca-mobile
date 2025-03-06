import { STOCKS } from "@/constants/stocks";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { AssetPrice } from "@/client/";


export type AssetListItemProps = {
  asset: AssetPrice;
};


const AssetListItem = ({ asset }: AssetListItemProps) => {
  const navigation = useNavigation();

  // Safely check if the stock logo exists in our constants
  const stockLogoExists = asset?.symbol && 
    STOCKS && 
    STOCKS[asset.symbol as keyof typeof STOCKS]?.logo;
  
  // Safely check if the asset has a logo_url
  const hasLogoUrl = !!asset?.logo_url;

  const handlePress = () => {
    navigation.navigate("ETFDetail", { asset });
  };

  const renderLogo = () => {
    if (stockLogoExists) {
      // Use the stock logo from constants
      const Logo = STOCKS[asset.symbol as keyof typeof STOCKS].logo;
      return <Logo style={{ height: "100%", width: "100%" }} />;
    } /* else if (hasLogoUrl) {
      // Use the logo URL from the asset
      return (
        <Image
          source={{ uri: asset.logo_url }}
          style={{ height: "100%", width: "100%" }}
          resizeMode="contain"
          // Add error handling for image loading failures
          onError={() => console.log(`Failed to load image for ${asset.symbol}`)}
        />
      );
    } */ else {
      // Fallback when no logo is available
      return (
        <View className="items-center justify-center w-full h-full bg-gray-80">
          <Text className="text-gray-40 text-lg font-bold">
            {asset.symbol?.[0] || "?"}
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity className="flex-row gap-3" onPress={handlePress}>
      <View className="w-12 h-12 bg-gray-90 rounded-full overflow-hidden">
        {renderLogo()}
      </View>
      <View className="flex-1 flex justify-center items-stretch">
        <Text className="text-gray-10 caption-xl">{asset.display_name}</Text>
        <Text className="text-gray-50 caption-xl">{asset.symbol}</Text>
      </View>
      <View className="flex-1 flex justify-center items-end">
      </View>
    </TouchableOpacity>
  );
};

AssetListItem.displayName = "AssetListItem";

export default AssetListItem;
