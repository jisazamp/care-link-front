import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Table,
  Input,
  Dropdown,
  Menu,
  Avatar,
  Tag,
} from 'antd';
import { SearchOutlined, DownOutlined, ReloadOutlined, SettingOutlined, FullscreenOutlined, } from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const { Content, Sider } = Layout;
const { Title } = Typography;

export const UserList: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Opción 1</Menu.Item>
      <Menu.Item key="2">Opción 2</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: '#FFF' }}>
          <Sidebar />
        </Sider>
        <Content className="content-wrapper" style={{ padding: '16px' }}>
          <Breadcrumb className="breadcrumb" style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
            <Breadcrumb.Item>Lista de usuarios</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={3} className="page-title">Lista de Usuarios</Title>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card className="detail-card">
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Space>
                  <Typography.Text strong>Buscar por</Typography.Text>
                  <Input
                    placeholder="Ingrese un valor"
                    prefix={<SearchOutlined />}
                    style={{ width: '300px' }}
                  />
                </Space>
                <Space size="small">
                  <Button type="default">Restablecer</Button>
                  <Button type="primary">Buscar</Button>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <Button>
                      Más Opciones <DownOutlined />
                    </Button>
                  </Dropdown>
                </Space>
              </Space>
            </Card>

            <Card title="Lista de usuarios" className="detail-card">
              <Table
                dataSource={Array.from({ length: 20 }, (_, i) => ({
                  key: i,
                  avatar: <Avatar>{`P${i + 1}`}</Avatar>,
                  name: `Paciente ${i + 1}`,
                  description: 'Lorem ipsum dolor sit amet.',
                  status: <Tag color="green">Activo</Tag>,
                  actions: [
                    <a key="edit" href="#">Editar</a>,
                    <a key="delete" href="#" style={{ marginLeft: 8 }}>Eliminar</a>,
                  ],
                }))}
                columns={[
                  {
                    title: '',
                    dataIndex: 'avatar',
                    key: 'avatar',
                  },
                  {
                    title: 'Nombre',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Descripción',
                    dataIndex: 'description',
                    key: 'description',
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'status',
                    key: 'status',
                  },
                  {
                    title: 'Acciones',
                    dataIndex: 'actions',
                    key: 'actions',
                  },
                ]}
                pagination={{
                  total: 50,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '30'],
                }}
                title={() => (
                  <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography.Text strong>Lista de usuarios</Typography.Text>
                    <Space>
                      <Button icon={<ReloadOutlined />} />
                      <Button icon={<SettingOutlined />} />
                      <Button icon={<FullscreenOutlined />} />
                    </Space>
                  </Space>
                )}
              />
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};
