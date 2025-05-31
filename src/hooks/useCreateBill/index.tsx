import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Bill } from "../../types";

const createContractBill = (contractId: number) =>
  client.post<{ data: Bill }>(`/api/facturas/${contractId}`);

const useCreateBill = () => {
  const { mutate: createContractBillFn, isPending: createContractPending } =
    useMutation({
      mutationKey: ["create-contract-bill"],
      mutationFn: createContractBill,
    });

  return { createContractBillFn, createContractPending };
};

export { useCreateBill };
