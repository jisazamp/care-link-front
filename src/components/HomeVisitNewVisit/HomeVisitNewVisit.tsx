import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  TimePicker,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useCreateHomeVisit, CreateHomeVisitData } from "../../hooks/useCreateHomeVisit/useCreateHomeVisit";
import { useUpdateHomeVisit, UpdateHomeVisitData } from "../../hooks/useUpdateHomeVisit/useUpdateHomeVisit";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserFirstHomeVisit } from "../../hooks/useGetUserFirstHomeVisit/useGetUserFirstHomeVisit";
import { useGetProfessionals } from "../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetServiceRate } from "../../hooks/useGetServiceRate/useGetServiceRate";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const HomeVisitNewVisit: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  const [form] = Form.useForm();
  const [selectedProfessional, setSelectedProfessional] = React.useState<any>(null);
  const [isViewMode, setIsViewMode] = React.useState<boolean>(false);

  const { data: userData, isLoading: loadingUser } = useGetUserById(userId);
  const { data: firstHomeVisit, isLoading: loadingFirstVisit } = useGetUserFirstHomeVisit(userId);
  const { data: professionalsData, isLoading: loadingProfessionals } = useGetProfessionals();
  const { data: serviceRateData, isLoading: loadingServiceRate } = useGetServiceRate(4, dayjs().year()); // Service ID 4 for "Visitas Domiciliarias"

  const createHomeVisitMutation = useCreateHomeVisit(userId);
  const updateHomeVisitMutation = useUpdateHomeVisit();

  // Determinar si estamos editando una visita existente o creando una nueva
  const isEditing = firstHomeVisit !== null;
  
  // Si estamos editando, por defecto estamos en modo visualización
  React.useEffect(() => {
    if (isEditing) {
      setIsViewMode(true);
    }
  }, [isEditing]);

  // Debug logs (solo cuando hay problemas)
  if (loadingUser || loadingFirstVisit || loadingProfessionals || loadingServiceRate) {
    console.log(" HomeVisitNewVisit Debug - Loading states:");
    console.log("userId:", userId);
    console.log("loadingUser:", loadingUser);
    console.log("loadingFirstVisit:", loadingFirstVisit);
    console.log("loadingProfessionals:", loadingProfessionals);
    console.log("loadingServiceRate:", loadingServiceRate);
  }



  const handleSubmit = async (values: any) => {
    // No permitir envío en modo visualización
    if (isViewMode) {
      return;
    }
    
    try {
      if (isEditing && firstHomeVisit) {
        // Actualizar visita existente
        const updateData: UpdateHomeVisitData = {
          fecha_visita: values.fecha_visita.format("YYYY-MM-DD"),
          hora_visita: values.hora_visita.format("HH:mm:ss"),
          direccion_visita: userData?.data.data?.direccion || "",
          telefono_visita: userData?.data.data?.telefono || "",
          valor_dia: serviceRateData?.data.data?.precio_por_dia || 0,
          observaciones: values.observaciones,
          id_profesional_asignado: values.id_profesional_asignado,
        };

        await updateHomeVisitMutation.mutateAsync({
          userId: Number(userId),
          visitaId: firstHomeVisit.id_visitadomiciliaria,
          data: updateData,
        });
        message.success(" Visita domiciliaria actualizada exitosamente");
      } else {
        // Crear nueva visita
        const visitaData: CreateHomeVisitData = {
          id_usuario: Number(userId),
          fecha_visita: values.fecha_visita.format("YYYY-MM-DD"),
          hora_visita: values.hora_visita.format("HH:mm:ss"),
          direccion_visita: userData?.data.data?.direccion || "",
          telefono_visita: userData?.data.data?.telefono || "",
          valor_dia: serviceRateData?.data.data?.precio_por_dia || 0,
          observaciones: values.observaciones,
          id_profesional_asignado: values.id_profesional_asignado,
        };

        await createHomeVisitMutation.mutateAsync(visitaData);
        message.success(" Visita domiciliaria creada exitosamente");
      }
      
      navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
    } catch (error) {
      message.error(` Error al ${isEditing ? 'actualizar' : 'crear'} la visita domiciliaria`);
    }
  };

  const handleCancel = () => {
    navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
  };

  const handleProfessionalChange = (value: number) => {
    const professional = professionalsData?.data.data?.find((p: any) => p.id_profesional === value);
    setSelectedProfessional(professional);
  };

  // Establecer el profesional asignado cuando se carguen los datos
  useEffect(() => {
    if (isEditing && firstHomeVisit && professionalsData?.data.data) {
      // Buscar el profesional asignado en la lista de profesionales
      const assignedProfessional = professionalsData.data.data.find((prof: any) => {
        const profName = `${prof.nombres} ${prof.apellidos}`;
        return firstHomeVisit.profesional_asignado?.includes(profName);
      });
      
      if (assignedProfessional) {
        form.setFieldsValue({ id_profesional_asignado: assignedProfessional.id_profesional });
        setSelectedProfessional(assignedProfessional);
      }
    }
  }, [isEditing, firstHomeVisit, professionalsData, form]);

  // Mostrar loading solo si faltan datos críticos
  if (loadingUser || !userData) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Cargando datos del paciente...</p>
      </div>
    );
  }

  if (loadingProfessionals || !professionalsData) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Cargando lista de profesionales...</p>
      </div>
    );
  }

  if (loadingServiceRate || !serviceRateData) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Obteniendo tarifa de "Visitas Domiciliarias"...</p>
      </div>
    );
  }

  // Si no hay visita existente y no está cargando, mostrar mensaje
  if (!loadingFirstVisit && !firstHomeVisit) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>No se encontró una visita domiciliaria para este paciente.</p>
        <p>Se creará una nueva visita cuando completes el formulario.</p>
        <Button 
          type="primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: "16px" }}
        >
          Refrescar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          style={{ marginBottom: "16px" }}
        >
          Volver
        </Button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={3}>
            {isViewMode ? "Detalles de Visita Domiciliaria" : isEditing ? "Editar Visita Domiciliaria" : "Nueva Visita Domiciliaria"}
          </Title>
          {isViewMode && isEditing && (
            <Button
              onClick={() => setIsViewMode(false)}
              className="main-button-white"
            >
              Editar
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            fecha_visita: isEditing && firstHomeVisit 
              ? dayjs(firstHomeVisit.fecha_visita) 
              : dayjs(),
            hora_visita: isEditing && firstHomeVisit 
              ? dayjs(`2000-01-01 ${firstHomeVisit.hora_visita}`) 
              : dayjs().hour(8).minute(0),
            observaciones: isEditing && firstHomeVisit 
              ? firstHomeVisit.observaciones || "" 
              : "",
                         id_profesional_asignado: isEditing && firstHomeVisit 
               ? firstHomeVisit.profesional_asignado 
                 ? undefined // No establecer valor inicial, se manejará en useEffect
                 : undefined
               : undefined,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fecha de Visita"
                name="fecha_visita"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona la fecha de visita",
                  },
                ]}
                extra={isEditing && !isViewMode ? (
                  <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                    ⚠️ Cambiar la fecha cambiará automáticamente el estado a "REPROGRAMADA"
                  </Typography.Text>
                ) : undefined}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Seleccionar fecha"
                  disabled={isViewMode}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hora de Visita"
                name="hora_visita"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona la hora de visita",
                  },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  placeholder="Seleccionar hora"
                  disabled={isViewMode}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Profesional Asignado"
                name="id_profesional_asignado"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona un profesional",
                  },
                ]}
              >
                <Select
                  placeholder="Selecciona un profesional"
                  loading={loadingProfessionals}
                  showSearch
                  onChange={handleProfessionalChange}
                  disabled={isViewMode}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {professionalsData?.data.data?.map((prof: any) => (
                    <Option key={prof.id_profesional} value={prof.id_profesional}>
                      {prof.nombres} {prof.apellidos} - {prof.especialidad}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Observaciones"
            name="observaciones"
          >
            <TextArea
              rows={4}
              placeholder="Ingresa observaciones adicionales sobre la visita"
              disabled={isViewMode}
            />
          </Form.Item>

          {/* Resumen de la visita */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Resumen de la Visita</span>
                {selectedProfessional && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '12px',
                    color: '#52c41a',
                    marginLeft: '8px'
                  }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#52c41a'
                    }} />
                    <span>Profesional asignado</span>
                  </div>
                )}
              </div>
            }
            size="small"
            style={{ 
              marginBottom: 16, 
              backgroundColor: selectedProfessional ? '#f6ffed' : '#fafafa',
              borderColor: selectedProfessional ? '#b7eb8f' : '#d9d9d9'
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Paciente:</strong>
                  <div style={{ color: '#666' }}>
                    {userData?.data.data?.nombres} {userData?.data.data?.apellidos}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Dirección:</strong>
                  <div style={{ color: '#666' }}>
                    {userData?.data.data?.direccion}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Teléfono:</strong>
                  <div style={{ color: '#666' }}>
                    {userData?.data.data?.telefono}
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Valor por día:</strong>
                  <div style={{ color: '#52c41a', fontWeight: 500 }}>
                    ${serviceRateData?.data.data?.precio_por_dia?.toLocaleString() || '0'}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Estado actual:</strong>
                  <div style={{ 
                    color: isEditing && firstHomeVisit?.estado_visita === 'REPROGRAMADA' ? '#fa8c16' : 
                           isEditing && firstHomeVisit?.estado_visita === 'REALIZADA' ? '#52c41a' :
                           isEditing && firstHomeVisit?.estado_visita === 'CANCELADA' ? '#ff4d4f' : '#1890ff',
                    fontWeight: 500 
                  }}>
                    {isEditing && firstHomeVisit ? firstHomeVisit.estado_visita : 'PENDIENTE'}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Profesional asignado:</strong>
                  <div style={{ color: '#1890ff', fontWeight: 500 }}>
                    {selectedProfessional ? 
                      `${selectedProfessional.nombres} ${selectedProfessional.apellidos} (${selectedProfessional.especialidad})`
                      : 'Sin asignar'
                    }
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            {!isViewMode && (
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={createHomeVisitMutation.isPending || updateHomeVisitMutation.isPending}
                style={{ marginRight: "8px" }}
              >
                {isEditing ? "Actualizar Visita" : "Crear Visita"}
              </Button>
            )}
            <Button onClick={handleCancel}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 