import { EditOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Layout,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import type { AuthorizedUser } from "../../types";
import type { IAuthorizedUsersListProps } from "./index.types";

const { Content } = Layout;
const { Text } = Typography;

const UserInfoCell: React.FC<{ user: AuthorizedUser }> = ({ user }) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  const description = [user.email, user.role].filter(Boolean).join(" | ");

  return (
    <Space direction="vertical" size={0} style={{ width: "100%" }}>
      <Text strong ellipsis style={{ display: "block", width: "100%" }}>
        {fullName}
      </Text>
      <Text
        type="secondary"
        ellipsis={{ tooltip: description }}
        style={{
          fontSize: 13,
          display: "block",
          width: "100%",
        }}
      >
        {description}
      </Text>
    </Space>
  );
};

export const AuthorizedUsersList: React.FC<IAuthorizedUsersListProps> = ({
  users,
  loading,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<AuthorizedUser> = [
    {
      title: "",
      dataIndex: "nombres",
      key: "nombres",
      ellipsis: true,
      render: (_: unknown, user: AuthorizedUser) => (
        <UserInfoCell user={user} />
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      align: "right",
      render: (_: unknown, user: AuthorizedUser) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/registrar/${user.id}`);
          }}
        />
      ),
    },
  ];

  const dataSource =
    users.map((user) => ({
      ...user,
      key: user.id,
    })) ?? [];

  return (
    <Content className="content-wrapper" style={{ padding: 16, width: "100%" }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
      </Breadcrumb>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card style={{ width: "100%" }}>
          <Table<AuthorizedUser>
            className="usuarios-table"
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            scroll={{ x: "max-content" }}
            showHeader={false}
            onRow={(record) => ({
              onClick: () => navigate(`/usuarios/registrar/${record.id}`),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </Space>
    </Content>
  );
};

export default AuthorizedUsersList;
