import React from 'react';
import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/styles/colors";

interface LoginButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress: () => void;
    isPrimary?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
    icon,
    text,
    onPress,
    isPrimary = true,
    isLoading = false,
    disabled = false
}) => {
    return (
        <Pressable
            style={[
                styles.commonButton,
                isPrimary ? styles.primaryButton : styles.secondaryButton,
                disabled && styles.disabledButton
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={isPrimary ? colors.darkHighlight : "white"}
                />
            ) : (
                <Ionicons
                    name={icon}
                    size={24}
                    color={isPrimary ? colors.darkHighlight : "white"}
                    style={styles.buttonIcon}
                />
            )}
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.buttonText,
                        isPrimary ? styles.primaryText : styles.secondaryText,
                        disabled && styles.disabledText
                    ]}
                >
                    {text}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    commonButton: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
    },
    primaryButton: {
        backgroundColor: "white",
    },
    secondaryButton: {
        backgroundColor: "#252328",
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonIcon: {
        marginRight: 10,
    },
    textContainer: {
        marginLeft: 15,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
    },
    primaryText: {
        color: colors.darkHighlight,
    },
    secondaryText: {
        color: "white",
    },
    disabledText: {
        color: '#999',
    },
});

export default LoginButton;