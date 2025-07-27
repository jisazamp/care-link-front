import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface UserForActivity {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  n_documento: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: string;
  genero?: string;
  estado?: string;
  tiene_cronograma_fecha: boolean;
  estado_asistencia?: string;
}

interface AvailableUsersResponse {
  data: UserForActivity[];
  message: string;
  status_code: number;
  error: any;
}

const getAvailableUsers = (activityDate: string) =>
  client.get<AvailableUsersResponse>(
    `/api/activities/users/available/${activityDate}`,
  );

export const useGetAvailableUsers = (activityDate: string) =>
  useQuery({
    queryKey: ["get-available-users", activityDate],
    queryFn: () => getAvailableUsers(activityDate),
    enabled: !!activityDate,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
