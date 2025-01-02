import { OrderQuote } from "@/client/";
import tokens from "@/constants/tokens";
import orderProcessorAbi from "@/lib/abis/orderProcesssorAbi";
import { Address, encodeFunctionData, Hex } from "viem";

type OrderData = [
  [
    number, // requestTimestamp (e.g., 1730838509620)
    Address, // recipient (0xB26Fa...)
    Address, // assetToken (0x4B47...)
    Address, // paymentToken (0x709C...)
    boolean, // sell (false)
    number, // orderType (0)
    number, // assetTokenQuantity (0)
    number, // paymentTokenQuantity (100000000)
    number, // price (0)
    number, // tif (1)
  ],
  [
    string, // orderId (large number as string)
    Address, // requester (0xB26Fa...)
    string, // fee ('700000')
    number, // timestamp (1730838510)
    number, // deadline (1730838810)
  ],
  Hex, // fee_quote_signature (0x6ed08b...)
];

export const createOrder = async (quote: OrderQuote) => {
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
    args: [orderProcessorAddress, BigInt(quote.order_data.allowance_amount)],
  }) as Hex;

  const orderData: OrderData = [
    [
      quote.order_data.request_timestamp, // When the order was created
      quote.order_data.recipient as Address, // Who receives the assets
      quote.order_data.asset_token as Address, // Token you want to buy/sell
      quote.order_data.payment_token as Address, // Token you're paying with
      quote.order_data.sell, // false = buy, true = sell
      quote.order_data.order_type, // 0 = market order
      quote.order_data.asset_token_quantity, // Amount of asset tokens
      quote.order_data.payment_token_quantity, // Amount of payment tokens
      0, // Limit price (0 for market orders)
      quote.order_data.tif, // Time in force (1 = good til cancelled)
    ],
    [
      quote.external_order_id, // Unique ID for this fee quote
      quote.smart_account_address as Address, // Who requested the quote
      quote.order_data.fee, // Fee amount
      quote.created_at, // When quote was issued
      quote.deadline, // When quote expires
    ],
    quote.signature as Hex,
  ];

  // 2. Encode order approval call
  const createOrderData = encodeFunctionData({
    abi: orderProcessorAbi,
    functionName: "createOrder",
    args: orderData,
  }) as Hex;

  // 3. Create batch transaction data
  const transactions = [
    {
      to: paymentTokenAddress,
      data: approvalData,
      value: 0n,
    },
    {
      to: orderProcessorAddress,
      data: createOrderData,
      value: 0n,
    },
  ];
  return transactions;
};
