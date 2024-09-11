import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrivy } from "@privy-io/expo";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { toast } from "burnt";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { customersGetBalance, transactionsGetTransactions } from "../../client";
import useAuthStore from "../../storage/authStore";
import { colors } from "../../styles/colors";

const transactions = [
  { id: "1", name: "De Gaby Alvarez", amount: "+$2000", time: "1:00 pm" },
  { id: "2", name: "Retiro a Bancolombia", amount: "-$800", time: "9:30 am" },
];

const HomeScreen = () => {
  const { logout } = usePrivy();
  const { update } = useAuthStore((state) => ({ update: state.update }));
  const { data: balance } = useQuery({
    queryKey: ["balance"],
    queryFn: customersGetBalance,
  });
  const { data } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsGetTransactions,
  });
  console.log("Transactions Data: ", data);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const onLogout = async () => {
    try {
      await logout();
      update(false);
      navigation.navigate("Login");
    } catch (err) {
      const e = err as Error;
      toast({
        title: e?.message ?? "Login Error",
        preset: "error",
      });
      update(true);
    }
  };

  const onSend = useCallback(
    () => navigation.navigate("Recipients"),
    [navigation],
  );

  const renderTransaction = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIcon}>
            {item.amount.includes("+") ? (
              <Ionicons name="arrow-down" size={20} color="white" />
            ) : (
              <Feather name="arrow-up-right" size={20} color="white" />
            )}
          </View>
          <View>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={styles.transactionTime}>{item.time}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.amount.includes("+") ? "#4CAF50" : "#FF5252" },
          ]}
        >
          {item.amount}
        </Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.wrapperHeader}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileButton} onPress={onLogout}>
              <Ionicons name="person-sharp" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={["#A48BF1", "#80B0F9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>
                {Number(balance?.data?.balance)?.toFixed(2)}
              </Text>
              <Text style={styles.balanceUsd}>USD</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="arrow-down" size={20} color="white" />
                <Text style={styles.buttonText}>{t("home.deposit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={onSend}>
                <Ionicons name="arrow-up" size={20} color="white" />
                <Text style={styles.buttonText}>{t("home.send")}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsHeader}>HOY</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={keyExtractor}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapperHeader: {
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18171A",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    borderRadius: 40,
    padding: 20,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: "white",
  },
  balanceUsd: {
    fontSize: 16,
    fontFamily: "Manrope_600SemiBold",
    color: "white",
    marginLeft: 5,
    marginBottom: 7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontFamily: "Manrope_400Regular",
  },
  transactionsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.darkHighlight,
    borderRadius: 40,
  },
  transactionsHeader: {
    color: "#999",
    fontSize: 12,
    paddingVertical: 20,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  transactionInitial: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  transactionName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionTime: {
    color: "#999",
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;
