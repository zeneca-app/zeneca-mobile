import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, RadialGradient,LinearGradient,  Stop, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const InvestmentComingSoonScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="pie-chart" size={40} color="white" />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Inversiones</Text>
                <Text style={styles.subtitle}>
                    Invierte en acciones de Estados Unidos desde tu cuenta bancaria preferida
                </Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Acceso anticipado</Text>
                    <Ionicons name="arrow-forward" size={20} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.background}>
                <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
                <Defs>
          <LinearGradient
            id="shapeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor="#220E4A" stopOpacity="1" />
            <Stop offset="50%" stopColor="#3E0F95" stopOpacity="1" />
            <Stop offset="100%" stopColor="#894099" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0 ${height * 0.4} Q${width * 0.5} ${height * 0.2}, ${width} ${height * 0.4} L${width} ${height} L0 ${height} Z`}
          fill="url(#shapeGradient)"
        />
                </Svg>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 140,
        zIndex: 1,
    },
    iconContainer: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    title: {
        fontSize: 32,

        color: 'white',
        marginBottom: 10,
        fontFamily: "Manrope_500Medium",
    },
    subtitle: {
        fontSize: 18,
        color: '#F8F3FF',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: "Manrope_500Medium",
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center', // Add this to center content horizontally
        marginTop: 20,
        width: '90%', // Adjust width as needed
    },
    buttonText: {

        fontSize: 18,
        fontFamily: "Manrope_500Medium",
        marginRight: 10,
        color: 'black',
    },
});
export default InvestmentComingSoonScreen;