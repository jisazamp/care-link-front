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
  Flex,
  Spin,
} from "antd";
import dayjs from "dayjs";
import patientImage from "../assets/Patients/patient1.jpg";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FamilyMember } from "../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { queryClient } from "../../main";
import { useDeleteFamilyMemberMutation } from "../../hooks/useDeleteFamilyMemberMutation/useDeleteFamilyMemberMutation";
import { useDeleteRecordMutation } from "../../hooks/useDeleteRecordMutation/useDeleteRecordMutation";
import { useEffect, useState } from "react";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";

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
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<FamilyMember | null>(null);

  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const {
    mutate: deleteFamilyMember,
    isSuccess: isSuccessDeleteFamilyMember,
    isPending: loadingUserDeletion,
  } = useDeleteFamilyMemberMutation(userId);
  const { mutate: deleteRecord, isPending: loadingDeletion } =
    useDeleteRecordMutation();
  const { data: record, isLoading: loadingRecord } =
    useGetUserMedicalRecord(userId);

  const disabilities = record?.data.data?.discapacidades?.split(",") ?? [];
  const limitations = record?.data.data?.limitaciones;

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

  const handleDeleteRecord = () => {
    if (userId) {
      deleteRecord(Number(record?.data.data?.id_historiaclinica), {
        onSuccess: () => {
          setIsDeleteRecordModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: [`user-medical-record-${userId}`],
          });
        },
      });
    }
  };

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
      {loadingUser ? (
        <Flex align="center" justify="center" style={{ minHeight: 500 }}>
          <Spin />
        </Flex>
      ) : (
        <>
          <Title level={3} className="page-title">
            {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
          </Title>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card
              title="Datos básicos y de localización"
              extra={
                <Space>
                  <Link to={`/usuarios/${userId}/editar`}>
                    <Button
                      className="main-button-white"
                      variant="outlined"
                      icon={<EditOutlined />}
                    >
                      Editar
                    </Button>
                  </Link>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    className="main-button-danger"
                  >
                    Eliminar
                  </Button>
                </Space>
              }
              style={{ marginTop: 3 }}
            >
              <Row gutter={24} align="middle">
                <Col lg={4}>
                  <Avatar
                    src={patientImage}
                    size={120}
                    alt="Avatar del paciente"
                    style={{ border: "1px solid #ddd" }}
                  />
                </Col>
                <Col lg={10}>
                  <Flex vertical gap={10}>
                    <Typography.Text style={{ textTransform: "uppercase" }}>
                      {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
                    </Typography.Text>
                    <Flex gap={4}>
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        {`${user?.data.data.n_documento}`}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text>
                        {user?.data.data.genero}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text>
                        {dayjs(user?.data.data.fecha_nacimiento).format(
                          "DD-MM-YYYY"
                        )}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        {dayjs().diff(
                          dayjs(user?.data.data.fecha_nacimiento),
                          "years"
                        )}{" "}
                        años
                      </Typography.Text>
                    </Flex>
                    <Typography.Text>
                      {user?.data.data.estado_civil}
                    </Typography.Text>
                  </Flex>
                </Col>
                <Col lg={10}>
                  <Flex vertical gap={10}>
                    <Typography.Text>
                      {user?.data.data.direccion}
                    </Typography.Text>
                    <Flex gap={4}>
                      <Typography.Text>
                        {user?.data.data.telefono}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text>{user?.data.data.email}</Typography.Text>
                    </Flex>
                  </Flex>
                </Col>
              </Row>
            </Card>
            <Card
              title="Historia Clínica"
              extra={
                record?.data.data ? (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      className="main-button-white"
                      onClick={() => navigate(`/usuarios/${userId}/historia`)}
                    >
                      Editar
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      className="main-button-danger"
                      onClick={() => setIsDeleteRecordModalOpen(true)}
                    >
                      Eliminar
                    </Button>
                  </Space>
                ) : (
                  <Space>
                    <Button
                      className="main-button-white"
                      icon={<PlusOutlined />}
                      onClick={() => navigate(`/usuarios/${userId}/historia`)}
                    >
                      Agregar
                    </Button>
                  </Space>
                )
              }
              loading={loadingRecord}
            >
              {record?.data.data ? (
                <>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Descriptions title="Datos Esenciales" column={1}>
                        <Descriptions.Item label="Empresa de Salud Domiciliaria">
                          {record?.data.data?.eps}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tipo de Sangre">
                          {record?.data.data?.tipo_sangre}
                        </Descriptions.Item>
                        <Descriptions.Item label="Estatura">
                          {record?.data.data?.altura} cm
                        </Descriptions.Item>
                        <Descriptions.Item label="Motivo de Ingreso">
                          {record?.data.data?.motivo_ingreso}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={12}>
                      <Descriptions
                        title="Discapacidades, Apoyos y Limitaciones"
                        column={1}
                      >
                        <Descriptions.Item label="Discapacidad">
                          {disabilities.filter((a) => !!a).length ? (
                            disabilities.map((d) => (
                              <Tag key={d} color="purple">
                                {d}
                              </Tag>
                            ))
                          ) : (
                            <Tag color="purple">Ninguna</Tag>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Limitaciones">
                          {limitations ? limitations : "Ninguna"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Dieta Especial">
                          {record?.data.data?.dieta_especial ? "Sí" : "No"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>
                  <Divider />
                  <Row gutter={24}>
                    <Col span={12}>
                      <Descriptions
                        title="Preexistencias y Alergias"
                        column={1}
                      >
                        <Descriptions.Item label="Cirugías">
                          {record?.data.data?.cirugias ? "Sí" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Alergias a medicamentos">
                          {record?.data.data?.medicamentos_alergia
                            ? "Sí"
                            : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Otras Alergias">
                          {record?.data.data?.otras_alergias ? "Sí" : "No"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={12}>
                      <Descriptions title="Hábitos y otros datos" column={1}>
                        <Descriptions.Item label="Cafeína">
                          {record?.data.data?.cafeina ? "Sí" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tabaquismo">
                          {record?.data.data?.tabaquismo ? "Sí" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Alcoholismo">
                          {record?.data.data?.alcoholismo ? "Sí" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sustancias psicoactivas">
                          {record?.data.data?.sustanciaspsico ? "Sí" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Maltratado">
                          {record?.data.data?.maltrato ? "Sí" : "No"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>
                </>
              ) : (
                <Flex style={{ height: 50, alignItems: "center" }}>
                  <Typography.Text>
                    El usuario no tiene historia clínica registrada
                  </Typography.Text>
                </Flex>
              )}
            </Card>
            <Card
              title="Reportes Clínicos"
              extra={
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  onClick={() => navigate(`/usuarios/${userId}/reporte`)}
                >
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
                // @ts-expect-error no idea
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
        </>
      )}
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
        confirmLoading={loadingUserDeletion}
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
      <Modal
        cancelText="Cancelar"
        okText="Sí, eliminar"
        onOk={handleDeleteRecord}
        onCancel={() => setIsDeleteRecordModalOpen(false)}
        open={isDeleteRecordModalOpen}
        confirmLoading={loadingDeletion}
        title="Confirmar eliminación"
        okButtonProps={{
          type: "default",
          style: { backgroundColor: "#F32013" },
        }}
        cancelButtonProps={{
          type: "text",
        }}
      >
        <Typography.Text>
          ¿Estás seguro que deseas eliminar la historia clínica de este usuario?
        </Typography.Text>
      </Modal>
    </>
  );
};
