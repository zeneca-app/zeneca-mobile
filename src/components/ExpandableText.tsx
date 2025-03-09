import React, { useState, useRef, useEffect, useMemo } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
    containerClassName?: string;
    className?: string;
    toggleClassName?: string;
    expandText?: string;
    collapseText?: string;
    animate?: boolean;
    animationDuration?: number;
}

// Constants for maintainability
const DEFAULT_MAX_LENGTH = 150;
const DEFAULT_ANIMATION_DURATION = 500;
const PRIMARY_COLOR = "#fff"; // Matches Tailwind's blue-500 by default
const DEFAULT_LINE_HEIGHT = 24; // Matches Tailwind's leading-6
const DEFAULT_TRUNCATED_LINES = 6; // Show 4 lines when truncated
const DEFAULT_TRUNCATED_HEIGHT = DEFAULT_LINE_HEIGHT * DEFAULT_TRUNCATED_LINES; // 96px

const ExpandableText: React.FC<ExpandableTextProps> = ({
    text = "",
    maxLength = DEFAULT_MAX_LENGTH,
    containerClassName = "",
    className = "",
    toggleClassName = "",
    expandText = "Read more",
    collapseText = "Read less",
    animate = true,
    animationDuration = DEFAULT_ANIMATION_DURATION,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [heights, setHeights] = useState<{ full: number; truncated: number } | null>(null);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const contentRef = useRef<View>(null);

    // Validate props
    const effectiveMaxLength = Math.max(0, maxLength);
    const showToggle = useMemo(() => text.length > effectiveMaxLength, [text, effectiveMaxLength]);

    // Truncated and full text
    const truncatedText = `${text.substring(0, effectiveMaxLength)}...`;
    const displayText = isExpanded ? text : (showToggle ? truncatedText : text);

    // Measure heights once using a single hidden render
    const measureHeights = (e: any) => {
        if (heights) return; // Only measure once
        contentRef.current?.measure((x, y, width, fullHeight) => {
            const truncatedHeight = Math.min(fullHeight, DEFAULT_TRUNCATED_HEIGHT); // 4 lines max
            setHeights({ full: fullHeight, truncated: truncatedHeight });
            animatedHeight.setValue(showToggle ? truncatedHeight : fullHeight);
        });
    };

    // Animate height when expanded or heights change
    useEffect(() => {
        if (!heights || !showToggle) return;

        Animated.timing(animatedHeight, {
            toValue: isExpanded ? heights.full : heights.truncated,
            duration: animate ? animationDuration : 0,
            useNativeDriver: false,
        }).start();
    }, [isExpanded, heights, showToggle, animate, animationDuration]);

    const toggleExpand = () => setIsExpanded((prev) => !prev);

    // Tailwind class names
    const defaultContainerClassName = "relative rounded-lg overflow-hidden";
    const defaultTextContainerClassName = "p-1";

    const defaultToggleClassName = "flex-row items-center mt-1";
    const defaultToggleTextClassName = "text-white text-base";

    // Fallback for empty text
    if (!text) {
        return <View className={`${defaultContainerClassName} ${containerClassName}`} />;
    }

    return (
        <View className={`${defaultContainerClassName} ${containerClassName}`}>
            {/* Hidden measurement view (rendered once) */}
            {!heights && (
                <View className="absolute opacity-0" onLayout={measureHeights}>
                    <View ref={contentRef}>
                        <Text className={`${className}`}>
                            {text}
                        </Text>
                    </View>
                </View>
            )}

            {/* Animated content */}
            <Animated.View
                style={[
                    { height: heights ? animatedHeight : undefined },
                    !heights && { maxHeight: 48 }, // Initial estimate: 2 lines
                ]}
                className={`${defaultTextContainerClassName}`}
            >
                <Text className={`${className}`}>
                    {displayText}
                </Text>
            </Animated.View>

            {/* Toggle button */}
            {showToggle && (
                <Pressable
                    onPress={toggleExpand}
                    className={`${defaultToggleClassName} ${toggleClassName}`}
                    accessible
                    accessibilityLabel={isExpanded ? collapseText : expandText}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                >
                    <Text className={defaultToggleTextClassName}>
                        {isExpanded ? collapseText : expandText}
                    </Text>
                    <Svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
                        className="ml-1"
                    >
                        <Path
                            d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            stroke={PRIMARY_COLOR}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </Svg>
                </Pressable>
            )}
        </View>
    );
};

export default React.memo(ExpandableText, (prev, next) =>
    prev.text === next.text &&
    prev.maxLength === next.maxLength &&
    prev.expandText === next.expandText &&
    prev.collapseText === next.collapseText &&
    prev.animate === next.animate &&
    prev.animationDuration === next.animationDuration
);