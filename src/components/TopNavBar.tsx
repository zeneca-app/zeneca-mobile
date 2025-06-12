import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export type TopNavBarProps = {
  navLeft?: React.ReactNode;
  navCenter?: React.ReactNode;
  navRight?: React.ReactNode;
  wrapperClasses?: string;
};

const TopNavBar = ({
  navLeft = <DefaultLeftNav />,
  navCenter = null,
  navRight = null,
  wrapperClasses = "",
}: TopNavBarProps) => {
  return (
    <View className={`flex-row px-layout h-12 items-center  ${wrapperClasses}`}>
      <View className="w-12 pr-3">{navLeft}</View>
      <View className="flex-1 flex justify-center items-center">
        {navCenter}
      </View>
      <View className="w-12">{navRight}</View>
    </View>
  );
};

function DefaultLeftNav() {
  const navigation = useNavigation();
  if (navigation.canGoBack()) {
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color="white" />
      </TouchableOpacity>
    );
  }
  return null;
}

export default TopNavBar;
