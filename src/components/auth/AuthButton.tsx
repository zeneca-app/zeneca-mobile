import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

interface AuthButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  testID?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  testID,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500';
      case 'secondary':
        return 'bg-secondary-500';
      case 'outline':
        return 'bg-transparent border border-white';
      default:
        return 'bg-primary-500';
    }
  };
  
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`py-3 px-4 rounded-md items-center justify-center ${getButtonStyle()} ${(disabled || isLoading) ? 'opacity-50' : ''}`}
      testID={testID}
    >
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-medium text-base">{title}</Text>
      )}
    </Pressable>
  );
}; 