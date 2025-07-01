import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UpdateContractRequest } from "../../types";

const updateContract = (contract: UpdateContractRequest) => {
  const contractId = contract.id_contrato;
  return client.patch(`/api/contrato/${contractId}`, contract);
};

export const useUpdateContract = (id: number | string | undefined) =>
  useMutation({
    mutationKey: [`update-contract-${id}`],
    mutationFn: updateContract,
  });
