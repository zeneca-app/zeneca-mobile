import orderProcessorAbi from "@/lib/abis/orderProcesssorAbi";
import { Address, encodeFunctionData, Hex } from "viem";

type FeeQuote = {
  orderId: string;
  requester: string;
  fee: bigint;
  timestamp: number;
  deadline: number;
};

type FeeQuoteResponse = {
  fee_quote: FeeQuote;
  fee_quote_signature: string;
};

type OrderParams = {
  requestTimestamp: number;
  recipient: Address;
  assetToken: Address;
  paymentToken: Address;
  assetTokenQuantity: bigint;
  paymentTokenQuantity: bigint;
  price: bigint;
  tif: number;
  orderType: number;
  sell: boolean;
};

export const prepareOrder = async (
  totalSpendAmount: bigint,
  orderParams: OrderParams,
  feeQuoteResponse: FeeQuoteResponse,
  orderProcessorAddress: Address,
  paymentTokenAddress: Address,
) => {
  const approvalData = encodeFunctionData({
    abi: [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "spender", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        outputs: [{ type: "bool" }],
      },
    ],
    functionName: "approve",
    args: [orderProcessorAddress, totalSpendAmount],
  }) as Hex;

  // 2. Encode order creation call
  const createOrderData = encodeFunctionData({
    abi: orderProcessorAbi,
    functionName: "createOrder",
    args: [
      [
        orderParams.requestTimestamp, // When the order was created
        orderParams.recipient, // Who receives the assets
        orderParams.assetToken, // Token you want to buy/sell
        orderParams.paymentToken, // Token you're paying with
        orderParams.sell, // false = buy, true = sell
        orderParams.orderType, // 0 = market order
        orderParams.assetTokenQuantity, // Amount of asset tokens
        orderParams.paymentTokenQuantity, // Amount of payment tokens
        orderParams.price, // Limit price (0 for market orders)
        orderParams.tif, // Time in force (1 = good til cancelled)
      ],
      [
        feeQuoteResponse.fee_quote.orderId, // Unique ID for this fee quote
        feeQuoteResponse.fee_quote.requester, // Who requested the quote
        feeQuoteResponse.fee_quote.fee, // Fee amount
        feeQuoteResponse.fee_quote.timestamp, // When quote was issued
        feeQuoteResponse.fee_quote.deadline, // When quote expires
      ],
      feeQuoteResponse.fee_quote_signature,
    ],
  }) as Hex;

  // 3. Create batch transaction data
  const transactions = [
    {
      to: paymentTokenAddress as Address,
      data: approvalData as Hex,
      value: 0n,
    },
    {
      to: orderProcessorAddress as Address,
      data: createOrderData as Hex,
      value: 0n,
    },
  ];
  return transactions;
};
