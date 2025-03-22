import { ordersCreateQuoteOrderMutation } from "@/client/@tanstack/react-query.gen";
import { useTransactionStore } from "@/storage/transactionStore";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

export const usePurchaseQuote = () => {
  const { asset, amount, setQuote } = useTransactionStore();
  const {
    mutate: createQuote,
    isPending: isQuotePending,
    data: quote,
  } = useMutation({
    ...ordersCreateQuoteOrderMutation(),
    onError: (error) => console.error("Error creating quote:", error),
    onSuccess: setQuote,
  });

  const fetchQuote = useCallback(() => {
    if (!asset) return;
    createQuote({
      body: {
        asset_id: asset.id,
        side: "BUY",
        order_type: "MARKET",
        amount: Number(amount),
      },
    });
  }, [asset, amount, createQuote]);

  const timeLeft = useMemo(() => {
    if (!quote) return 0;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(quote.deadline - now, 0);
  }, [quote]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    if (!quote || timeLeft > 0) return;
    const timerId = setInterval(fetchQuote, 1000);
    return () => clearInterval(timerId);
  }, [quote, timeLeft, fetchQuote]);

  return { quote, isQuotePending, timeLeft, fetchQuote };
};
