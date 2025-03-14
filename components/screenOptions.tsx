import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import ProfileButton from "@/components/ProfileButton";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { router } from "expo-router";

// Common header options
const defaultScreenOptions = {
    title: '',
    headerBackTitle: '',
    headerStyle: { backgroundColor: Colors.basicBlack },
    headerShadowVisible: false,
    headerTransparent: true,
    headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="white" />
        </TouchableOpacity>
    ),
};

const screenConfigs = {
    noHeader: { headerShown: false },
    defaultHeader: defaultScreenOptions,
    homeHeader: {
        ...defaultScreenOptions,
        headerLeft: () => <ProfileButton />
    },
    modalScreen: { headerShown: false, presentation: "modal" as const },
    profileScreen: {
        headerShown: false,
        presentation: 'card' as const,
        animation: 'slide_from_left' as const,
    }
};

export default screenConfigs;
