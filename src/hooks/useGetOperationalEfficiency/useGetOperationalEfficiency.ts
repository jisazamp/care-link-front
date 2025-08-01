import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface MonthlyEfficiencyData {
  month: string;
  efficiency: number;
  attendance_rate: number;
  home_visits_completion: number;
  contract_management: number;
  billing_efficiency: number;
}

interface OperationalEfficiencyResponse {
  overall_efficiency: number;
  current_month_efficiency: number;
  previous_month_efficiency: number;
  monthly_data: MonthlyEfficiencyData[];
  attendance_rate: number;
  home_visits_completion_rate: number;
  contract_management_rate: number;
  billing_efficiency_rate: number;
  growth_percentage: number;
}

export const useGetOperationalEfficiency = () => {
  return useQuery({
    queryKey: ["operational-efficiency"],
    queryFn: async (): Promise<OperationalEfficiencyResponse> => {
      const response = await client.get("/api/operational-efficiency");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
