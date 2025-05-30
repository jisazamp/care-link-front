import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteContractById = (contractId: number) =>
  client.delete(`/api/contratos/${contractId}`);

const useDeleteContract = () => {
  const { mutate: deleteContractFn, isPending: deleteContractPending } =
    useMutation({
      mutationKey: ["delete-contract"],
      mutationFn: deleteContractById,
    });
  return { deleteContractFn, deleteContractPending };
};

export { useDeleteContract };
