import { Avatar, Card, Col, Flex, Row, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";

const { Title } = Typography;

export const UserInfo = () => {
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);

  return (
    <Card variant="borderless" loading={loadingUser}>
      <Row align="middle" gutter={16}>
        {user?.data.data.url_imagen && (
          <Col span={4}>
            <Avatar alt="Avatar" size={72} src={user.data.data.url_imagen} />
          </Col>
        )}
        <Col span={20}>
          <Title
            level={5}
            style={{
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
          </Title>
          <Flex style={{ gap: 28 }}>
            <Flex vertical gap={10}>
              <Flex gap={4}>
                <Typography.Text style={{ fontWeight: "bold" }}>
                  {`${user?.data.data.n_documento}`}
                </Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text>{user?.data.data.genero}</Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text>
                  {dayjs(user?.data.data.fecha_nacimiento).format("DD-MM-YYYY")}
                </Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text style={{ fontWeight: "bold" }}>
                  {dayjs().diff(
                    dayjs(user?.data.data.fecha_nacimiento),
                    "years",
                  )}{" "}
                  años
                </Typography.Text>
              </Flex>
              <Typography.Text>{user?.data.data.estado_civil}</Typography.Text>
            </Flex>
            <Col lg={10}>
              <Flex vertical gap={10}>
                <Typography.Text>{user?.data.data.direccion}</Typography.Text>
                <Flex gap={4}>
                  <Typography.Text>{user?.data.data.telefono}</Typography.Text>
                  <Typography.Text>-</Typography.Text>
                  <Typography.Text>{user?.data.data.email}</Typography.Text>
                </Flex>
              </Flex>
            </Col>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};
