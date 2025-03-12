import React from "react";
import { View } from "react-native";

export type CardFooterProps = {
    children: React.ReactNode;
    className?: string;
};

const CardFooter = ({ children, className }: CardFooterProps) => {
    const defaultClasses =
        "rounded-bl-card rounded-br-card bg-dark-background-100 px-layout py-12";

    return (
        <View className={`${defaultClasses}${className ? " " + className : ""}`}>
            {children}
        </View>
    );
};

CardFooter.displayName = "CardFooter";

export default CardFooter;
