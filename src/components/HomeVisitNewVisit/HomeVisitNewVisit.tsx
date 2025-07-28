import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
  Typography,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useCreateHomeVisit, CreateHomeVisitData } from "../../hooks/useCreateHomeVisit/useCreateHomeVisit";
import { useUpdateHomeVisit, UpdateHomeVisitData } from "../../hooks/useUpdateHomeVisit/useUpdateHomeVisit";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useGetUserFirstHomeVisit } from "../../hooks/useGetUserFirstHomeVisit/useGetUserFirstHomeVisit";
import { useGetHomeVisitById } from "../../hooks/useGetHomeVisitById";
import { useGetProfessionals } from "../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetServiceRate } from "../../hooks/useGetServiceRate/useGetServiceRate";
import { useQueryClient } from "@tanstack/react-query";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const HomeVisitNewVisit: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  const visitaId = params.visitaId; // Nuevo parámetro para editar visitas específicas
  const [form] = Form.useForm();
  const [selectedProfessional, setSelectedProfessional] = React.useState<any>(null);
  const [isViewMode, setIsViewMode] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: userData, isLoading: loadingUser } = useGetUserById(userId);
  const { data: firstHomeVisit, isLoading: loadingFirstVisit } = useGetUserFirstHomeVisit(userId);
  const { data: specificVisit, isLoading: loadingSpecificVisit } = useGetHomeVisitById(visitaId);
  const { data: professionalsData, isLoading: loadingProfessionals } = useGetProfessionals();
  const { data: serviceRateData, isLoading: loadingServiceRate } = useGetServiceRate(4, dayjs().year()); // Service ID 4 for "Visitas Domiciliarias"

  const createHomeVisitMutation = useCreateHomeVisit(userId);
  const updateHomeVisitMutation = useUpdateHomeVisit();

  // Determinar si estamos editando una visita existente o creando una nueva
  // Solo es edición si tenemos un visitaId específico
  const isEditing = !!visitaId;
  
  // Determinar qué visita usar: específica o primera visita
  const currentVisitData = visitaId ? specificVisit?.data : firstHomeVisit;
  
  // Si estamos editando una visita específica, verificar si la visita tiene fecha y hora programadas
  // Si no las tiene (NULL), entonces no estamos en modo visualización
  React.useEffect(() => {
    if (isEditing && currentVisitData) {
      // Si la visita no tiene fecha o hora programada, no está en modo visualización
      const hasScheduledDateTime = currentVisitData.fecha_visita && currentVisitData.hora_visita;
      setIsViewMode(hasScheduledDateTime);
    } else {
      // Si no estamos editando, no estamos en modo visualización
      setIsViewMode(false);
    }
  }, [isEditing, currentVisitData]);

  // Forzar invalidación de queries cuando se monta el componente
  React.useEffect(() => {
    console.log("🔍 Componente HomeVisitNewVisit montado, userId:", userId, "visitaId:", visitaId);
    
    // Si tenemos un visitaId específico, invalidar la query de esa visita
    if (visitaId) {
      queryClient.invalidateQueries({
        queryKey: ["home-visit", visitaId],
      });
    }
    
    // Invalidar también las queries del usuario y primera visita
    queryClient.invalidateQueries({
      queryKey: ["user", userId],
    });
    queryClient.invalidateQueries({
      queryKey: ["user-first-home-visit", userId],
    });
  }, [userId, visitaId, queryClient]);

  // Debug logs para entender el problema de carga
  console.log("🔍 HomeVisitNewVisit Debug - Estado actual:");
  console.log("userId:", userId);
  console.log("visitaId:", visitaId);
  console.log("loadingUser:", loadingUser);
  console.log("loadingFirstVisit:", loadingFirstVisit);
  console.log("loadingSpecificVisit:", loadingSpecificVisit);
  console.log("loadingProfessionals:", loadingProfessionals);
  console.log("loadingServiceRate:", loadingServiceRate);
  console.log("userData:", userData);
  console.log("firstHomeVisit:", firstHomeVisit);
  console.log("specificVisit:", specificVisit);
  console.log("currentVisitData:", currentVisitData);
  console.log("professionalsData:", professionalsData);
  console.log("serviceRateData:", serviceRateData);
  console.log("isEditing:", isEditing);
  console.log("isViewMode:", isViewMode);



  const handleSubmit = async (values: any) => {
    // No permitir envío en modo visualización
    if (isViewMode) {
      return;
    }
    
    try {
      if (isEditing && currentVisitData) {
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

        // Usar el ID de la visita específica si está disponible, sino usar el de la primera visita
        const visitaIdToUpdate = visitaId ? Number(visitaId) : currentVisitData.id_visitadomiciliaria;

        await updateHomeVisitMutation.mutateAsync({
          userId: Number(userId),
          visitaId: visitaIdToUpdate,
          data: updateData,
        });
        message.success(" Visita domiciliaria actualizada exitosamente");
        
        // Redirigir de vuelta a la página de detalles para ver los cambios actualizados
        navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
      } else if (visitaId && !currentVisitData) {
        // Si tenemos un visitaId pero no hay datos de visita, mostrar error
        message.error("No se pudo cargar la visita domiciliaria. Por favor, inténtalo de nuevo.");
        return;
      } else {
        // Crear nueva visita solo si no estamos editando una existente
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
    if (isEditing && currentVisitData && professionalsData?.data.data) {
      // Buscar el profesional asignado en la lista de profesionales
      const assignedProfessional = professionalsData.data.data.find((prof: any) => {
        const profName = `${prof.nombres} ${prof.apellidos}`;
        return currentVisitData.profesional_asignado?.includes(profName);
      });
      
      if (assignedProfessional) {
        form.setFieldsValue({ id_profesional_asignado: assignedProfessional.id_profesional });
        setSelectedProfessional(assignedProfessional);
      }
    }
  }, [isEditing, currentVisitData, professionalsData, form]);

  // Mostrar loading solo si faltan datos críticos
  if (loadingUser || !userData) {
    console.log("🔍 Cargando datos del paciente...");
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Cargando datos del paciente...</p>
      </div>
    );
  }

  // Si estamos editando una visita específica, esperar a que se cargue
  if (visitaId && (loadingSpecificVisit || !specificVisit?.data)) {
    console.log("🔍 Cargando datos de la visita específica...");
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Cargando datos de la visita domiciliaria...</p>
      </div>
    );
  }

  if (loadingProfessionals || !professionalsData) {
    console.log("🔍 Cargando lista de profesionales...");
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Cargando lista de profesionales...</p>
      </div>
    );
  }

  if (loadingServiceRate || !serviceRateData) {
    console.log("🔍 Obteniendo tarifa de visitas domiciliarias...");
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Obteniendo tarifa de "Visitas Domiciliarias"...</p>
      </div>
    );
  }

  // Si estamos editando una visita específica y no está cargando, verificar si existe
  if (visitaId && !loadingSpecificVisit && !specificVisit?.data) {
    console.log("🔍 No se encontró la visita específica, mostrando mensaje de error");
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>No se encontró la visita domiciliaria especificada.</p>
        <Button 
          type="primary" 
          onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`)}
          style={{ marginTop: "16px" }}
        >
          Volver a detalles del paciente
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
            {isViewMode ? "Detalles de Visita Domiciliaria" : 
             isEditing && currentVisitData && (!currentVisitData.fecha_visita || !currentVisitData.hora_visita) ? "Programar Visita Domiciliaria" :
             isEditing ? "Editar Visita Domiciliaria" : "Crear Nueva Visita Domiciliaria"}
          </Title>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Botón de refrescar datos */}
            <Button
              icon={<ReloadOutlined />}
                             onClick={() => {
                 console.log("🔍 Invalidando queries manualmente...");
                 queryClient.invalidateQueries({
                   queryKey: ["user-first-home-visit", userId],
                 });
                 queryClient.invalidateQueries({
                   queryKey: ["user-home-visits", userId],
                 });
                 queryClient.invalidateQueries({
                   queryKey: ["user", userId],
                 });
                 if (visitaId) {
                   queryClient.invalidateQueries({
                     queryKey: ["home-visit", visitaId],
                   });
                 }
               }}
              size="small"
              title="Refrescar datos"
            >
              Refrescar
            </Button>
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
        {isEditing && currentVisitData && (!currentVisitData.fecha_visita || !currentVisitData.hora_visita) && (
          <div style={{ 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '6px', 
            padding: '8px 12px',
            fontSize: '12px',
            color: '#d46b08',
            marginTop: '8px'
          }}>
            ⚠️ Esta visita necesita ser programada
          </div>
        )}
        {isEditing && currentVisitData && currentVisitData.observaciones?.includes("creada automáticamente") && (
          <div style={{ 
            backgroundColor: '#e6f7ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '6px', 
            padding: '8px 12px',
            fontSize: '12px',
            color: '#1890ff',
            marginTop: '8px'
          }}>
            ℹ️ Esta visita fue creada automáticamente al registrar el usuario. Completa los datos para programarla.
          </div>
        )}
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
                                          initialValues={{
              fecha_visita: isEditing && currentVisitData && currentVisitData.fecha_visita
                ? dayjs(currentVisitData.fecha_visita) 
                : undefined,
              hora_visita: isEditing && currentVisitData && currentVisitData.hora_visita
                ? dayjs(`2000-01-01 ${currentVisitData.hora_visita}`) 
                : undefined,
              observaciones: isEditing && currentVisitData 
                ? currentVisitData.observaciones || "" 
                : "",
              id_profesional_asignado: undefined, // Se manejará en useEffect
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
                    ⚠️ Cambiar la fecha cambiará automáticamente el estado a "REPROGRAMADA" (incluso si ya está "REALIZADA")
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
                      color: isEditing && currentVisitData && (!currentVisitData.fecha_visita || !currentVisitData.hora_visita) ? '#faad14' :
                             isEditing && currentVisitData?.estado_visita === 'REPROGRAMADA' ? '#fa8c16' : 
                             isEditing && currentVisitData?.estado_visita === 'REALIZADA' ? '#52c41a' :
                             isEditing && currentVisitData?.estado_visita === 'CANCELADA' ? '#ff4d4f' : '#1890ff',
                      fontWeight: 500 
                    }}>
                      {isEditing && currentVisitData && (!currentVisitData.fecha_visita || !currentVisitData.hora_visita) ? 'PENDIENTE DE PROGRAMACIÓN' :
                       isEditing && currentVisitData ? currentVisitData.estado_visita : 'PENDIENTE'}
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
                                  {isEditing && currentVisitData && (!currentVisitData.fecha_visita || !currentVisitData.hora_visita) ? "Programar Visita" :
                   isEditing ? "Actualizar Visita" : "Crear Visita"}
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