import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import Config from "@/config";
import { currencyFormatter } from "@/utils/currencyUtils";
import { useQuery } from "@tanstack/react-query";
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

  const { isPending, error, data } = useQuery({
    ...usersMyBalanceOptions({
      client: client,
    }),
    refetchInterval: Config.REFETCH_INTERVAL,
  });

  const equity = data?.equity
    ? currencyFormatter(data?.equity, 2, data?.precision || 6)
    : "0.00";
  const available = data?.available
    ? currencyFormatter(data?.available, 2, data?.precision || 6, true)
    : "0.00";

  const pending = data?.pending ? currencyFormatter(data?.pending) : "0.00";

  return (
    <View
      className={`w-full flex h-44 justify-start items-stretch px-layout${containerClasses ? " " + containerClasses : ""}`}
    >
      <Text
        className={`caption-xl text-gray-50 pb-3${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.equity")}
      </Text>
      <View className="flex-row flex-1 text-white items-start ">
        {isPending ? (
          <SkeletonLoadingView className="flex-1 flex-row gap-1 h-16">
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
            <SkeletonView className="w-10 h-16" />
          </SkeletonLoadingView>
        ) : (
          <>
            <Text className="heading-l text-white ">{equity}</Text>
            {displayCurrencyName && (
              <Text className="text-white text-base font-semibold">
                {t("home.currency")}
              </Text>
            )}
          </>
        )}
      </View>
      <Text
        className={`caption-xl text-gray-50 pb-2${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.available_funds")}
      </Text>
      {isPending ? (
        <SkeletonLoadingView className="flex-1">
          <SkeletonView className="w-20 h-4" />
        </SkeletonLoadingView>
      ) : (
        <Text
          className={`caption-xl text-white pb-3${captionClasses ? " " + captionClasses : ""}`}
        >
          {available}
        </Text>
      )}
    </View>
  );
};

export default Balance;
