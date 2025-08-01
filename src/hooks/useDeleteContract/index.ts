import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteContractById = (contractId: number) => {
  return client.delete(`/api/contratos/${contractId}`);
};

const useDeleteContract = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteContractFn, isPending: deleteContractPending } =
    useMutation({
      mutationKey: ["delete-contract"],
      mutationFn: deleteContractById,
      onSuccess: () => {
        // Invalidar queries relacionadas con contratos y facturación
        queryClient.invalidateQueries({ queryKey: ["contracts"] });
        queryClient.invalidateQueries({ queryKey: ["user-contracts"] });
        queryClient.invalidateQueries({ queryKey: ["facturacion-completa"] });
      },
    });
  return { deleteContractFn, deleteContractPending };
};

export { useDeleteContract };
