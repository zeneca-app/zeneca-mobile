import { usersMyBalance } from "@/client";
import { useUserStore } from "@/storage/userStore";
import { currencyFormatter } from "@/utils/currencyUtils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import BigNumber from "bignumber.js";

export type balanceProps = {
  displayCurrencyName?: boolean;
  containerClasses?: string;
  captionClasses?: string;
};

/* const mockData = {
  data: { available: "0", equity: "2.22684", pending: "0" },
  response: {
    _bodyBlob: {},
    _bodyInit: {},
    bodyUsed: true,
    headers: { map: [Object] },
    ok: true,
    status: 200,
    statusText: "",
    type: "default",
    url: "https://sandbox.zeneca.app/v0/users/me/balance",
  },
}; */

const Balance = ({
  displayCurrencyName = false,
  containerClasses = undefined,
  captionClasses = undefined,
}: balanceProps) => {
  const { t } = useTranslation();

  const { user } = useUserStore();

  const { isPending, error, data } = useQuery({
    queryKey: ["balance"],
    queryFn: () =>
      usersMyBalance({
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }).then((res) => res),
  });

  if (!user || isPending) {
    return null;
  }
  console.log(data?.data?.available);
  //TODO Remove hardcoded values
  const equity = data?.data?.equity
    ? currencyFormatter(new BigNumber(data?.data?.equity).dividedBy(1_000_000).toFormat(2))
    : "0.00";
  const available = data?.data?.available
    ? currencyFormatter(new BigNumber(data?.data?.available).dividedBy(1_000_000).toFormat(2))
    : "0.00";
  const pending = data?.data?.pending
    ? currencyFormatter(new BigNumber(data?.data?.pending).dividedBy(1_000_000).toFormat(2))
    : "0.00";

  return (
    <View
      className={`w-full flex h-44 justify-start items-stretch px-layout${containerClasses ? " " + containerClasses : ""}`}
    >
      <Text
        className={`caption-xl text-gray-50 pb-3${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.equity")}
      </Text>
      <View className="flex-row flex-1 text-white items-start">
        <Text className="text-heading-l text-white font-sans">{equity}</Text>
        {displayCurrencyName && (
          <Text className="text-white text-base font-semibold">
            {t("home.currency")}
          </Text>
        )}
      </View>
      <Text
        className={`caption-xl text-gray-50 pb-2${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.available_funds")}
      </Text>
      <Text
        className={`caption-xl text-white pb-3${captionClasses ? " " + captionClasses : ""}`}
      >
        {available}
      </Text>
    </View>
  );
};

export default Balance;
