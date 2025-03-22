import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button';
import Text from '@/components/Text';
import BottomActions from '@/components/BottomActions';

interface ETFActionsProps {
  isSellAvailable: boolean;
  onBuyPress: () => void;
  onSellPress: () => void;
}

const ETFActions: React.FC<ETFActionsProps> = ({
  isSellAvailable,
  onBuyPress,
  onSellPress
}) => {
  const { t } = useTranslation();

  return (
    <BottomActions>
      <View className="flex-row gap-s px-layout">
        <Button
          className="flex-1"
          onPress={onBuyPress}
        >
          <Text className="button-m">{t("etfDetail.buy")}</Text>
        </Button>
        {isSellAvailable && (
          <Button
            className="flex-1"
            onPress={onSellPress}
          >
            <Text className="button-m">{t("etfDetail.sell")}</Text>
          </Button>
        )}
      </View>
    </BottomActions>
  );
};

export default ETFActions; 