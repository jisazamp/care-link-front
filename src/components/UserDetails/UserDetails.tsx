import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {

  Breadcrumb,
  Button,
  Card,
  
  Divider,
  Flex,
  Modal,
  
  Space,
  Spin,
  Table,
  type TableProps,
  Tooltip,
  Typography,
  Collapse,
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
import type { Contract, FamilyMember } from "../../types";
import { useDeleteContract } from "../../hooks/useDeleteContract";

const { Title } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const { mutate: deleteFamilyMember } = useDeleteFamilyMemberMutation(userId);
  const { mutate: deleteRecord } = useDeleteRecordMutation();
  const { deleteContractFn } = useDeleteContract();
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

  const handleDeleteContract = (contractId: number) => {
    confirm({
      title: "¿Estás seguro de que deseas eliminar este contrato?",
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
        if (contractId) {
          deleteContractFn(contractId, {
            onSuccess: () =>
              queryClient.invalidateQueries({
                queryKey: [`user-${userId}-contracts`],
              }),
          });
        }
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

  const contractsColumns: ColumnsType<Contract> = [
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
    {
      title: "Acciones",
      key: "acciones",
      render: (_, contract) => (
        <Space>
          <Link
            to={`/usuarios/${contract.id_usuario}/contrato/${contract.id_contrato}/editar`}
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
            onClick={() => handleDeleteContract(contract.id_contrato)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

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
          <Collapse accordion style={{ background: "transparent", width: "100%" }}>
            <Panel header="Datos básicos y de localización" key="1">
              <div className="user-details-card" style={{ width: "100%" }}>
                <div className="user-details-head">
                  <div className="user-details-title-wrapper">
                    <span className="user-details-title">Datos básicos y de localización</span>
                  </div>
                  <div className="user-details-actions">
                    <Link to={`/usuarios/${userId}/editar`}>
                      <button className="user-details-btn">
                        <span className="user-details-btn-icon"><EditOutlined /></span>
                        Editar
                      </button>
                    </Link>
                    <button className="user-details-btn user-details-btn-danger">
                      <span className="user-details-btn-icon"><DeleteOutlined /></span>
                    </button>
                  </div>
                </div>
                <div className="user-details-body">
                  <div className="user-details-avatar">
                    {user?.data.data.url_imagen ? (
                      <img
                        src={user.data.data.url_imagen}
                        alt="Avatar del paciente"
                        className="user-details-avatar-img"
                      />
                    ) : (
                      <div className="user-details-avatar-img" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#bbb' }}>
                        {user?.data.data.nombres?.[0] ?? 'U'}
                      </div>
                    )}
                  </div>
                  <div className="user-details-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40, marginBottom: 4 }}>
                      <div className="user-details-info-name" style={{ fontWeight: 500, fontSize: 18, minWidth: 260 }}>
                        {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
                      </div>
                      <div style={{ color: '#222', fontSize: 15, minWidth: 220 }}>
                        <span className="user-details-info-bold">{user?.data.data.n_documento}</span>
                        <span> - {user?.data.data.genero}</span>
                        <span> - {dayjs(user?.data.data.fecha_nacimiento).format("YYYY/MM/DD")}</span>
                        <span> - <span className="user-details-info-bold">{dayjs().diff(dayjs(user?.data.data.fecha_nacimiento), "years")} años</span></span>
                      </div>
                      <div style={{ color: '#222', fontSize: 15, minWidth: 220 }}>
                        {user?.data.data.direccion}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40, marginBottom: 4 }}>
                      <div style={{ color: '#222', fontSize: 15, minWidth: 260 }}>
                        {user?.data.data.estado_civil}
                        {user?.data.data.profesion && <span> - {user?.data.data.profesion}</span>}
                      </div>
                      <div style={{ color: '#222', fontSize: 15, minWidth: 220 }}>
                        {user?.data.data.telefono}
                        {user?.data.data.email && <span> - {user?.data.data.email}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel header="Historia Clínica" key="2">
              <Card
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
                          Discapacidad: <Typography.Text style={{ fontWeight: 400 }}>{records.discapacidades ? "Sí" : "No"}</Typography.Text>
                          {records.discapacidades && (
                            <Link to={`/usuarios/${userId}/historia#discapacidad`} style={{ marginLeft: 12 }}>
                              <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                            </Link>
                          )}
                          {records.discapacidades?.split(",").filter((a) => !!a).map((e) => (
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
                          Limitaciones: <Typography.Text style={{ fontWeight: 400 }}>{records.limitaciones ? "Sí" : "No"}</Typography.Text>
                          {records.limitaciones && (
                            <Link to={`/usuarios/${userId}/historia#limitaciones`} style={{ marginLeft: 12 }}>
                              <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                            </Link>
                          )}
                          {records.limitaciones?.split(",").filter((a) => !!a).map((e) => (
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
                          Dieta Especial: <Typography.Text style={{ fontWeight: 400 }}>{records.dieta_especial ? "Sí" : "No"}</Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Observaciones Dieta:
                          <Link to={`/usuarios/${userId}/historia#dieta`} style={{ marginLeft: 12 }}>
                            <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                          </Link>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Apoyos y tratamientos:
                          <Link to={`/usuarios/${userId}/historia#medical-treatments`} style={{ marginLeft: 12 }}>
                            <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                          </Link>
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
                          Cirugias: <Typography.Text style={{ fontWeight: 400 }}>{records.cirugias ? "Sí" : "No"}</Typography.Text>
                          {records.cirugias && (
                            <Link to={`/usuarios/${userId}/historia#surgeries`} style={{ marginLeft: 12 }}>
                              <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                            </Link>
                          )}
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Alergias a medicamentos: <Typography.Text style={{ fontWeight: 400 }}>{records.alergico_medicamento ? "Sí" : "No"}</Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Otras alergias: <Typography.Text style={{ fontWeight: 400 }}>{records.otras_alergias ? "Sí" : "No"}</Typography.Text>
                          {records.otras_alergias && (
                            <Link to={`/usuarios/${userId}/historia#otherAlergies`} style={{ marginLeft: 12 }}>
                              <Typography.Text style={{ color: "#9957C2", cursor: "pointer" }}>Ver</Typography.Text>
                            </Link>
                          )}
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Condiciones especiales: <Typography.Text style={{ fontWeight: 400 }}>{records.otras_alergias ? "Sí" : "No"}</Typography.Text>
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
            </Panel>
            <Panel header="Reportes Clínicos" key="3">
              <Card
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
                              ver
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
            </Panel>
            <Panel header="Acudientes" key="4">
              <Card
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
            </Panel>
            <Panel header="Contratos" key="5">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => navigate(`/usuarios/${userId}/contrato`)}
                  >
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
            </Panel>
          </Collapse>
          <Divider />
        </>
      )}
    </>
  );
};
