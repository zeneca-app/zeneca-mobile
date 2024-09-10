import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import countryCodeToFlagEmoji from "country-code-to-flag-emoji";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  RecipientReadWithExternalAccount,
  recipientsGetRecipients,
} from "../../client";

const RecipientsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["recipients"],
    queryFn: recipientsGetRecipients,
  });

  const renderRecipient = useCallback(
    ({ item }: { item: RecipientReadWithExternalAccount }) => (
      <TouchableOpacity style={styles.recipientItem}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientName}>{item.name}</Text>
          <Text style={styles.recipientAddress}>
            {item.external_account.account_number}
          </Text>
        </View>
        <Text style={styles.flag}>
          {countryCodeToFlagEmoji(item.country ?? "")}
        </Text>
      </TouchableOpacity>
    ),
    [],
  );

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data?.data ?? [];
    }
    const filterData = data?.data?.filter((recipient) =>
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return filterData;
  }, [searchQuery, data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("recipients.title")}</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("recipients.searchPlaceholder")}
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderRecipient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} disabled>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "white",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  recipientAddress: {
    color: "#666",
    fontSize: 14,
  },
  flag: {
    fontSize: 20,
    marginLeft: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipientsScreen;
