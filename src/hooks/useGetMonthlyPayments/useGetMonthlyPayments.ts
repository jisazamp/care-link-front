import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface MonthlyPaymentData {
  month: string;
  payments: number;
  goal: number;
  achievement_percentage: number;
}

interface MonthlyPaymentsResponse {
  total_payments: number;
  current_month_payments: number;
  previous_month_payments: number;
  monthly_data: MonthlyPaymentData[];
  overall_goal_achievement: number;
}

export const useGetMonthlyPayments = () => {
  return useQuery({
    queryKey: ["monthly-payments"],
    queryFn: async (): Promise<MonthlyPaymentsResponse> => {
      const response = await client.get("/api/monthly-payments");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
