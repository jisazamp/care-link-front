import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Bill } from "../../types";

interface CreateBillData {
  contractId: number;
  impuestos?: number;
  descuentos?: number;
  observaciones?: string;
}

const createContractBill = (data: CreateBillData) =>
  client.post<{ data: Bill }>(`/api/facturas/${data.contractId}`, {
    impuestos: data.impuestos,
    descuentos: data.descuentos,
    observaciones: data.observaciones,
  });

const useCreateBill = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationKey: ["create-contract-bill"],
    mutationFn: createContractBill,
    onSuccess: () => {
      // Invalidar queries relacionadas con facturación
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturacion-completa"] });
      queryClient.invalidateQueries({ queryKey: ["contract-bills"] });
    },
  });

  const createContractBillFn = (
    data: CreateBillData,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ) => {
    mutation.mutate(data, options);
  };

  return { 
    createContractBillFn, 
    createContractPending: mutation.isPending 
  };
};

export { useCreateBill };
