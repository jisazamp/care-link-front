import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { Contract, CreateContractRequest } from "../../types";

const createContract = (data: CreateContractRequest) =>
  client.post<{ data: Contract }>("/api/contratos/", data);

export const useCreateContract = (id: string | number | undefined) => {
  return useMutation({
    mutationFn: createContract,
    mutationKey: ["create-contract"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`user-${id}-contracts`] });
    },
  });
};
