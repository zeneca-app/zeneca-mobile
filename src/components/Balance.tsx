import { useBalance } from "@/context/BalanceContext";
import { formatCurrency } from "@/utils/currencyUtils";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export type balanceProps = {
  displayCurrencyName?: boolean;
  containerClasses?: string;
  captionClasses?: string;
};

const Balance = ({
  displayCurrencyName = false,
  containerClasses = undefined,
  captionClasses = undefined,
}: balanceProps) => {
  const { t } = useTranslation();

  const { balanceFormatted } = useBalance();

  return (
    <View
      className={`w-full flex h-24 justify-start items-stretch${containerClasses ? " " + containerClasses : ""}`}
    >
      <Text
        className={`caption-xl text-gray-50 pb-3${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.equity")}
      </Text>
      <View className="flex-row flex-1 text-white items-start">
        <Text className="text-heading-l text-white font-sans">$</Text>
        <Text className="text-heading-l text-white font-sans">
          {formatCurrency(Number(balanceFormatted), "USD")}
        </Text>
        {displayCurrencyName && (
          <Text className="text-white text-base font-semibold">
            {t("home.currency")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Balance;
