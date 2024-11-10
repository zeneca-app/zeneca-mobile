import React from "react";
import { Modal, View } from "react-native";
import LoaderSpinner from "./LoaderSpinner";

interface FullScreenLoaderProps {
  visible: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ visible }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="flex flex-1 justify-center items-center bg-gray-alpha-90">
        <LoaderSpinner />
      </View>
    </Modal>
  );
};

export default FullScreenLoader;
