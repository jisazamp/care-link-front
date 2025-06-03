import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { CalculateBillBody } from "../../types";

const calculatePartialBill = (data: CalculateBillBody) =>
  client.post<{ data: number }>("/api/calcular/factura", data);

const useCalculatePartialBill = () => {
  const {
    data: partialBill,
    mutate: calculatePartialBillFn,
    isPending: calculatePartialBillPending,
  } = useMutation({
    mutationKey: ["calculate-partial-bill"],
    mutationFn: calculatePartialBill,
  });

  return { partialBill, calculatePartialBillFn, calculatePartialBillPending };
};

export { useCalculatePartialBill };
