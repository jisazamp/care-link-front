import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteReport = (id: number | string) =>
  client.delete(`/api/reports/${id}`);

export const useDeleteMedicalReport = () =>
  useMutation({ mutationKey: ["delete-report"], mutationFn: deleteReport });
