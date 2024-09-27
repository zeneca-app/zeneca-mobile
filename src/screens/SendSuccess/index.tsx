import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';


const SendSuccessScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const goHome = () => {
        navigation.navigate("MainTabs");
    };

    const goReceipt = () => {
        navigation.navigate("TransactionReceipt");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.checkmarkContainer}>
                    <Feather name="check" size={40} color="#FFFFFF" />
                </View>

                <Text style={styles.title}>¡Listo!</Text>
                <Text style={styles.subtitle}>
                    Estamos procesando tu transacción.{'\n'}
                    Pronto estará disponible.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={goHome}>
                    <Text style={styles.primaryButtonText}>Entendido</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={goReceipt}>
                    <Text style={styles.secondaryButtonText}>Ver comprobante</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAAAAA',
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 'auto',
    },
    primaryButton: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButtonText: {
        color: '#000000',
        fontSize: 16,
        fontFamily: "Manrope_500Medium",
    },
    secondaryButton: {
        padding: 15,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default SendSuccessScreen;