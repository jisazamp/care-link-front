import { DeleteOutlined, EditOutlined, FolderOutlined, PlusOutlined } from "@ant-design/icons";
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
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteFamilyMemberMutation } from "../../hooks/useDeleteFamilyMemberMutation/useDeleteFamilyMemberMutation";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { useGetMedicalReports } from "../../hooks/useGetUserMedicalReports/useGetUserMedicalReports";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useGetUserHomeVisits } from "../../hooks/useGetUserHomeVisits/useGetUserHomeVisits";
import { queryClient } from "../../main";
import type { HomeVisit } from "../../types";



const { Title } = Typography;
const { confirm } = Modal;
const { Panel } = Collapse;

export const UserHomeVisitDetails: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading: loadingUser, isError: userError } = useGetUserById(userId);
  const { data: familyMembers, isLoading: loadingFamilyMembers } =
    useGetUserFamilyMembers(userId);
  const { mutate: deleteFamilyMember } = useDeleteFamilyMemberMutation(userId);
  const { data: medicalReports } = useGetMedicalReports(userId);
  const { data: homeVisits, isLoading: loadingHomeVisits, refetch: refetchHomeVisits } = useGetUserHomeVisits(userId);
  const { data: record, isLoading: loadingRecord } = useGetUserMedicalRecord(userId);

  // Forzar actualización de visitas domiciliarias cada 10 segundos para actualizar estados automáticamente
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      refetchHomeVisits();
    }, 5000); // 10 segundos - más frecuente para mejor experiencia

    return () => clearInterval(interval);
  }, [userId, refetchHomeVisits]);

  const acudientesColumns: ColumnsType<any> = [
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
          // Invalidar manualmente las consultas para asegurar actualización
          queryClient.invalidateQueries({ queryKey: [`get-user-${userId}-family-members`] });
          // Invalidar también la query del usuario para actualizar los datos de localización
          queryClient.invalidateQueries({ queryKey: [`get-user-${userId}`] });
        }
      },
    });
  };

  const handleDeleteRecord = () => {
    confirm({
      title: "¿Estás seguro de que deseas eliminar la historia clínica?",
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      onOk() {
        // Aquí se implementaría la lógica para eliminar el registro médico
        console.log("Eliminar registro médico");
      },
    });
  };



  const homeVisitsColumns: ColumnsType<HomeVisit> = [
    {
      title: "Fecha",
      dataIndex: "fecha_visita",
      key: "fecha_visita",
      render: (date: string) => {
        if (!date) {
          return (
            <span style={{ color: '#faad14', fontStyle: 'italic' }}>
              Pendiente de programación
            </span>
          );
        }
        return dayjs(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Hora",
      dataIndex: "hora_visita",
      key: "hora_visita",
      render: (time: string) => {
        if (!time) {
          return (
            <span style={{ color: '#faad14', fontStyle: 'italic' }}>
              Pendiente de programación
            </span>
          );
        }
        return dayjs(`2000-01-01 ${time}`).format("HH:mm");
      },
    },
    {
      title: "Estado",
      dataIndex: "estado_visita",
      key: "estado_visita",
      render: (estado: string, record: any) => {
        const config = {
          PENDIENTE: { color: "blue", text: "Pendiente" },
          REALIZADA: { color: "green", text: "Realizada" },
          CANCELADA: { color: "red", text: "Cancelada" },
          REPROGRAMADA: { color: "orange", text: "Reprogramada" },
        };
        
        // Si no tiene fecha o hora programada, mostrar como pendiente de programación
        if (!record.fecha_visita || !record.hora_visita) {
          return (
            <Tooltip title="Esta visita necesita ser programada con fecha y hora">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#faad14', fontStyle: 'italic' }}>
                  Pendiente de programación
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  color: '#faad14', 
                  backgroundColor: '#fff7e6',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  border: '1px solid #ffd591'
                }}>
                  PROGRAMAR
                </span>
              </div>
            </Tooltip>
          );
        }
        
        const updateDate = record.fecha_actualizacion ? new Date(record.fecha_actualizacion) : null;
        const visitDate = new Date(record.fecha_visita + ' ' + record.hora_visita);
        
        // Una visita se considera auto-completada si:
        // 1. Está marcada como "REALIZADA"
        // 2. Tiene fecha de actualización
        // 3. La fecha de actualización es posterior a la fecha/hora de la visita
        // 4. No fue reprogramada (no tiene estado anterior "REPROGRAMADA")
        const isAutoCompleted = estado === "REALIZADA" && 
                               record.fecha_actualizacion && 
                               updateDate && 
                               updateDate > visitDate;
        
        return (
          <Tooltip title={isAutoCompleted ? `Actualizada automáticamente el ${updateDate?.toLocaleDateString()} a las ${updateDate?.toLocaleTimeString()}` : undefined}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: config[estado as keyof typeof config]?.color }}>
                {config[estado as keyof typeof config]?.text || estado}
              </span>
              {isAutoCompleted && (
                <span style={{ 
                  fontSize: '10px', 
                  color: '#52c41a', 
                  backgroundColor: '#f6ffed',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  border: '1px solid #b7eb8f'
                }}>
                  AUTO
                </span>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Valor",
      dataIndex: "valor_dia",
      key: "valor_dia",
      render: (valor: number) => `$${valor.toLocaleString()}`,
    },
    {
      title: "Profesional Asignado",
      dataIndex: "profesional_asignado",
      key: "profesional_asignado",
      render: (profesional: string | null) => {
        if (profesional) {
          return (
            <Tooltip title={`Profesional asignado: ${profesional}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#52c41a',
                  flexShrink: 0
                }} />
                <span style={{ fontWeight: 500, color: '#1890ff', cursor: 'help' }}>
                  {profesional}
                </span>
              </div>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="No hay profesional asignado a esta visita">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#d9d9d9',
                  flexShrink: 0
                }} />
                <span style={{ color: '#8c8c8c', fontStyle: 'italic', cursor: 'help' }}>
                  Sin asignar
                </span>
              </div>
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Dirección",
      dataIndex: "direccion_visita",
      key: "direccion_visita",
      render: (direccion: string) => (
        <Tooltip title={direccion}>
          <span style={{ 
            maxWidth: '200px', 
            display: 'block', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {direccion}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalles de la visita y editarla si es necesario">
            <Link to={`/visitas-domiciliarias/usuarios/${userId}/editar-visita/${record.id_visitadomiciliaria}`}>
              <Button
                type="link"
                className="main-button-link"
                size="small"
              >
                Ver detalles y editar
              </Button>
            </Link>
          </Tooltip>
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
          { 
            title: user?.data.data ? `Detalles de ${user.data.data.nombres} ${user.data.data.apellidos}` : "Vista detalle" 
          },
        ]}
      />
      {loadingUser ? (
        <Flex align="center" justify="center" style={{ minHeight: 500 }}>
          <Spin />
        </Flex>
      ) : userError ? (
        <Flex align="center" justify="center" style={{ minHeight: 500 }}>
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={4} style={{ color: "#ff4d4f" }}>
              Usuario no encontrado
            </Typography.Title>
            <Typography.Text type="secondary">
              El usuario con ID {userId} no existe en el sistema.
            </Typography.Text>
            <br />
            <Button 
              type="primary" 
              onClick={() => navigate("/visitas-domiciliarias/usuarios")}
              style={{ marginTop: 16 }}
            >
              Volver a la lista de usuarios
            </Button>
          </div>
        </Flex>
      ) : (
        <>
          <Title level={3} className="page-title">
            {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
          </Title>
          <Card
            title={<Title level={4}>Información del Usuario</Title>}
            style={{ marginBottom: 16 }}
            bordered
          >
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
            <Panel header="Historia Clínica" key="2">
              <Card
                extra={
                  record?.data.data ? (
                    <Space>
                      <Button
                        icon={<EditOutlined />}
                        className="main-button-white"
                        onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/historia`)}
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
                        onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/historia`)}
                      >
                        Agregar
                      </Button>
                    </Space>
                  )
                }
                loading={loadingRecord}
              >
                {record?.data.data ? (
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
                            {record.data.data.emer_medica ? "Sí" : "No"}
                          </Typography.Text>{" "}
                          {record.data.data.telefono_emermedica && (
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
                              {record.data.data.telefono_emermedica}
                            </Typography.Text>
                          )}
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Tipo de sangre:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.tipo_sangre}
                          </Typography.Text>{" "}
                          Estatura:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.altura}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Motivo ingreso:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.motivo_ingreso}
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
                          Habilidades Biofísicas
                        </Typography.Title>
                      </Flex>
                      <Flex vertical gap={10} style={{ flex: 2 }}>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Tipo de alimentación:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.tipo_alimentacion}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Continencia:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.continencia}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Cuidado personal:{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data?.cuidado_personal}
                          </Typography.Text>
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
                          Hábitos Toxicológicos
                        </Typography.Title>
                      </Flex>
                      <Flex vertical gap={10} style={{ flex: 2 }}>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Tabaquismo{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data.tabaquismo ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Alcoholismo{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data.alcoholismo ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Typography.Text
                          style={{ fontWeight: 500, marginRight: 5 }}
                        >
                          Sustancias Psicoactivas{" "}
                          <Typography.Text style={{ fontWeight: 400 }}>
                            {record.data.data.sustanciaspsico ? "Sí" : "No"}
                          </Typography.Text>
                        </Typography.Text>
                        <Flex gap={10} style={{ flex: 2 }}>
                          <Typography.Text style={{ fontWeight: 500 }}>
                            Maltratado{" "}
                            <Typography.Text style={{ fontWeight: 400 }}>
                              {record.data.data.maltratado ? "Sí" : "No"}
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
                        navigate(`/visitas-domiciliarias/usuarios/${userId}/nuevo-reporte`)
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
                {medicalReports?.data.data && medicalReports.data.data.length > 0 ? (
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
                    dataSource={medicalReports.data.data}
                  pagination={false}
                />
                ) : (
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{ padding: "40px 0" }}
                  >
                    <FolderOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                    <Typography.Text type="secondary">No hay datos</Typography.Text>
                  </Flex>
                )}
              </Card>
            </Panel>
            <Panel header="Acudientes" key="4">
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
                  dataSource={familyMembers?.data.data?.map((item: any) => ({
                    id_acudiente: item.id_acudiente,
                    nombres: item.acudiente?.nombres || '',
                    apellidos: item.acudiente?.apellidos || '',
                    parentesco: item.parentesco || '',
                    telefono: item.acudiente?.telefono || '',
                    direccion: item.acudiente?.direccion || '',
                    email: item.acudiente?.email || '',
                  }))}
                  pagination={false}
                />
              </Card>
            </Panel>
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Visitas Domiciliarias</span>
                  {homeVisits?.data.data && homeVisits.data.data.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      fontSize: '12px',
                      color: '#666',
                      marginLeft: '8px'
                    }}>
                      <span>({homeVisits.data.data.length} visita{homeVisits.data.data.length !== 1 ? 's' : ''})</span>
                      {homeVisits.data.data.some((v: any) => v.profesional_asignado) && (
                        <span style={{ color: '#52c41a' }}>
                          • {homeVisits.data.data.filter((v: any) => v.profesional_asignado).length} con profesional asignado
                        </span>
                      )}
                      {homeVisits.data.data.some((v: any) => v.estado_visita === 'REALIZADA') && (
                        <span style={{ color: '#52c41a' }}>
                          • {homeVisits.data.data.filter((v: any) => v.estado_visita === 'REALIZADA').length} realizadas
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#8c8c8c', 
                    marginLeft: 'auto',
                    fontStyle: 'italic'
                  }}>
                    Las visitas vencidas se marcan automáticamente como "Realizadas". Al reprogramar, el estado cambia a "Reprogramada".
                  </div>
                </div>
              } 
              key="5"
            >
              <Card
                extra={
                  <Tooltip title="Programar nueva visita domiciliaria para este paciente">
                    <Button
                      icon={<PlusOutlined />}
                      className="main-button-white"
                      onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/nueva-visita`)}
                    >
                      Agregar
                    </Button>
                  </Tooltip>
                }
                className="detail-card"
              >
                {loadingHomeVisits ? (
                  <Flex align="center" justify="center" style={{ padding: "40px 0" }}>
                    <Spin />
                    <Typography.Text style={{ marginLeft: 16 }}>
                      Cargando visitas domiciliarias...
                    </Typography.Text>
                  </Flex>
                ) : homeVisits?.data.data && homeVisits.data.data.length > 0 ? (
                  <Table
                    columns={homeVisitsColumns}
                    dataSource={homeVisits.data.data}
                    loading={loadingHomeVisits}
                    pagination={false}
                    rowKey="id_visitadomiciliaria"
                  />
                ) : (
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{ padding: "40px 0" }}
                  >
                    <FolderOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                    <Typography.Text type="secondary">
                      No hay visitas domiciliarias programadas para este paciente
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: "12px", marginTop: 8 }}>
                      Haz clic en "Agregar" para programar la primera visita
                    </Typography.Text>
                  </Flex>
                )}
              </Card>
            </Panel>
          </Collapse>
          </Card>
          <Divider />
        </>
      )}
    </>
  );
}; 