import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface ActivityUser {
  id: number;
  id_usuario: number;
  id_actividad: number;
  fecha_asignacion: string;
  estado_participacion: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombres?: string;
  apellidos?: string;
  n_documento?: string;
}

interface ActivityWithUsers {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha?: string;
  duracion?: number;
  comentarios?: string;
  id_profesional?: number;
  id_tipo_actividad?: number;
  profesional_nombres?: string;
  profesional_apellidos?: string;
  tipo_actividad?: string;
  usuarios_asignados: ActivityUser[];
  total_usuarios: number;
}

interface ActivityWithUsersResponse {
  data: ActivityWithUsers;
  message: string;
  status_code: number;
  error: any;
}

const getActivityUsers = (activityId: number) =>
  client.get<ActivityWithUsersResponse>(`/api/activities/${activityId}/users`);

export const useGetActivityUsers = (activityId: number) =>
  useQuery({
    queryKey: ["get-activity-users", activityId],
    queryFn: () => getActivityUsers(activityId),
    enabled: !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
  });
