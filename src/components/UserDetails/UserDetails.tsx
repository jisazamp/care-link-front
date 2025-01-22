import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
  Modal,
} from "antd";
import patientImage from "../assets/Patients/patient1.jpg";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import dayjs from "dayjs";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { FamilyMember } from "../../types";
import { useEffect, useState } from "react";
import { useDeleteFamilyMemberMutation } from "../../hooks/useDeleteFamilyMemberMutation/useDeleteFamilyMemberMutation";

const { Title } = Typography;

const clinicalReportsData = [
  {
    key: "1",
    professional: "Sara Manuela Gomez",
    reportType: "Enfermería",
    date: "10/20/2024",
    actions: [
      <a key="view" href="#">
        Ver
      </a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>
        Editar
      </a>,
    ],
  },
  {
    key: "2",
    professional: "Juan Pablo Ruiz",
    reportType: "Ortopedia",
    date: "10/24/2024",
    actions: [
      <a key="view" href="#">
        Ver
      </a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>
        Editar
      </a>,
    ],
  },
];

const columns = [
  {
    title: <Checkbox />,
    dataIndex: "checkbox",
    render: () => <Checkbox />,
    width: "5%",
  },
  {
    title: "Profesional",
    dataIndex: "professional",
    key: "professional",
  },
  {
    title: "Tipo Reporte",
    dataIndex: "reportType",
    key: "reportType",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    key: "actions",
  },
];

const contractsData = [
  {
    key: "1",
    fechaInicio: "12/12/2024",
    estado: "Activo",
    servicios: "Centro día, transporte",
    firmado: "Sí",
    estadoFacturacion: "Al día",
    acciones: [
      <a key="view" href="#">
        Ver
      </a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>
        Editar
      </a>,
    ],
  },
];

const contractsColumns = [
  {
    title: <Checkbox />,
    dataIndex: "checkbox",
    render: () => <Checkbox />,
    width: "5%",
  },
  {
    title: "Fecha de inicio",
    dataIndex: "fechaInicio",
    key: "fechaInicio",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "estado",
  },
  {
    title: "Servicios",
    dataIndex: "servicios",
    key: "servicios",
  },
  {
    title: "Firmado",
    dataIndex: "firmado",
    key: "firmado",
  },
  {
    title: "Estado Facturación",
    dataIndex: "estadoFacturacion",
    key: "estadoFacturacion",
  },
  {
    title: "Acciones",
    dataIndex: "acciones",
    key: "acciones",
  },
];

export const UserDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<FamilyMember | null>(null);

  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const { mutate: deleteFamilyMember, isSuccess: isSuccessDeleteFamilyMember } =
    useDeleteFamilyMemberMutation(userId);

  const acudientesColumns: TableProps<{ acudiente: FamilyMember }>["columns"] =
    [
      {
        title: <Checkbox />,
        dataIndex: "checkbox",
        render: () => <Checkbox />,
        width: "5%",
      },
      {
        title: "Nombres",
        dataIndex: ["acudiente", "nombres"],
        key: "nombres",
      },
      {
        title: "Apellidos",
        dataIndex: ["acudiente", "apellidos"],
        key: "nombres",
      },
      {
        title: "Parentesco",
        dataIndex: "parentesco",
        key: "parentesco",
      },
      {
        title: "Teléfono",
        dataIndex: ["acudiente", "telefono"],
        key: "telefono",
      },
      {
        title: "Dirección",
        dataIndex: ["acudiente", "direccion"],
        key: "direccion",
      },
      {
        title: "E-Mail",
        dataIndex: ["acudiente", "email"],
        key: "email",
      },
      {
        title: "Acciones",
        dataIndex: "acciones",
        key: "acciones",
        render: (_, record: { acudiente: FamilyMember }) => (
          <Space>
            <Link
              to={`/usuarios/${userId}/familiar/${record.acudiente.id_acudiente}`}
            >
              <Button type="link" className="main-button-link" size="small">
                Editar
              </Button>
            </Link>
            <Divider type="vertical" />
            <Button
              className="main-button-link"
              size="small"
              type="link"
              onClick={() => {
                setUserToDelete(record.acudiente);
                setIsModalOpen(true);
              }}
            >
              Eliminar
            </Button>
          </Space>
        ),
      },
    ];

  useEffect(() => {
    if (isSuccessDeleteFamilyMember) {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  }, [isSuccessDeleteFamilyMember]);

  return (
    <>
      <Breadcrumb
        className="breadcrumb"
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: "Inicio",
          },
          {
            title: "Usuarios",
          },
          { title: "Vista detalle" },
        ]}
      />
      <Title level={3} className="page-title">
        {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
      </Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card
          title="Datos básicos y de localización"
          extra={
            <Space>
              <Button
                className="main-button-white"
                variant="outlined"
                icon={<EditOutlined />}
              >
                Editar
              </Button>
              <Button icon={<DeleteOutlined />} danger>
                Eliminar
              </Button>
            </Space>
          }
          style={{ marginTop: 3 }}
        >
          <Row gutter={24} align="middle">
            <Col>
              <Avatar
                src={patientImage}
                size={120}
                alt="Avatar del paciente"
                style={{ border: "1px solid #ddd" }}
              />
            </Col>
            <Col flex="auto">
              <Descriptions column={2} labelStyle={{ fontWeight: "bold" }}>
                <Descriptions.Item label="Nombre Completo">
                  {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
                </Descriptions.Item>
                <Descriptions.Item label="Documento">
                  {`${user?.data.data.n_documento}`}
                </Descriptions.Item>
                <Descriptions.Item label="Género">
                  {user?.data.data.genero}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Nacimiento">
                  {user?.data.data.fecha_nacimiento}
                </Descriptions.Item>
                <Descriptions.Item label="Edad">
                  {dayjs().diff(
                    dayjs(user?.data.data.fecha_nacimiento),
                    "years"
                  )}{" "}
                  años
                </Descriptions.Item>
                <Descriptions.Item label="Estado Civil">
                  {user?.data.data.estado_civil}
                </Descriptions.Item>
                <Descriptions.Item label="Teléfono">
                  {user?.data.data.telefono}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user?.data.data.email}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
        <Card
          title="Historia Clínica"
          extra={
            <Space>
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => navigate("/MedicalRecord")}
              >
                Editar
              </Button>
              <Button icon={<DeleteOutlined />} danger>
                Eliminar
              </Button>
            </Space>
          }
        >
          <Row gutter={24}>
            <Col span={12}>
              <Descriptions title="Datos Esenciales" column={1}>
                <Descriptions.Item label="Empresa de Salud Domiciliaria">
                  604 607 8990
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Sangre">O+</Descriptions.Item>
                <Descriptions.Item label="Estatura">165 cm</Descriptions.Item>
                <Descriptions.Item label="Motivo de Ingreso">
                  Usuario de centro de día
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions
                title="Discapacidades, Apoyos y Limitaciones"
                column={1}
              >
                <Descriptions.Item label="Discapacidad">
                  <Tag color="purple">Visual</Tag>
                  <Tag color="purple">Auditiva</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Limitaciones">
                  Ayuda para ir al baño
                </Descriptions.Item>
                <Descriptions.Item label="Dieta Especial">Sí</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Divider />
          <Row gutter={24}>
            <Col span={12}>
              <Descriptions title="Preexistencias y Alergias" column={1}>
                <Descriptions.Item label="Cirugías">
                  Sí <a href="#">Ver</a>
                </Descriptions.Item>
                <Descriptions.Item label="Alergias a medicamentos">
                  Sí <a href="#">Ver</a>
                </Descriptions.Item>
                <Descriptions.Item label="Otras Alergias">
                  Sí <a href="#">Ver</a>
                </Descriptions.Item>
                <Descriptions.Item label="Condiciones Especiales">
                  <a href="#">Ver</a>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions title="Hábitos y otros datos" column={1}>
                <Descriptions.Item label="Cafeína">Sí</Descriptions.Item>
                <Descriptions.Item label="Tabaquismo">No</Descriptions.Item>
                <Descriptions.Item label="Alcoholismo">No</Descriptions.Item>
                <Descriptions.Item label="Sustancias Psicoactivas">
                  No
                </Descriptions.Item>
                <Descriptions.Item label="Maltratado">No</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
        <Card
          title="Reportes Clínicos"
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              Agregar
            </Button>
          }
          className="detail-card"
        >
          <Table
            columns={columns}
            dataSource={clinicalReportsData}
            pagination={false}
          />
        </Card>
        <Card
          title="Acudientes"
          extra={
            <Link to={`/usuarios/${userId}/familiar`}>
              <Button
                className="main-button-white"
                variant="outlined"
                icon={<PlusOutlined />}
              >
                Agregar
              </Button>
            </Link>
          }
        >
          <Table
            columns={acudientesColumns}
            loading={loadingFamilyMembers}
            dataSource={familyMembers?.data.data}
            pagination={false}
          />
        </Card>
        <Card
          title="Contratos"
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              Agregar
            </Button>
          }
          className="detail-card"
        >
          <Table
            columns={contractsColumns}
            dataSource={contractsData}
            pagination={false}
          />
        </Card>
      </Space>
      <Divider />
      <Modal
        cancelText="No eliminar"
        okText="Sí, eliminar"
        onOk={() => {
          if (userToDelete) {
            deleteFamilyMember(userToDelete.id_acudiente);
          }
        }}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Confirmar acción"
        okButtonProps={{
          type: "default",
          style: { backgroundColor: "#F32013" },
        }}
        cancelButtonProps={{
          type: "text",
        }}
      >
        <Typography.Text>{`¿Estás seguro que deseas eliminar al acudiente ${userToDelete?.nombres} ${userToDelete?.apellidos}?`}</Typography.Text>
      </Modal>
    </>
  );
};
