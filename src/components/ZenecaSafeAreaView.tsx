import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ZenecaSafeAreaView = (props: ViewProps) => {
  const insets = useSafeAreaInsets();
  const safeAreaStyles = [
    { paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 },
  ];
  const viewStyle = Array.isArray(props?.style)
    ? props?.style
    : [props?.style ?? {}];

  return (
    <View className={props.className} style={safeAreaStyles.concat(viewStyle)}>
      {props.children}
    </View>
  );
};

ZenecaSafeAreaView.displayName = "ZenecaSafeAreaView";

export default ZenecaSafeAreaView;
