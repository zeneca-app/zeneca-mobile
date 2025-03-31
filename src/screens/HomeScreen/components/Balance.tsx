import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import Config from "@/config";
import { currencyFormatter } from "@/utils/currencyUtils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type balanceProps = {
  displayCurrencyName?: boolean;
  containerClasses?: string;
  captionClasses?: string;
  isRefetching?: boolean;
};

const Balance = ({
  displayCurrencyName = false,
  containerClasses = undefined,
  captionClasses = undefined,
  isRefetching = false,
}: balanceProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { isPending, error, data: balance, refetch: refetchBalance } = useQuery({
    ...usersMyBalanceOptions(),
    refetchInterval: Config.REFETCH_INTERVAL,
    staleTime: Infinity, // Consider data stale immediately
    gcTime: Infinity, // Cache for 5 minutes
  });

  console.log("balance", balance);

  if (isRefetching) {
    refetchBalance();
  }

  const equity = balance?.equity
    ? currencyFormatter(balance?.equity, 2, balance?.precision || 6)
    : "0.00";
  const available = balance?.available
    ? currencyFormatter(balance?.available, 2, balance?.precision || 6, true)
    : "0.00";

  const balancePending = balance?.pending ? currencyFormatter(balance?.pending) : "0.00";

  const LoadingTotalBalance = () => (
    <SkeletonLoadingView className="flex-1 flex-row gap-1 h-16">
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
      <SkeletonView className="w-10 h-16" />
    </SkeletonLoadingView>
  )
  const LoadingAvailable = () => (
    <SkeletonLoadingView className="flex-1">
      <SkeletonView className="w-20 h-4" />
    </SkeletonLoadingView>
  )
  return (
    <View
      className={`w-full flex justify-start items-stretch px-layout ${containerClasses ? " " + containerClasses : ""}`}
      style={{
        minHeight: 176, // h-44 equivalent
        paddingTop: Platform.OS === 'ios' ? Math.max(insets.top * 0.3, 8) : 8,
      }}
    >
      <Text
        className={`caption-l text-gray-50 pb-3 ${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.equity")}
      </Text>
      <View className="flex-row flex-1 text-white items-start">
        {isPending ? (
          <LoadingTotalBalance />
        ) : (
          <>
            <Text className="heading-l text-white">
              {balance?.equity_in_usd}
            </Text>
            {displayCurrencyName && (
              <Text className="text-white text-base font-semibold">
                {t("home.currency")}
              </Text>
            )}
          </>
        )
        }
      </View>
      <Text
        className={`caption-l text-gray-50 pb-2 ${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.available_funds")}
      </Text>
      {
        isPending ? (
          <LoadingAvailable />
        ) : (
          <Text
            className={`caption-xl text-white pb-3 ${captionClasses ? " " + captionClasses : ""}`}
          >
            {available}
          </Text>
        )
      }
    </View>
  );
};

export default Balance;