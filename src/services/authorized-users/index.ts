import type { AxiosError } from "axios";
import { client } from "../../api/client";
import type { AuthorizedUser, CreateAuthorizedUserPayload } from "../../types";

export function createAuthorizedUser(
  user: Omit<CreateAuthorizedUserPayload, "id" | "is_deleted">,
) {
  return client.post<AuthorizedUser, AxiosError>("/api/create", user);
}

export function listAuthorizedUsers() {
  return client.get<{ data: AuthorizedUser[] }>("/api/usuarios/registrados");
}

export function listAuthorizedUserById(userId: number) {
  return client.get<{ data: AuthorizedUser }>(
    `/api/usuarios/registrados/${userId}`,
  );
}
