import KeypadButton from "@/components/Buttons/KeypadButton";
import PillButton from "@/components/Buttons/PillButton";
import Text from "@/components/Text";
import AntDesign from "@expo/vector-icons/AntDesign";
import BigNumber from "bignumber.js";
import React from "react";
import { View } from "react-native";

export type KeypadProps = {
  onChange: (value: string) => void;
  value: string;
  maximun: number;
  decimals?: number;
};

const Keypad = ({ onChange, value, maximun, decimals = 2 }: KeypadProps) => {
  const resetAmount = () => {
    onChange("0");
  };

  const addAmount = (amount: number, maxAmount = maximun) => {
    const keepPeriod = value.slice(-1) === ".";
    const newValue = new BigNumber(value).plus(amount);
    const exceededMax = newValue.isGreaterThan(maxAmount);
    if (exceededMax) {
      onChange(adjustToMax(newValue.toString()));
      return;
    }
    onChange(`${newValue.toString()}${keepPeriod ? "." : ""}`);
  };

  const adjustToMax = (amount: string, maxAmount = maximun) => {
    const newValue = new BigNumber(amount);
    const maxValue = new BigNumber(maxAmount);
    if (newValue.isGreaterThan(maxValue)) {
      return maxValue.toString();
    }
    return newValue.toString();
  };

  const backspace = () => {
    const newValue = value.slice(0, -1);
    console.log("BACKSPACE: ", newValue, typeof newValue);
    if (newValue === "") {
      resetAmount();
      return;
    }
    onChange(value.slice(0, -1));
  };

  const addCharacter = (digit: string) => {
    if (value.split(".")[1]?.length === decimals) {
      return;
    }
    if (value === "0" && digit !== ".") {
      onChange(`${digit}`);
      return;
    }
    if (value.includes(".") && digit === ".") {
      return;
    }
    const newValue = `${value}${digit}`;
    if (digit !== ".") {
      onChange(adjustToMax(newValue));
      return;
    }
    onChange(newValue);
  };

  return (
    <View className="px-layout-l flex gap-l pb-layout-s">
      <View className="flex-row justify-between">
        <PillButton
          onPress={() => addAmount(5)}
          className="border border-gray-90 w-20 text-white  flex justify-center items-center"
        >
          <Text className="text-caption-l text-white">$5</Text>
        </PillButton>
        <PillButton
          onPress={() => addAmount(10)}
          className="border border-gray-90 w-20 text-white flex justify-center items-center"
        >
          <Text className="text-caption-l text-white">$10</Text>
        </PillButton>
        <PillButton
          onPress={() => addAmount(20)}
          className="border border-gray-90 w-20 text-white flex justify-center items-center"
        >
          <Text className="text-caption-l text-white">$20</Text>
        </PillButton>
        <PillButton
          onPress={() => addAmount(maximun)}
          className="border border-gray-90 w-20 text-white flex justify-center items-center"
        >
          <Text className="text-caption-l text-white">MAX</Text>
        </PillButton>
      </View>
      <View className="flex-row justify-between px-4">
        {[1, 2, 3].map((value) => (
          <KeypadButton
            key={`${value}`}
            onPress={() => addCharacter(`${value}`)}
          >
            {value}
          </KeypadButton>
        ))}
      </View>
      <View className="flex-row justify-between px-4">
        {[4, 5, 6].map((value) => (
          <KeypadButton
            key={`${value}`}
            onPress={() => addCharacter(`${value}`)}
          >
            {value}
          </KeypadButton>
        ))}
      </View>
      <View className="flex-row justify-between px-4">
        {[7, 8, 9].map((value) => (
          <KeypadButton
            key={`${value}`}
            onPress={() => addCharacter(`${value}`)}
          >
            {value}
          </KeypadButton>
        ))}
      </View>
      <View className="flex-row justify-between px-4">
        <KeypadButton onPress={() => addCharacter(".")}>{"."}</KeypadButton>
        <KeypadButton onPress={() => addCharacter("0")}>{0}</KeypadButton>
        <KeypadButton onPress={backspace}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </KeypadButton>
      </View>
      <View className="flex-row justify-between"></View>
    </View>
  );
};

Keypad.displayName = "Keypad";

export default Keypad;
