import type { AuthorizedUser } from "../../types";

export interface IAuthorizedUsersListProps {
  users: AuthorizedUser[];
  loading?: boolean;
}
