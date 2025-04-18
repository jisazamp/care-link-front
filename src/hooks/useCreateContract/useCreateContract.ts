import type { CreateContractRequest } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";

const createContract = (data: CreateContractRequest) =>
  client.post("/api/contratos", data);

export const useCreateContract = (id: string | number | undefined) => {
  return useMutation({
    mutationFn: createContract,
    mutationKey: ["create-contract"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`user-${id}-contracts`] });
    },
  });
};
