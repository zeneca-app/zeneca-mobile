import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/zeneca-logo-bright.svg';

interface AuthHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const { t } = useTranslation();
  
  return (
    <View className="w-full flex-row items-center justify-center py-4 relative">
      {showBackButton && (
        <Pressable 
          onPress={onBackPress}
          className="absolute left-0 p-2"
          accessibilityLabel={t('common.back')}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      )}
      
      <Logo width={40} height={40} />
      
      {title && (
        <Text className="heading-m text-white ml-3">{title}</Text>
      )}
    </View>
  );
}; 