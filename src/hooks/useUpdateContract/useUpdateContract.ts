import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Contract } from "../../types";

const updateContract = (contract: Partial<Contract>) => {
  const contractId = contract.id_contrato;
  contract.id_contrato = undefined;
  contract.id_usuario = undefined;
  return client.patch(`/api/contrato/${contractId}`, contract);
};

export const useUpdateContract = (id: number | string | undefined) =>
  useMutation({
    mutationKey: [`update-contract-${id}`],
    mutationFn: updateContract,
  });
