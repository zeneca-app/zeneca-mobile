import React from 'react';
import { View, Dimensions, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import {
    runOnJS,
    useAnimatedReaction,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated'

//import { LineChart } from 'react-native-chart-kit';
import { LineGraph } from 'react-native-graph'
import { generateRandomGraphData } from '../../data/GraphData'
import { useCallback, useState } from 'react'



const POINT_COUNT = 70
const POINTS = generateRandomGraphData(POINT_COUNT)

const StockDetailsScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>


            </View>

            <View style={styles.stockInfo}>
                <View style={styles.stockLogo}>
                    <Text style={styles.stockLogoText}>AAPL</Text>
                </View>
                <Text style={styles.stockName}>Apple</Text>
                <Text style={styles.stockPrice}>$216.24</Text>
                <Text style={styles.stockChange}>
                    <Text style={styles.arrowDown}>▼</Text> $9.57 (4.24%) Este mes
                </Text>
            </View>

            <View style={styles.row}>

                <LineGraph style={styles.graph}
                    points={POINTS} color="#4484B2" animated={true}
                    enablePanGesture={true}
                    
                />
            </View>


            <View style={styles.timeframes}>
                <TouchableOpacity style={styles.timeframeButton}>
                    <Text style={styles.timeframeText}>1D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.timeframeButton, styles.selectedTimeframe]}>
                    <Text style={[styles.timeframeText, styles.selectedTimeframeText]}>1S</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeframeButton}>
                    <Text style={styles.timeframeText}>1M</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeframeButton}>
                    <Text style={styles.timeframeText}>1A</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>Sobre Apple</Text>
                <Text style={styles.aboutText}>
                    Apple es una de las empresas más grandes del mundo, con una amplia cartera de productos de...
                </Text>
            </View>

            <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Comprar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    graph: {
        alignSelf: 'center',
        width: '100%',
        aspectRatio: 1.4,
        marginVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        color: '#fff',
        fontSize: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookmarkIcon: {
        color: '#fff',
        fontSize: 24,
    },
    stockInfo: {
        alignItems: 'center',
        marginTop: 20,
    },
    stockLogo: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
    },
    stockLogoText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    stockName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    stockPrice: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 5,
    },
    stockChange: {
        color: '#ff4136',
        fontSize: 16,
        marginTop: 5,
    },
    arrowDown: {
        fontSize: 12,
    },
    chart: {
        marginTop: 20,
        height: 200,
    },
    chartPlaceholder: {
        flex: 1,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    timeframes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    timeframeButton: {
        padding: 10,
        borderRadius: 20,
    },
    selectedTimeframe: {
        backgroundColor: '#fff',
    },
    timeframeText: {
        color: '#fff',
    },
    selectedTimeframeText: {
        color: '#000',
    },
    aboutSection: {
        marginTop: 20,
    },
    aboutTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    aboutText: {
        color: '#aaa',
        marginTop: 5,
    },
    buyButton: {
        backgroundColor: '#3C28A4',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default StockDetailsScreen;