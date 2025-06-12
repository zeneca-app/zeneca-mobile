import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

interface AnimatedWavyLineProps {
  width?: number | string;
  height?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  direction?: "left" | "right";
  fullWidth?: boolean;
}

const AnimatedWavyLine: React.FC<AnimatedWavyLineProps> = ({
  width = "100%",
  height = 100,
  color = "black",
  strokeWidth = 4,
  duration = 2000, // Animation duration in ms
  direction = "right", // 'left' or 'right'
  fullWidth = true, // Whether to fill parent width
}) => {
  // Create animated value for wave movement
  const moveAnim = useRef(new Animated.Value(0)).current;

  // Start animation when component mounts
  useEffect(() => {
    // Create infinite loop animation
    const animation = Animated.loop(
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false, // Need to use JS driver for SVG animations
      }),
    );

    animation.start();

    // Clean up animation when component unmounts
    return () => {
      animation.stop();
    };
  }, [moveAnim, duration]);

  // Set the translation based on animation value
  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === "right" ? [0, 60] : [60, 0], // One wavelength is 60
  });

  // Use Dimensions to get screen width if needed
  const getViewBox = () => {
    if (fullWidth) {
      return `0 0 420 ${height}`; // Fixed viewBox width to ensure pattern repeats properly
    }
    return `0 0 ${typeof width === "number" ? width : 300} ${height}`;
  };

  // Create animated components
  const AnimatedG = Animated.createAnimatedComponent(G);

  return (
    <View style={[styles.container, { width: "100%", height }]}>
      <Svg
        width="100%"
        height={height}
        viewBox={getViewBox()}
        preserveAspectRatio="xMidYMid meet"
      >
        <AnimatedG x={translateX}>
          {/* We create multiple copies of the wave to ensure continuous animation */}
          <Path
            d={`
              M -60,${height / 2} 
              Q -45,${height / 2 - 15} -30,${height / 2} 
              Q -15,${height / 2 + 15} 0,${height / 2} 
              Q 15,${height / 2 - 15} 30,${height / 2} 
              Q 45,${height / 2 + 15} 60,${height / 2} 
              Q 75,${height / 2 - 15} 90,${height / 2} 
              Q 105,${height / 2 + 15} 120,${height / 2} 
              Q 135,${height / 2 - 15} 150,${height / 2} 
              Q 165,${height / 2 + 15} 180,${height / 2} 
              Q 195,${height / 2 - 15} 210,${height / 2} 
              Q 225,${height / 2 + 15} 240,${height / 2}
              Q 255,${height / 2 - 15} 270,${height / 2}
              Q 285,${height / 2 + 15} 300,${height / 2}
              Q 315,${height / 2 - 15} 330,${height / 2}
              Q 345,${height / 2 + 15} 360,${height / 2}
            `}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </AnimatedG>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // This hides the wave outside the container
    width: "100%", // Ensure container takes full width by default
  },
});

export default AnimatedWavyLine;
