import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const updateContractDates = ({
  serviceId,
  dates,
}: {
  serviceId: number | string | undefined;
  dates: { fecha: string }[];
}) => client.patch(`/api/servicios/${serviceId}/fechas`, dates);

export const useUpdateContractDates = () =>
  useMutation({
    mutationKey: ["update-contract-dates"],
    mutationFn: updateContractDates,
  });
