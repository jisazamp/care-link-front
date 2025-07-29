import { client } from "../../api/client";

export function getProfessionalByUserId(userId: number) {
  return client.get(`/api/professional/${userId}`);
}
