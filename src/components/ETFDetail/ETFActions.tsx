import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/Button';
import Text from '@/components/Text';
import BottomActions from '@/components/BottomActions';
import MarketHours from '@/components/MarketHours';
import { AssetPrice } from '@/client';

interface ETFActionsProps {
  asset: AssetPrice;
  price: string;
  isMarketOpen: boolean;
  isSellAvailable: boolean;
}

const ETFActions: React.FC<ETFActionsProps> = ({
  asset,
  price,
  isMarketOpen,
  isSellAvailable
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <BottomActions>
      <View className="flex-row gap-s px-layout">
        <Button
          className="flex-1"
          onPress={() =>
            navigation.navigate('ETFPurchase', {
              etf: { ...asset, price },
            })
          }
        >
          <Text className="button-m">{t("etfDetail.buy")}</Text>
        </Button>
        {isSellAvailable && (
          <Button
            className="flex-1"
            onPress={() =>
              navigation.navigate('ETFSell', {
                etf: { ...asset, price },
              })
            }
          >
            <Text className="button-m">{t("etfDetail.sell")}</Text>
          </Button>
        )}
      </View>
    </BottomActions>
  );
};

export default ETFActions; 