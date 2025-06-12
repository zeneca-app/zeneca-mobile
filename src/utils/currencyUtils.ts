import { Country, Currency } from "@/client";
import BigNumber from "bignumber.js";
import numeral from "numeral";

export type CurrencyCode = "USD" | "COP" | "MXN" | "EUR";

export const currencyLocales: Record<CurrencyCode, string> = {
  USD: "en-US",
  COP: "es-CO",
  MXN: "es-MX",
  EUR: "de-DE",
};

export const generateZeros = (length: number): string => {
  return "0".repeat(length);
};

export const truncateDecimals = (value: string, decimals: number): string => {
  const [integerPart, decimalPart] = value.split(".");
  if (!decimalPart || decimalPart.length <= decimals) {
    // If no decimal part or it's shorter than desired decimals, pad with zeros
    const paddedDecimal = (decimalPart || "").padEnd(decimals, "0");
    return `${integerPart}.${paddedDecimal}`;
  }
  // Truncate decimal part to desired length without rounding
  return `${integerPart}.${decimalPart.substring(0, decimals)}`;
};

export const formatNumber = (
  value: number | string,
  decimals: number = 2,
  precision: number | string = 0,
  truncate: boolean = false,
): string => {
  const parsedPrecision =
    typeof precision === "string" ? parseInt(precision) : precision;

  const parsedValue = BigNumber(value)
    .dividedBy(Math.pow(10, parsedPrecision))
    .toString();

  if (truncate) {
    return `${truncateDecimals(parsedValue, decimals)}`;
  }
  const decimalMask = generateZeros(decimals);
  return numeral(parsedValue).format(`0,0.${decimalMask}`);
};

export const currencyFormatter = (
  value: number | string,
  decimals: number = 2,
  precision: number | string = 0,
  truncate: boolean = false,
) => {
  try {
    return `$${formatNumber(value, decimals, precision, truncate)}`;
  } catch (error) {
    console.error("Error formatting currency for value ", value, "\n", error);
    return "0.00";
  }
};

export const percentageFormatter = (value: number | string) => {
  return numeral(value).format("0.00%");
};

export const formatCurrency = (
  amount: string | number,
  currencyCode: CurrencyCode,
  showSymbol: boolean = false,
): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "0.00";
  }

  const formatter = new Intl.NumberFormat(currencyLocales[currencyCode], {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showSymbol
    ? formatter.format(numericAmount)
    : formatter.format(numericAmount).replace(currencyCode, "").trim();
};

const CURRENCY: Record<string, Currency> = {
  EUR: "EUR",
  USD: "USD",
  COP: "COP",
  MXN: "MXN",
  BRL: "BRL",
  ARS: "ARS",
  PAN: "USD",
} as const;

export const CURRENCY_BY_COUNTRY: Record<Country, Currency> = {
  COL: CURRENCY.COP,
  MEX: CURRENCY.MXN,
  BRA: CURRENCY.BRL,
  ARG: CURRENCY.ARS,
  USA: CURRENCY.USD,
  PAN: CURRENCY.USD,
};
