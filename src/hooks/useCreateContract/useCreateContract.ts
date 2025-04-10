import type { CreateContractRequest } from "../../types";
import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const createContract = (data: CreateContractRequest) =>
  client.post("/api/contratos", data);

export const useCreateContract = () => {
  return useMutation({
    mutationFn: createContract,
    mutationKey: ["create-contract"],
  });
};
