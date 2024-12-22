import { Card, Row, Col, Avatar, Typography, Flex } from "antd";

const { Title, Text } = Typography;

export const UserInfo = () => {
  return (
    <Card bordered>
      <Row align="middle" gutter={16}>
        <Col span={4}>
          <Avatar alt="Avatar" size={72} src="https://via.placeholder.com/72" />
        </Col>
        <Col span={20}>
          <Title
            level={5}
            style={{
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            Juan Antonio López Orrego
          </Title>
          <Flex style={{ gap: 28 }}>
            <Flex vertical>
              <Text>44567890 - Masculino - 1956/11/08 - 68 años</Text>
              <Text>Casado - Pensionado</Text>
            </Flex>
            <Flex vertical>
              <Text>CLL 45 - 60-20 INT 101</Text>
              <Text>315 6789 6789 - juanantonio@gmail.com</Text>
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};
