import { ordersGetOrdersOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  const {
    isPending,
    error,
    data: orders,
    refetch,
  } = useQuery({
    ...ordersGetOrdersOptions(),
  });

  const hasOrders = orders && orders.length > 0;

  return {
    isPending,
    error,
    orders,
    hasOrders,
    refetch,
  };
};
