import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface MonthlyVisitData {
  month: string;
  visits: number;
}

interface QuarterlyVisitsResponse {
  total_quarterly_visits: number;
  average_daily_visits: number;
  monthly_data: MonthlyVisitData[];
  current_month_visits: number;
  previous_month_visits: number;
  growth_percentage: number;
}

export const useGetQuarterlyVisits = () => {
  return useQuery({
    queryKey: ["quarterly-visits"],
    queryFn: async (): Promise<QuarterlyVisitsResponse> => {
      const response = await client.get("/api/quarterly-visits");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}; 