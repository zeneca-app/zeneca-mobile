import { QuoteRead } from "../client";
import { CurrencyCode, formatCurrency } from "./currencyUtils";

export type Quote = {
  id: string;
  source: string;
  destination: string;
  amount_in: string;
  amount_out: string;
  exchange_rate: string;
  expires_at: number;
  network_fee: string | null;
  developer_fee: string;
  zeneca_fee: string;
  partner_fee: string;
  external_id: string | null;
  recipient_id: string | null;
  fee: string;
};

export const formatQuoteToNumber = (quote: QuoteRead): Quote => {
  const isSourceUSDC = quote.source.includes("usdc");
  const isDestinationUSDC = quote.destination.includes("usdc");
  return {
    id: quote.id,
    source: quote.source,
    destination: quote.destination,
    amount_in: isSourceUSDC
      ? (quote.amount_in / 10 ** 6).toFixed(2)
      : (quote.amount_in / 100).toFixed(2),
    amount_out: isDestinationUSDC
      ? (quote.amount_out / 10 ** 6).toFixed(2)
      : (quote.amount_out / 100).toFixed(2),
    exchange_rate: (quote.exchange_rate / 10000).toFixed(4),
    expires_at: quote.expires_at,
    external_id: quote.external_id,
    recipient_id: quote.recipient_id,
    network_fee: quote.network_fee
      ? (quote.network_fee / 100).toFixed(2)
      : null,
    developer_fee: (quote.developer_fee / 100).toFixed(2),
    zeneca_fee: (quote.zeneca_fee / 100).toFixed(2),
    partner_fee: (quote.partner_fee / 100).toFixed(2),
    fee: (quote.fee / 100).toFixed(2),
  };
};

export const formatQuoteToCurrency = (quote: QuoteRead): Quote => {
  const formattedQuote = formatQuoteToNumber(quote);
  const isSourceUSDC = quote.source.includes("usdc");
  const isDestinationUSDC = quote.destination.includes("usdc");
  return {
    id: quote.id,
    source: quote.source,
    destination: quote.destination,
    amount_in: formatCurrency(
      formattedQuote.amount_in,
      isSourceUSDC ? "USD" : (quote.source.toUpperCase() as CurrencyCode),
    ),
    amount_out: formatCurrency(
      formattedQuote.amount_out,
      isDestinationUSDC
        ? "USD"
        : (quote.destination.toUpperCase() as CurrencyCode),
    ),
    exchange_rate: formatCurrency(
      formattedQuote.exchange_rate,
      isDestinationUSDC
        ? "USD"
        : (quote.destination.toUpperCase() as CurrencyCode),
    ),
    expires_at: quote.expires_at,
    external_id: quote.external_id,
    recipient_id: quote.recipient_id,
    network_fee: formattedQuote.network_fee
      ? formatCurrency(formattedQuote.network_fee, "USD")
      : null,
    developer_fee: formatCurrency(formattedQuote.developer_fee, "USD"),
    zeneca_fee: formatCurrency(formattedQuote.zeneca_fee, "USD"),
    partner_fee: formatCurrency(formattedQuote.partner_fee, "USD"),
    fee: formatCurrency(formattedQuote.fee, "USD"),
  };
};
