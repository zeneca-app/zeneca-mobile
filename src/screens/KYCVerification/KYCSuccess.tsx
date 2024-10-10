


import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';



const KYCSuccess = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const goHome = () => {
        navigation.navigate("MainTabs");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>¡Perfecto!</Text>
                <Text style={styles.subtitle}>Estamos verificando tu identidad</Text>

                <Text style={styles.footer}>
                    Te vamos a avisar cuando la verificación esté completada.
                </Text>
            </View>
            {/* <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View> */}
            <TouchableOpacity style={styles.doneButton} onPress={goHome}>
                <Text style={styles.buttonText}>Terminado</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5A10EF', // Replace with your branding color
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        fontFamily: "Manrope_700Bold",
    },
    subtitle: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: "Manrope_500Medium",
    },
    message: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Manrope_300Light",
    },
    footer: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
    },
    loaderContainer: {
        paddingBottom: 40,
    },
    buttonContainer: {
        padding: 16,
    },
    doneButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 16,
        marginHorizontal: 20,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default KYCSuccess;