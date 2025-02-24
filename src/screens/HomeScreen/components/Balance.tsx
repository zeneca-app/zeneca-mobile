import { usersMyBalanceOptions } from "@/client/@tanstack/react-query.gen";
import SkeletonLoadingView, {
  SkeletonView,
} from "@/components/Loading/SkeletonLoadingView";
import Config from "@/config";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv"
import { useObservableSyncedQuery } from '@legendapp/state/sync-plugins/tanstack-react-query';
import { observable, observe, syncState} from "@legendapp/state";
import { use$, useObservable, Memo } from "@legendapp/state/react"
import { $Text } from "@legendapp/state/react-native"
import { observer } from "@legendapp/state/react";

export type balanceProps = {
  displayCurrencyName?: boolean;
  containerClasses?: string;
  captionClasses?: string;
  isRefetching?: boolean;
};


// Global configuration
const persistOptions = configureSynced({
  persist: {
    retrySync: true,
    plugin: ObservablePersistMMKV,
  },
  retry: {
    infinite: true, // Keep retrying until it saves
  },
});

const Balance = ({
  displayCurrencyName = false,
  containerClasses = undefined,
  captionClasses = undefined,
  isRefetching = false,
}: balanceProps) => {
  const { t } = useTranslation();

  /*  const { isPending, error, data: balance, refetch: refetchBalance } = useQuery({
     ...usersMyBalanceOptions({
       client: client,
     }),
     
   }); */

  const balanceStore$ = useObservableSyncedQuery({
    query: {
      ...usersMyBalanceOptions(),
      refetchInterval: Config.REFETCH_INTERVAL,
    },
  });
  



  // get it with use$ to start the sync
  const equity = use$(balanceStore$.equity_in_usd)
  console.log("equity", equity)

  const available = use$(balanceStore$.available_in_usd)
  console.log("available", available)

  /*   observe(() => {
      // The first get() activates the synced get function to fetch the data
      // observe is re-run when the data comes in
      const balance = balanceStore$.get()
      //console.log("balance", balance)
    }) */

  syncObservable(balanceStore$, {
    persist: {
      name: 'balance',
      retrySync: true, // Retry sync after reload
      plugin: ObservablePersistMMKV,
      //changesSince: 'last-sync' // Sync only diffs
    },

  })
  const state$ = syncState(balanceStore$)
  const error = state$.error.get()
  const isLoaded = state$.isLoaded.get()
  const lastSync = state$.lastSync.get()
  const isPersistLoaded = state$.isPersistLoaded.get()
  console.log("isLoaded", isLoaded)
  console.log("lastSync", lastSync)
  console.log("error", error)
  console.log("isPersistLoaded", isPersistLoaded)
  /* if (isRefetching) {
    refetchBalance();
  } */

  /* const equity = currencyFormatter(
    balance.equity ?? 0,
    2,
    balance.precision || 6
  );
  const available = currencyFormatter(
    balance.available ?? 0,
    2,
    balance.precision || 6,
    true
  );
 */
  //const balancePending = balance$?.pending ? currencyFormatter(balance$?.pending) : "0.00";

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
      className={`w-full flex h-44 justify-start items-stretch px-layout ${containerClasses ? " " + containerClasses : ""}`}
    >
      <Text
        className={`caption-l text-gray-50 pb-3 ${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.equity")}
      </Text>
      <View className="flex-row flex-1 text-white items-start">
        {!equity ? (
          <LoadingTotalBalance />
        ) : (
          <>
            <Text className="heading-l text-white">
              {equity}
            </Text>
            {displayCurrencyName && (
              <Text className="text-white text-base font-semibold">
                {t("home.currency")}
              </Text>
            )}
          </>
        )}
      </View>
      <Text
        className={`caption-l text-gray-50 pb-2 ${captionClasses ? " " + captionClasses : ""}`}
      >
        {t("balance.available_funds")}
      </Text>
      {
        !available ? (
          <LoadingAvailable />
        ) : (
          <Text
            className={`caption-xl text-white pb-3 ${captionClasses ? " " + captionClasses : ""}`}
          >
            ${available}
          </Text>
        )
      }
    </View>
  );
};

export default Balance;