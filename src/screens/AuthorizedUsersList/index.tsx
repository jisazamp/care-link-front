import AuthorizedUsersList from "../../components/AuthorizedUsersList";
import { useListAuthorizedUsers } from "../../hooks/useListAuthorizedUsers";

export const AuthorizedUsersListScreen = () => {
  const { authorizedUsersData, isListAuthorizedUsersPending } =
    useListAuthorizedUsers();
  return (
    <AuthorizedUsersList
      users={authorizedUsersData?.data.data ?? []}
      loading={isListAuthorizedUsersPending}
    />
  );
};
