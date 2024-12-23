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
import { SearchOutlined, DownOutlined, ReloadOutlined, SettingOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const { Content, Sider } = Layout;
const { Title } = Typography;

export const UserList: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">Ordenar por nombre</Menu.Item>
      <Menu.Item key="2">Ordenar por estado</Menu.Item>
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
            <Breadcrumb.Item>Buscar usuarios</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={3} className="page-title">Buscar usuarios</Title>

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

            <Card>
              <Table
                dataSource={Array.from({ length: 20 }, (_, i) => ({
                  key: i,
                  avatar: <Avatar>{`P${i + 1}`}</Avatar>,
                  name: `Mariela de Jesus Villa Escobar ${i + 1}`,
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
                  locale: { items_per_page: '/página' },
                  defaultPageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuarios`,
                  
                }}
                title={() => (
                  <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>                    
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Typography.Text strong style={{ cursor: 'pointer' }}>
                        Ordenar por nombre <DownOutlined />
                      </Typography.Text>
                    </Dropdown>
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
