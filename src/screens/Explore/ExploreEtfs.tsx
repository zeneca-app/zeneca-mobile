import CopyIcon from "@/assets/copy.svg";
import { assetsGetAssets } from "@/client";
import StockListItem from "@/components/ListItems/StockListItem";
import LoggedLayout from "@/components/LoggedLayout";
import { useQuery } from "@tanstack/react-query";
import { cssInterop } from "nativewind";
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import "@/client";
import Separator from "@/components/ListItems/Separator";
import { useUserStore } from "@/storage/userStore";

const mockData = [
  {
    id: "0192e3c6-e8d1-7b06-a7e3-0402c0b8ea35",
    name: "Apple Inc.",
    description:
      "Apple designs a wide variety of consumer electronic devices, including smartphones (iPhone), tablets (iPad), PCs (Mac), smartwatches (Apple Watch), and AirPods, among others. In addition, Apple offers its customers a variety of services such as Apple Music, iCloud, Apple Care, Apple TV+, Apple Arcade, Apple Fitness, Apple Card, and Apple Pay, among others. Apple's products include internally developed software and semiconductors, and the firm is well known for its integration of hardware, software, semiconductors, and services. Apple's products are distributed online as well as through company-owned stores and third-party retailers.",
    symbol: "AAPL",
    display_name: "Apple Inc. - Dinari",
    logo_url:
      "https://assets.dinari.com/assets/stock_logos/AAPL_2024_01_29.svg",
    external_id: "1",
    price: "222.684",
  },
  {
    id: "0192e3c6-e8fd-756d-b226-406ede714609",
    name: "Amazon.Com Inc",
    description:
      "Amazon is a leading online retailer and one of the highest-grossing e-commerce aggregators, with $386 billion in net sales and approximately $578 billion in estimated physical/digital online gross merchandise volume in 2021. Retail-related revenue represents approximately 80% of the total, followed by Amazon Web Services' cloud computing, storage, database, and other offerings (10%-15%), advertising services (5%), and other. International segments constitute 25%-30% of Amazon's non-AWS sales, led by Germany, the United Kingdom, and Japan.",
    symbol: "AMZN",
    display_name: "Amazon.com, Inc. - Dinari",
    logo_url:
      "https://assets.dinari.com/assets/stock_logos/AMZN_2024_01_29.svg",
    external_id: "2",
    price: "197.02",
  },
  {
    id: "0192e3c6-e93e-7086-aa2b-bbd47a4cb2fb",
    name: "Alphabet Inc. Class A Common Stock",
    description:
      "Alphabet is a holding company. Internet media giant Google is a wholly owned subsidiary. Google generates 99% of Alphabet revenue, of which more than 85% is from online ads. Google's other revenue is from sales of apps and content on Google Play and YouTube, as well as cloud service fees and other licensing revenue. Sales of hardware such as Chromebooks, the Pixel smartphone, and smart home products, which include Nest and Google Home, also contribute to other revenue. Alphabet's moonshot investments are in its other bets segment, where it bets on technology to enhance health (Verily), provide faster internet access (Google Fiber), enable self-driving cars (Waymo), and more.",
    symbol: "GOOGL",
    display_name: "Alphabet Inc. Class A - Dinari",
    logo_url:
      "https://assets.dinari.com/assets/stock_logos/GOOGL_2024_01_29.svg",
    external_id: "4",
    price: "171.05",
  },
  {
    id: "0192e3c6-e9be-794c-bd14-0367e33f611e",
    name: "Nvidia Corp",
    description:
      "Nvidia is a leading developer of graphics processing units. Traditionally, GPUs were used to enhance the experience on computing platforms, most notably in gaming applications on PCs. GPU use cases have since emerged as important semiconductors used in artificial intelligence. Nvidia not only offers AI GPUs, but also a software platform, Cuda, used for AI model development and training. Nvidia is also expanding its data center networking solutions, helping to tie GPUs together to handle complex workloads.",
    symbol: "NVDA",
    display_name: "NVIDIA Corporation - Dinari",
    logo_url:
      "https://assets.dinari.com/assets/stock_logos/NVDA_2024_01_29.svg",
    external_id: "8",
    price: "139.316",
  },
  {
    id: "0192e3c6-ea19-7fe3-bbc8-65cb0626709b",
    name: "Tesla, Inc. Common Stock",
    description:
      "Founded in 2003 and based in Palo Alto, California, Tesla is a vertically integrated sustainable energy company that also aims to transition the world to electric mobility by making electric vehicles. The company sells solar panels and solar roofs for energy generation plus batteries for stationary storage for residential and commercial properties including utilities. Tesla has multiple vehicles in its fleet, which include luxury and midsize sedans and crossover SUVs. The company also plans to begin selling more affordable sedans and small SUVs, a light truck, a semi truck, and a sports car. Global deliveries in 2022 were a little over 1.3 million vehicles.",
    symbol: "TSLA",
    display_name: "Tesla, Inc. - Dinari",
    logo_url:
      "https://assets.dinari.com/assets/stock_logos/TSLA_2024_01_29.svg",
    external_id: "11",
    price: "249.37",
  },
];

const ExploreETFs = () => {
  const { t } = useTranslation();

  const { user } = useUserStore();

  cssInterop(CopyIcon, { className: "style" });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["etfs"],
    queryFn: () =>
      assetsGetAssets({
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }).then((res) => res),
  });

  const renderItem = ({ item }) => {
    return <StockListItem etf={item} />;
  };

  const etfs = mockData || data?.data || [];

  const separator = () => <Separator />;

  return (
    <LoggedLayout>
      <Text className="text-heading-s text-gray-10 px-layout pt-layout-s pb-layout-l">
        <Trans
          i18nKey="explore.title"
          components={[<Text className="text-gray-50">segment0</Text>]}
        />
      </Text>
      <View className="flex-1 px-layout">
        <FlatList
          data={etfs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={separator}
          onRefresh={refetch}
          refreshing={isPending}
        />
      </View>
    </LoggedLayout>
  );
};

ExploreETFs.displayName = "ExploreETFs";

export default ExploreETFs;
