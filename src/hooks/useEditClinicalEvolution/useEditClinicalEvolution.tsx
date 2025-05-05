import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { ClinicalEvolution } from "../../types";

const editEvolution = ({
  data,
  evolutionId,
}: {
  data: Partial<ClinicalEvolution>;
  evolutionId: number;
}) => client.patch(`/api/evolutions/${evolutionId}`, data);

export const useEditClinicalEvolution = () =>
  useMutation({
    mutationFn: editEvolution,
    mutationKey: ["edit-clinical-evolution"],
  });
