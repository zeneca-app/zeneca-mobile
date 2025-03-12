import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomActions = ({ children }: { children: React.ReactNode }) => {
    const insets = useSafeAreaInsets();

    const { height } = Dimensions.get('window');
    const dynamicPaddingTop = Math.max(height * 0.05, 30); // 5% of screen height or minimum 30px

    return (
        <>
            <View className="flex absolute bottom-0 h-bottom-actions w-full">
                <LinearGradient
                    style={{
                        flex: 1,
                        paddingTop: dynamicPaddingTop
                    }}
                    colors={["#0D0C0E00", "#0D0C0E", "#0D0C0E"]}
                >
                    {children}
                </LinearGradient>
            </View>
        </>
    );
};

BottomActions.displayName = "BottomActions";

export default BottomActions;
