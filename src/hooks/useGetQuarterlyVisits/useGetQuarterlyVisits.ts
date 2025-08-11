import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface MonthlyVisitData {
  month: string;
  visits: number;
}

interface ProfessionalVisitData {
  id_profesional: number;
  visit_count: number;
}

interface QuarterlyVisitsResponse {
  total_quarterly_visits: number;
  average_daily_visits: number;
  monthly_data: MonthlyVisitData[];
  current_month_visits: number;
  previous_month_visits: number;
  growth_percentage: number;
  visits_by_status: Record<string, number>;
  active_professionals: ProfessionalVisitData[];
  completed_visits: number;
  pending_visits: number;
  cancelled_visits: number;
  rescheduled_visits: number;
  completion_rate: number;
  efficiency_rate: number;
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
