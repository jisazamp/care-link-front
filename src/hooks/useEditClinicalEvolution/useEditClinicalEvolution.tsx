import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
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
    onSuccess: () => {
      // Invalidar las consultas de evoluciones clínicas
      queryClient.invalidateQueries({
        queryKey: ["clinical-evolution"],
      });
      // También invalidar las listas de evoluciones para todos los reportes
      queryClient.invalidateQueries({
        queryKey: ["report-"],
      });
    },
  });
