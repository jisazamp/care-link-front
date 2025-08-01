import type { AxiosError } from "axios";
import { client } from "../../api/client";
import type {
  AuthorizedUser,
  CreateAuthorizedUserPayload,
  UpdateAuthorizedUserPayload,
} from "../../types";

export function createAuthorizedUser(
  user: Omit<CreateAuthorizedUserPayload, "id" | "is_deleted">,
) {
  return client.post<AuthorizedUser, AxiosError>("/api/create", user);
}

export function updateAuthorizedUser(user: UpdateAuthorizedUserPayload) {
  return client.put(`/api/authorized-users/${user.id}`, user);
}

export function listAuthorizedUsers() {
  return client.get<{ data: AuthorizedUser[] }>("/api/usuarios/registrados");
}

export function listAuthorizedUserById(userId: number) {
  return client.get<{ data: AuthorizedUser }>(
    `/api/usuarios/registrados/${userId}`,
  );
}
