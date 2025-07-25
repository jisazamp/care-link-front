import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Collapse,
  Divider,
  Flex,
  Modal,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteFamilyMemberMutation } from "../../hooks/useDeleteFamilyMemberMutation/useDeleteFamilyMemberMutation";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserContracts } from "../../hooks/useGetUserContracts/useGetUserContracts";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { useGetMedicalReports } from "../../hooks/useGetUserMedicalReports/useGetUserMedicalReports";
import type { Contract, FamilyMember } from "../../types";

const { Title } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

export const UserHomeVisitDetails: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const { mutate: deleteFamilyMember } = useDeleteFamilyMemberMutation(userId);
  const { data: medicalReports } = useGetMedicalReports(userId);
  const { data: userContracts } = useGetUserContracts(userId);

  const acudientesColumns: ColumnsType<FamilyMember> = [
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Parentesco",
      dataIndex: "parentesco",
      key: "parentesco",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "E-Mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Link
            to={`/visitas-domiciliarias/usuarios/${userId}/familiar/${record.id_acudiente}`}
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
              handleDeleteFamilyMember(record.id_acudiente)
            }
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

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
            to={`/visitas-domiciliarias/usuarios/${contract.id_usuario}/contrato/${contract.id_contrato}/editar`}
          >
            <Button type="link" className="main-button-link" size="small">
              Editar
            </Button>
          </Link>
          <Divider type="vertical" />
          <Link
            to={`/visitas-domiciliarias/usuarios/${contract.id_usuario}/contrato/${contract.id_contrato}`}
          >
            <Button type="link" className="main-button-link" size="small">
              Ver
            </Button>
          </Link>
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
            title: "Visitas domiciliarias",
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
          <Collapse
            accordion
            style={{ background: "transparent", width: "100%" }}
          >
            <Panel header="Datos básicos y de localización" key="1">
              <div className="user-details-card" style={{ width: "100%" }}>
                <div className="user-details-head">
                  <div className="user-details-title-wrapper">
                    <span className="user-details-title">
                      Datos básicos y de localización
                    </span>
                  </div>
                  <div className="user-details-actions">
                    <Link to={`/visitas-domiciliarias/usuarios/${userId}/editar`}>
                      <button type="button" className="user-details-btn">
                        <span className="user-details-btn-icon">
                          <EditOutlined />
                        </span>
                        Editar
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="user-details-btn user-details-btn-danger"
                    >
                      <span className="user-details-btn-icon">
                        <DeleteOutlined />
                      </span>
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
                      <div
                        className="user-details-avatar-img"
                        style={{
                          background: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 32,
                          color: "#bbb",
                        }}
                      >
                        {user?.data.data.nombres?.[0] ?? "U"}
                      </div>
                    )}
                  </div>
                  <div
                    className="user-details-info"
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 40,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        className="user-details-info-name"
                        style={{ fontWeight: 500, fontSize: 18, minWidth: 260 }}
                      >
                        {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
                      </div>
                      <div
                        style={{ color: "#222", fontSize: 15, minWidth: 220 }}
                      >
                        <span className="user-details-info-bold">
                          {user?.data.data.n_documento}
                        </span>
                        <span> - {user?.data.data.genero}</span>
                        <span>
                          {" "}
                          -{" "}
                          {dayjs(user?.data.data.fecha_nacimiento).format(
                            "YYYY/MM/DD",
                          )}
                        </span>
                        <span>
                          {" "}
                          -{" "}
                          <span className="user-details-info-bold">
                            {dayjs().diff(
                              dayjs(user?.data.data.fecha_nacimiento),
                              "years",
                            )}{" "}
                            años
                          </span>
                        </span>
                      </div>
                      <div
                        style={{ color: "#222", fontSize: 15, minWidth: 220 }}
                      >
                        {user?.data.data.direccion}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 40,
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{ color: "#222", fontSize: 15, minWidth: 260 }}
                      >
                        {user?.data.data.estado_civil}
                        {user?.data.data.profesion && (
                          <span> - {user?.data.data.profesion}</span>
                        )}
                      </div>
                      <div
                        style={{ color: "#222", fontSize: 15, minWidth: 220 }}
                      >
                        {user?.data.data.telefono}
                        {user?.data.data.email && (
                          <span> - {user?.data.data.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            <Panel header="Reportes Clínicos" key="2">
              <Card
                extra={
                  <Tooltip
                    title={
                      !user?.data.data?.id_usuario
                        ? "No se pueden registrar reportes clínicos si no hay un usuario seleccionado"
                        : null
                    }
                  >
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() =>
                        navigate(`/visitas-domiciliarias/usuarios/${userId}/nuevo-reporte`)
                      }
                      className="main-button-white"
                      disabled={!user?.data.data?.id_usuario}
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
                            to={`/visitas-domiciliarias/usuarios/${userId}/reportes/${record.id_reporteclinico}/detalles`}
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
                            to={`/visitas-domiciliarias/usuarios/${userId}/reportes/${record.id_reporteclinico}`}
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
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={medicalReports?.data.data}
                  pagination={false}
                />
              </Card>
            </Panel>
            <Panel header="Acudientes" key="3">
              <Card
                extra={
                  <Link to={`/visitas-domiciliarias/usuarios/${userId}/familiar`}>
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
                  columns={acudientesColumns}
                  loading={loadingFamilyMembers}
                  dataSource={familyMembers?.data.data}
                  pagination={false}
                />
              </Card>
            </Panel>
            <Panel header="Contratos" key="4">
              <Card
                extra={
                  <Button
                    icon={<PlusOutlined />}
                    className="main-button-white"
                    onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/contrato`)}
                  >
                    Agregar
                  </Button>
                }
                className="detail-card"
              >
                <Table
                  columns={contractsColumns}
                  dataSource={userContracts || []}
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