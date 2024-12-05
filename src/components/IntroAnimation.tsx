import { View as MView } from "moti";
import { StyleSheet, View } from "react-native";
import { Easing } from "react-native-reanimated";
import ZenecaLogo from "@/assets/zeneca-logo-bright.svg";

const _color = "#F6F5FF";
const _size = 100;

const ZenecaLogoAnimation = () => {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <MView style={[styles.dot, styles.center]}>
                {[...Array(3).keys()].map((i) => (
                    <MView
                        key={i}
                        from={{ scale: 1, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{
                            loop: true,
                            repeatReverse: false,
                            duration: 2000,
                            delay: i * 400,
                            type: "timing",
                            easing: Easing.out(Easing.ease),
                        }}
                        style={[StyleSheet.absoluteFillObject, styles.dot]}
                    />
                ))}
                <ZenecaLogo />
            </MView>
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        width: _size,
        height: _size,
        borderRadius: _size,
        backgroundColor: _color,
    },
    center: { alignItems: "center", justifyContent: "center" },
});

export default ZenecaLogoAnimation;