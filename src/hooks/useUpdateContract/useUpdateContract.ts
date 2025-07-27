import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UpdateContractRequest } from "../../types";

const updateContract = (contract: UpdateContractRequest) => {
  const contractId = contract.id_contrato;
  return client.patch(`/api/contrato/${contractId}`, contract);
};

export const useUpdateContract = (id: number | string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [`update-contract-${id}`],
    mutationFn: updateContract,
    onSuccess: () => {
      // Invalidar queries relacionadas con contratos y facturación
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["facturacion-completa"] });
      queryClient.invalidateQueries({ queryKey: ["contract", id] });
    },
  });
};
