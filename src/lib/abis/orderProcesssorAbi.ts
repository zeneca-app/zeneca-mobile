export default [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "DOMAIN_SEPARATOR",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UPGRADE_INTERFACE_VERSION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelOrder",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "reason",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createOrder",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "feeQuote",
        type: "tuple",
        internalType: "struct IOrderProcessor.FeeQuote",
        components: [
          {
            name: "orderId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requester",
            type: "address",
            internalType: "address",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "timestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "deadline",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
      {
        name: "feeQuoteSignature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createOrderStandardFees",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createOrderWithSignature",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "orderSignature",
        type: "tuple",
        internalType: "struct IOrderProcessor.Signature",
        components: [
          {
            name: "deadline",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "feeQuote",
        type: "tuple",
        internalType: "struct IOrderProcessor.FeeQuote",
        components: [
          {
            name: "orderId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requester",
            type: "address",
            internalType: "address",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "timestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "deadline",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
      {
        name: "feeQuoteSignature",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "dShareFactory",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IDShareFactory",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "eip712Domain",
    inputs: [],
    outputs: [
      {
        name: "fields",
        type: "bytes1",
        internalType: "bytes1",
      },
      {
        name: "name",
        type: "string",
        internalType: "string",
      },
      {
        name: "version",
        type: "string",
        internalType: "string",
      },
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "verifyingContract",
        type: "address",
        internalType: "address",
      },
      {
        name: "salt",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "extensions",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fillOrder",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "fillAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "receivedAmount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "fees",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getFeesEscrowed",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getFeesTaken",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrderStatus",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum IOrderProcessor.OrderStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPaymentTokenConfig",
    inputs: [
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct OrderProcessor.PaymentTokenConfig",
        components: [
          {
            name: "enabled",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "decimals",
            type: "uint8",
            internalType: "uint8",
          },
          {
            name: "blacklistCallSelector",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "perOrderFeeBuy",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "percentageFeeRateBuy",
            type: "uint24",
            internalType: "uint24",
          },
          {
            name: "perOrderFeeSell",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "percentageFeeRateSell",
            type: "uint24",
            internalType: "uint24",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getStandardFees",
    inputs: [
      {
        name: "sell",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint24",
        internalType: "uint24",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUnfilledAmount",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hashFeeQuote",
    inputs: [
      {
        name: "feeQuote",
        type: "tuple",
        internalType: "struct IOrderProcessor.FeeQuote",
        components: [
          {
            name: "orderId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requester",
            type: "address",
            internalType: "address",
          },
          {
            name: "fee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "timestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "deadline",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "hashOrder",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "hashOrderRequest",
    inputs: [
      {
        name: "order",
        type: "tuple",
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "deadline",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "_treasury",
        type: "address",
        internalType: "address",
      },
      {
        name: "_vault",
        type: "address",
        internalType: "address",
      },
      {
        name: "_dShareFactory",
        type: "address",
        internalType: "contract IDShareFactory",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isOperator",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isTransferLocked",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "latestFillPrice",
    inputs: [
      {
        name: "assetToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IOrderProcessor.PricePoint",
        components: [
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "blocktime",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [
      {
        name: "data",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "results",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "orderDecimalReduction",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ordersPaused",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOwner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removePaymentToken",
    inputs: [
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "requestCancel",
    inputs: [
      {
        name: "id",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "selfPermit",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "value",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "deadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "v",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "r",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOperator",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
      {
        name: "status",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOrderDecimalReduction",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
      {
        name: "decimalReduction",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setOrdersPaused",
    inputs: [
      {
        name: "pause",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPaymentToken",
    inputs: [
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "blacklistCallSelector",
        type: "bytes4",
        internalType: "bytes4",
      },
      {
        name: "perOrderFeeBuy",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "percentageFeeRateBuy",
        type: "uint24",
        internalType: "uint24",
      },
      {
        name: "perOrderFeeSell",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "percentageFeeRateSell",
        type: "uint24",
        internalType: "uint24",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTreasury",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setVault",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalStandardFee",
    inputs: [
      {
        name: "sell",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "paymentTokenQuantity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "treasury",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "vault",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CancelRequested",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EIP712DomainChanged",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OperatorSet",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "status",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderCancelled",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "reason",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderCreated",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "order",
        type: "tuple",
        indexed: false,
        internalType: "struct IOrderProcessor.Order",
        components: [
          {
            name: "requestTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "assetToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "sell",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "orderType",
            type: "uint8",
            internalType: "enum IOrderProcessor.OrderType",
          },
          {
            name: "assetTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentTokenQuantity",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "price",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tif",
            type: "uint8",
            internalType: "enum IOrderProcessor.TIF",
          },
        ],
      },
      {
        name: "feesEscrowed",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderDecimalReductionSet",
    inputs: [
      {
        name: "assetToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "decimalReduction",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderFill",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "paymentToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "requester",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "assetAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "paymentAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "feesTaken",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "sell",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrderFulfilled",
    inputs: [
      {
        name: "id",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "requester",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OrdersPaused",
    inputs: [
      {
        name: "paused",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferStarted",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentTokenRemoved",
    inputs: [
      {
        name: "paymentToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentTokenSet",
    inputs: [
      {
        name: "paymentToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "blacklistCallSelector",
        type: "bytes4",
        indexed: false,
        internalType: "bytes4",
      },
      {
        name: "perOrderFeeBuy",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "percentageFeeRateBuy",
        type: "uint24",
        indexed: false,
        internalType: "uint24",
      },
      {
        name: "perOrderFeeSell",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "percentageFeeRateSell",
        type: "uint24",
        indexed: false,
        internalType: "uint24",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TreasurySet",
    inputs: [
      {
        name: "treasury",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VaultSet",
    inputs: [
      {
        name: "vault",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AmountTooLarge",
    inputs: [],
  },
  {
    type: "error",
    name: "Blacklist",
    inputs: [],
  },
  {
    type: "error",
    name: "DecimalsTooLarge",
    inputs: [],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureLength",
    inputs: [
      {
        name: "length",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "ECDSAInvalidSignatureS",
    inputs: [
      {
        name: "s",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967InvalidImplementation",
    inputs: [
      {
        name: "implementation",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ERC1967NonPayable",
    inputs: [],
  },
  {
    type: "error",
    name: "ExistingOrder",
    inputs: [],
  },
  {
    type: "error",
    name: "ExpiredSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "FeeTooLarge",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidPrecision",
    inputs: [],
  },
  {
    type: "error",
    name: "LimitPriceNotSet",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "NotOperator",
    inputs: [],
  },
  {
    type: "error",
    name: "NotRequester",
    inputs: [],
  },
  {
    type: "error",
    name: "OrderFillAboveLimitPrice",
    inputs: [],
  },
  {
    type: "error",
    name: "OrderFillBelowLimitPrice",
    inputs: [],
  },
  {
    type: "error",
    name: "OrderNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "PRBMath_MulDiv18_Overflow",
    inputs: [
      {
        name: "x",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "y",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "PRBMath_MulDiv_Overflow",
    inputs: [
      {
        name: "x",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "y",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "denominator",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "Paused",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "UUPSUnauthorizedCallContext",
    inputs: [],
  },
  {
    type: "error",
    name: "UUPSUnsupportedProxiableUUID",
    inputs: [
      {
        name: "slot",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "UnsupportedToken",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroValue",
    inputs: [],
  },
];
