import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";

interface NextInvoiceNumberResponse {
  data: {
    next_invoice_number: string;
  };
}

const getNextInvoiceNumber = async (): Promise<NextInvoiceNumberResponse> => {
  const response = await client.get<NextInvoiceNumberResponse>(
    "/api/next-invoice-number",
  );
  return response.data;
};

export const useGetNextInvoiceNumber = () => {
  return useQuery({
    queryKey: ["next-invoice-number"],
    queryFn: getNextInvoiceNumber,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
