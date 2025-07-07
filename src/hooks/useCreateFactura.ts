import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";
import { queryClient } from "../main";
import { handleContractError } from "../utils/errorHandler";
import { message } from "antd";
import type { Bill } from "../types";

const createFactura = (data: any) =>
  client.post<{ data: Bill }>("/api/facturas", data);

export const useCreateFactura = () =>
  useMutation({
    mutationFn: createFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      message.success("Factura creada exitosamente");
    },
    onError: (error: any) => {
      const errorMsg = handleContractError(error);
      message.error(errorMsg);
    },
  });
