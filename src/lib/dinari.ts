import { OrderQuote } from "@/client/";
import tokens from "@/constants/tokens";
import orderProcessorAbi from "@/lib/abis/orderProcesssorAbi";
import { Address, encodeFunctionData, Hex } from "viem";

export const createOrder = async (amount: string, quote: OrderQuote) => {
  const orderProcessorAddress = tokens.ORDER_PROCESSOR_ADDRESS[
    quote.chain_id
  ] as Address;
  const paymentTokenAddress = tokens.USDC[quote.chain_id] as Address;
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
    args: [orderProcessorAddress, BigInt(amount)],
  }) as Hex;

  // 2. Encode order approval call
  const createOrderData = encodeFunctionData({
    abi: orderProcessorAbi,
    functionName: "createOrder",
    args: [
      [
        quote.order_data.request_timestamp, // When the order was created
        quote.order_data.recipient, // Who receives the assets
        quote.order_data.asset_token, // Token you want to buy/sell
        quote.order_data.payment_token, // Token you're paying with
        quote.order_data.sell, // false = buy, true = sell
        quote.order_data.order_type, // 0 = market order
        quote.order_data.asset_token_quantity, // Amount of asset tokens
        quote.order_data.payment_token_quantity, // Amount of payment tokens
        quote.order_data.price, // Limit price (0 for market orders)
        quote.order_data.tif, // Time in force (1 = good til cancelled)
      ],
      [
        quote.id, // Unique ID for this fee quote
        quote.smart_account_address, // Who requested the quote
        quote.fee, // Fee amount
        quote.timestamp, // When quote was issued
        quote.deadline, // When quote expires
      ],
      quote.signature,
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
