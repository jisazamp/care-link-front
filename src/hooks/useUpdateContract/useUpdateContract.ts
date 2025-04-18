import type { Contract } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const updateContract = (contract: Partial<Contract>) => {
  const contractId = contract.id_contrato;
  delete contract.id_contrato;
  delete contract.id_usuario;
  return client.patch(`/api/contrato/${contractId}`, contract);
};

export const useUpdateContract = (id: number | string | undefined) =>
  useMutation({
    mutationKey: [`update-contract-${id}`],
    mutationFn: updateContract,
  });
