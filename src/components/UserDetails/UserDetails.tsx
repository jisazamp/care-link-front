import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  type TableProps,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteFamilyMemberMutation } from "../../hooks/useDeleteFamilyMemberMutation/useDeleteFamilyMemberMutation";
import { useDeleteMedicalReport } from "../../hooks/useDeleteMedicalReport/useDeleteMedicalReport";
import { useDeleteRecordMutation } from "../../hooks/useDeleteRecordMutation/useDeleteRecordMutation";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserContracts } from "../../hooks/useGetUserContracts/useGetUserContracts";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useGetMedicalReports } from "../../hooks/useGetUserMedicalReports/useGetUserMedicalReports";
import { queryClient } from "../../main";
import type { FamilyMember } from "../../types";

const { Title } = Typography;
const { confirm } = Modal;

export const contractsColumns: ColumnsType<unknown> = [
  {
    title: "Tipo de Contrato",
    dataIndex: "tipo_contrato",
    key: "tipo_contrato",
  },
  {
    title: "Fecha Inicio",
    dataIndex: "fecha_inicio",
    key: "fecha_inicio",
  },
  {
    title: "Fecha Fin",
    dataIndex: "fecha_fin",
    key: "fecha_fin",
  },
  {
    title: "Facturar",
    dataIndex: "facturar_contrato",
    key: "facturar_contrato",
    render: (value: boolean) => (value ? "Sí" : "No"),
  },
];

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const { mutate: deleteFamilyMember } = useDeleteFamilyMemberMutation(userId);
  const { mutate: deleteRecord } = useDeleteRecordMutation();
  const { data: record, isLoading: loadingRecord } =
    useGetUserMedicalRecord(userId);
  const { data: medicalReports } = useGetMedicalReports(userId);
  const { data: userContracts } = useGetUserContracts(userId);
  const deleteReportMutation = useDeleteMedicalReport();

  const records = record?.data.data;

  const acudientesColumns: TableProps<{ acudiente: FamilyMember }>["columns"] =
    [
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
              danger
              size="small"
              type="link"
              onClick={() =>
                handleDeleteFamilyMember(record.acudiente.id_acudiente)
              }
            >
              Eliminar
            </Button>
          </Space>
        ),
      },
    ];

  const handleDeleteRecord = () => {
    confirm({
      title: "¿Estás seguro de que deseas eliminar la historia clínica?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      onOk() {
        if (userId) {
          deleteRecord(Number(record?.data.data?.id_historiaclinica), {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: [`user-medical-record-${userId}`],
              });
              queryClient.invalidateQueries({
                queryKey: [`user-${userId}-medical-reports`],
              });
            },
          });
        }
      },
    });
  };

  const handleDeleteReport = (reportId: number) => {
    confirm({
      title: "¿Estás seguro de que deseas eliminar este reporte clínico?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      cancelText: "Cancelar",
      onOk() {
        deleteReportMutation.mutate(reportId, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [`user-${userId}-medical-reports`],
            });
          },
        });
      },
    });
  };

  const handleDeleteFamilyMember = (memberId: number) => {
    confirm({
      title: "¿Estás seguro de que deseas eliminar este familiar?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      onOk() {
        if (memberId) {
          deleteFamilyMember(memberId);
        }
      },
    });
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
                    className="main-button-white"
                    shape="circle"
                  />
                </Space>
              }
              style={{ marginTop: 3 }}
            >
              <Row gutter={24} align="middle">
                {user?.data.data.url_imagen && (
                  <Col lg={4}>
                    <Avatar
                      src={user.data.data.url_imagen}
                      size={120}
                      alt="Avatar del paciente"
                      style={{ border: "1px solid #ddd" }}
                    />
                  </Col>
                )}
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
                          "DD-MM-YYYY",
                        )}
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
                      className="main-button-white"
                      shape="circle"
                      onClick={handleDeleteRecord}
                    />
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
              {records ? (
                <Flex vertical gap={60}>
                  <Flex gap={60} align="center">
                    <Flex align="center" style={{ flex: 0.4, minWidth: 200 }}>
                      <Divider
                        type="vertical"
                        style={{ height: 70, borderWidth: 2 }}
                      />
                      <Typography.Title level={5}>
                        Datos Esenciales
                      </Typography.Title>
                    </Flex>
                    <Flex vertical gap={10} style={{ flex: 2 }}>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Empresa de salud domiciliaria:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.emer_medica ? "Sí" : "No"}
                        </Typography.Text>{" "}
                        {records.telefono_emermedica && (
                          <Typography.Text
                            style={{
                              backgroundColor: "#F1E6F5",
                              borderRadius: 20,
                              fontWeight: 500,
                              marginLeft: 5,
                              paddingBottom: 4,
                              paddingLeft: 8,
                              paddingRight: 8,
                              paddingTop: 4,
                            }}
                          >
                            {records.telefono_emermedica}
                          </Typography.Text>
                        )}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Tipo de sangre:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records?.tipo_sangre}
                        </Typography.Text>{" "}
                        Estatura:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records?.altura}
                        </Typography.Text>
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Motivo ingreso:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records?.motivo_ingreso}
                        </Typography.Text>{" "}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                  <Flex gap={60} align="center">
                    <Flex align="center" style={{ flex: 0.4, minWidth: 200 }}>
                      <Divider
                        type="vertical"
                        style={{ height: 70, borderWidth: 2 }}
                      />
                      <Typography.Title level={5}>
                        Discapacidades, Apoyos y Limitaciones
                      </Typography.Title>
                    </Flex>
                    <Flex vertical gap={10} style={{ flex: 2 }}>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Discapacidad:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.discapacidades ? "Sí" : "No"}
                        </Typography.Text>{" "}
                        {records.discapacidades
                          ?.split(",")
                          .filter((a) => !!a)
                          .map((e) => (
                            <Typography.Text
                              key={e}
                              style={{
                                backgroundColor: "#F1E6F5",
                                borderRadius: 20,
                                fontWeight: 500,
                                marginLeft: 5,
                                paddingBottom: 4,
                                paddingLeft: 8,
                                paddingRight: 8,
                                paddingTop: 4,
                              }}
                            >
                              {e}
                            </Typography.Text>
                          ))}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Limitaciones:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.limitaciones ? "Sí" : "No"}
                        </Typography.Text>{" "}
                        {records.limitaciones
                          ?.split(",")
                          .filter((a) => !!a)
                          .map((e) => (
                            <Typography.Text
                              key={e}
                              style={{
                                backgroundColor: "#F1E6F5",
                                borderRadius: 20,
                                fontWeight: 500,
                                marginLeft: 5,
                                paddingBottom: 4,
                                paddingLeft: 8,
                                paddingRight: 8,
                                paddingTop: 4,
                              }}
                            >
                              {e}
                            </Typography.Text>
                          ))}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Dieta Especial:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.dieta_especial ? "Sí" : "No"}
                        </Typography.Text>{" "}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                  <Flex gap={60} align="center">
                    <Flex align="center" style={{ flex: 0.4, minWidth: 200 }}>
                      <Divider
                        type="vertical"
                        style={{ height: 70, borderWidth: 2 }}
                      />
                      <Typography.Title level={5}>
                        Preexistencias y Alergias
                      </Typography.Title>
                    </Flex>
                    <Flex vertical gap={10} style={{ flex: 2 }}>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Cirugias:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.cirugias ? "Sí" : "No"}
                        </Typography.Text>
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Alergias a medicamentos:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.alergico_medicamento ? "Sí" : "No"}
                        </Typography.Text>
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Otras alergias:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.otras_alergias ? "Sí" : "No"}
                        </Typography.Text>{" "}
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontWeight: 500, marginRight: 5 }}
                      >
                        Condiciones especiales:{" "}
                        <Typography.Text style={{ fontWeight: 400 }}>
                          {records.otras_alergias ? "Sí" : "No"}
                        </Typography.Text>{" "}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                  <Flex gap={60} align="center">
                    <Flex align="center" style={{ flex: 0.4, minWidth: 200 }}>
                      <Divider
                        type="vertical"
                        style={{ height: 70, borderWidth: 2 }}
                      />
                      <Typography.Title level={5}>
                        Hábitos y otros datos
                      </Typography.Title>
                    </Flex>
                    <Flex vertical gap={10} style={{ flex: 2 }}>
                      <Flex gap={10}>
                        <Typography.Text style={{ fontWeight: 500 }}>
                          Cafeina{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {records.cafeina ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: 500 }}>
                          Tabaquismo{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {records.tabaquismo ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: 500 }}>
                          Alcoholismo{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {records.alcoholismo ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: 500 }}>
                          Sustancias Psicoactivas{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {records.sustanciaspsico ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                      </Flex>
                      <Flex gap={10} style={{ flex: 2 }}>
                        <Typography.Text style={{ fontWeight: 500 }}>
                          Maltratado{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {records.maltratado ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
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
                <Tooltip
                  title={
                    !record?.data.data?.id_historiaclinica
                      ? "No se pueden registrar reportes clínicos si no hay una historia clínica"
                      : null
                  }
                >
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      navigate(`/usuarios/${userId}/nuevo-reporte`)
                    }
                    className="main-button-white"
                    disabled={!record?.data.data?.id_historiaclinica}
                  >
                    Agregar
                  </Button>
                </Tooltip>
              }
              className="detail-card"
            >
              <Table
                rowKey="id_profesional"
                columns={[
                  {
                    title: "Profesional",
                    dataIndex: "profesional",
                    render: (_, record) => {
                      return `${record.profesional?.nombres} ${record.profesional?.apellidos}`;
                    },
                  },
                  {
                    title: "Fecha registro",
                    dataIndex: "fecha_registro",
                    render: (_, record) =>
                      record.fecha_registro
                        ? dayjs(record.fecha_registro).format("DD-MM-YYYY")
                        : "",
                  },
                  {
                    title: "Tipo reporte",
                    dataIndex: "tipo_reporte",
                  },
                  {
                    title: "Acciones",
                    dataIndex: "acciones",
                    key: "acciones",
                    render: (_, record) => (
                      <Space>
                        <Link
                          to={`/usuarios/${userId}/reportes/${record.id_reporteclinico}/detalles`}
                        >
                          <Button
                            type="link"
                            className="main-button-link"
                            size="small"
                          >
                            Detalles
                          </Button>
                        </Link>
                        <Divider type="vertical" />
                        <Link
                          to={`/usuarios/${userId}/reportes/${record.id_reporteclinico}`}
                        >
                          <Button
                            type="link"
                            className="main-button-link"
                            size="small"
                          >
                            Editar
                          </Button>
                        </Link>
                        <Divider type="vertical" />
                        <Button
                          className="main-button-link"
                          size="small"
                          type="link"
                          danger
                          onClick={() =>
                            handleDeleteReport(record.id_reporteclinico)
                          }
                        >
                          Eliminar
                        </Button>
                      </Space>
                    ),
                  },
                ]}
                dataSource={medicalReports?.data.data}
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
                rowKey="id_acudiente"
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
                <Button icon={<PlusOutlined />} className="main-button-white">
                  Agregar
                </Button>
              }
              className="detail-card"
            >
              <Table
                columns={contractsColumns}
                dataSource={userContracts?.data}
                pagination={false}
                rowKey="id_contrato"
              />
            </Card>
          </Space>
          <Divider />
        </>
      )}
    </>
  );
};
