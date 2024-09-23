export type CurrencyCode = "USD" | "COP" | "MXN" | "EUR";

const currencyLocales: Record<CurrencyCode, string> = {
  USD: "en-US",
  COP: "es-CO",
  MXN: "es-MX",
  EUR: "de-DE",
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
