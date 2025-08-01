import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Form, 
  DatePicker, 
  TimePicker, 
  Select, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Divider, 
  Descriptions, 
  Table, 
  Tag, 
  message, 
  Spin,
  Flex,
  Breadcrumb,
  Alert
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { EditOutlined, SaveOutlined, ArrowLeftOutlined, DollarOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';

// Hooks
import { useGetUserById } from '../../hooks/useGetUserById/useGetUserById';
import { useGetHomeVisitById } from '../../hooks/useGetHomeVisitById/useGetHomeVisitById';
import { useUpdateHomeVisit } from '../../hooks/useUpdateHomeVisit/useUpdateHomeVisit';
import { useGetProfessionals } from '../../hooks/useGetProfessionals/useGetProfessionals';
import { useGetHomeVisitBill } from '../../hooks/useGetHomeVisitBill/useGetHomeVisitBill';
import { useGetBillPayments } from '../../hooks/useGetBillPayments/useGetBillPayments';

const { TextArea } = Input;
const { Title, Text } = Typography;

// Schema de validación
const editVisitSchema = z.object({
  fecha_visita: z.any().refine((val) => val && val.isValid(), "La fecha es requerida"),
  hora_visita: z.any().refine((val) => val && val.isValid(), "La hora es requerida"),
  profesional_asignado: z.number().min(1, "El profesional es requerido"),
  direccion_visita: z.string().min(1, "La dirección es requerida"),
  telefono_visita: z.string().optional(),
  valor_dia: z.number().min(0, "El valor debe ser mayor o igual a 0"),
  observaciones: z.string().optional(),
  estado_visita: z.enum(['PENDIENTE', 'REALIZADA', 'CANCELADA', 'REPROGRAMADA']),
});

type EditVisitFormValues = z.infer<typeof editVisitSchema>;

export const HomeVisitEdit: React.FC = () => {
  const { id: userId, visitaId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { data: visita, isLoading: loadingVisita, refetch: refetchVisita } = useGetHomeVisitById(visitaId);
  const { data: professionals, isLoading: loadingProfessionals } = useGetProfessionals();
  const { mutate: updateHomeVisit, isPending: updating } = useUpdateHomeVisit();

  // Obtener factura relacionada si existe
  const { data: factura, isLoading: loadingFactura } = useGetHomeVisitBill(visitaId);
  const { data: pagos, isLoading: loadingPagos } = useGetBillPayments(factura?.data?.data?.id_factura);

  const methods = useForm<EditVisitFormValues>({
    resolver: zodResolver(editVisitSchema),
    defaultValues: {
      fecha_visita: dayjs(),
      hora_visita: dayjs().hour(8).minute(0),
      profesional_asignado: 0,
      direccion_visita: '',
      telefono_visita: '',
      valor_dia: 25000,
      observaciones: '',
      estado_visita: 'PENDIENTE',
    },
  });

  // Cargar datos de la visita cuando estén disponibles
  useEffect(() => {
    if (visita?.data?.data) {
      const visitaData = visita.data.data;
      methods.reset({
        fecha_visita: visitaData.fecha_visita ? dayjs(visitaData.fecha_visita) : dayjs(),
        hora_visita: visitaData.hora_visita ? dayjs(`2000-01-01 ${visitaData.hora_visita}`) : dayjs().hour(8).minute(0),
        profesional_asignado: visitaData.profesional_asignado?.id_profesional || 0,
        direccion_visita: visitaData.direccion_visita || '',
        telefono_visita: visitaData.telefono_visita || '',
        valor_dia: visitaData.valor_dia || 25000,
        observaciones: visitaData.observaciones || '',
        estado_visita: visitaData.estado_visita || 'PENDIENTE',
      });
    }
  }, [visita, methods]);

  const handleSubmit = async (data: EditVisitFormValues) => {
    if (!userId || !visitaId) return;

    setIsLoading(true);
    try {
      const updateData = {
        fecha_visita: data.fecha_visita.format('YYYY-MM-DD'),
        hora_visita: data.hora_visita.format('HH:mm:ss'),
        direccion_visita: data.direccion_visita,
        telefono_visita: data.telefono_visita,
        valor_dia: data.valor_dia,
        observaciones: data.observaciones,
        estado_visita: data.estado_visita,
        id_profesional_asignado: data.profesional_asignado,
      };

      updateHomeVisit(
        {
          userId: parseInt(userId),
          visitaId: parseInt(visitaId),
          data: updateData,
        },
        {
          onSuccess: () => {
            message.success('Visita domiciliaria actualizada exitosamente');
            refetchVisita();
          },
          onError: (error: any) => {
            message.error('Error al actualizar la visita: ' + error.message);
          },
        }
      );
    } catch (error) {
      message.error('Error al procesar la actualización');
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      PENDIENTE: 'blue',
      REALIZADA: 'green',
      CANCELADA: 'red',
      REPROGRAMADA: 'orange',
    };
    return colors[estado as keyof typeof colors] || 'default';
  };

  const getEstadoText = (estado: string) => {
    const texts = {
      PENDIENTE: 'Pendiente',
      REALIZADA: 'Realizada',
      CANCELADA: 'Cancelada',
      REPROGRAMADA: 'Reprogramada',
    };
    return texts[estado as keyof typeof texts] || estado;
  };

  const pagosColumns = [
    {
      title: 'Fecha de Pago',
      dataIndex: 'fecha_pago',
      key: 'fecha_pago',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Método de Pago',
      dataIndex: 'metodo_pago',
      key: 'metodo_pago',
      render: (metodo: any) => metodo?.nombre_metodo || 'N/A',
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'tipo_pago',
      key: 'tipo_pago',
      render: (tipo: any) => tipo?.nombre_tipo || 'N/A',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor: number) => `$${valor.toLocaleString()}`,
    },
  ];

  if (loadingUser || loadingVisita) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 400 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!visita?.data?.data) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={4}>Visita no encontrada</Title>
        <Text type="secondary">La visita domiciliaria especificada no existe.</Text>
        <br />
        <Button 
          type="primary" 
          onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`)}
          style={{ marginTop: 16 }}
        >
          Volver a los detalles del usuario
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb
        className="breadcrumb"
        style={{ marginBottom: "16px" }}
        items={[
          { title: "Inicio" },
          { title: "Visitas domiciliarias" },
          { title: "Usuarios" },
          { 
            title: user?.data.data ? `Detalles de ${user.data.data.nombres} ${user.data.data.apellidos}` : "Vista detalle",
            href: `/visitas-domiciliarias/usuarios/${userId}/detalles`
          },
          { title: "Editar Visita" },
        ]}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          Editar Visita Domiciliaria
        </Title>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`)}
        >
          Volver
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Formulario de edición */}
        <Card title="Datos de la Visita" extra={<EditOutlined />}>
          <Form layout="vertical" onFinish={methods.handleSubmit(handleSubmit)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Controller
                name="fecha_visita"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Fecha de Visita"
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <DatePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="YYYY-MM-DD"
                      placeholder="Seleccione la fecha"
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf('day');
                      }}
                    />
                  </Form.Item>
                )}
              />

              <Controller
                name="hora_visita"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Hora de Visita"
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <TimePicker
                      {...field}
                      style={{ width: "100%" }}
                      format="HH:mm"
                      placeholder="Seleccione la hora"
                      minuteStep={15}
                    />
                  </Form.Item>
                )}
              />
            </div>

            <Controller
              name="profesional_asignado"
              control={methods.control}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Profesional Asignado"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Select
                    {...field}
                    placeholder="Selecciona un profesional"
                    loading={loadingProfessionals}
                    showSearch
                    filterOption={(input, option) =>
                      !!option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={
                      professionals?.data?.data?.map((p) => ({
                        label: `${p.nombres} ${p.apellidos}`,
                        value: p.id_profesional,
                      })) ?? []
                    }
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="direccion_visita"
              control={methods.control}
              render={({ field, fieldState }) => (
                <Form.Item
                  label="Dirección de Visita"
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Input {...field} placeholder="Ingrese la dirección" />
                </Form.Item>
              )}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Controller
                name="telefono_visita"
                control={methods.control}
                render={({ field }) => (
                  <Form.Item label="Teléfono de Visita">
                    <Input {...field} placeholder="Ingrese el teléfono" />
                  </Form.Item>
                )}
              />

              <Controller
                name="valor_dia"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Valor por Día"
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      type="number"
                      prefix="$"
                      placeholder="25000"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </Form.Item>
                )}
              />
            </div>

            <Controller
              name="estado_visita"
              control={methods.control}
              render={({ field }) => (
                <Form.Item label="Estado de la Visita">
                  <Select
                    {...field}
                    options={[
                      { label: 'Pendiente', value: 'PENDIENTE' },
                      { label: 'Realizada', value: 'REALIZADA' },
                      { label: 'Cancelada', value: 'CANCELADA' },
                      { label: 'Reprogramada', value: 'REPROGRAMADA' },
                    ]}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="observaciones"
              control={methods.control}
              render={({ field }) => (
                <Form.Item label="Observaciones">
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="Ingrese observaciones adicionales sobre la visita"
                  />
                </Form.Item>
              )}
            />

            <Form.Item style={{ marginTop: '24px' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isLoading || updating}
                >
                  Guardar Cambios
                </Button>
                <Button onClick={() => navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`)}>
                  Cancelar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Información de facturación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Resumen de la visita */}
          <Card title="Resumen de la Visita" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Paciente">
                <strong>{`${user?.data.data.nombres} ${user?.data.data.apellidos}`}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Estado Actual">
                <Tag color={getEstadoColor(visita.data.data.estado_visita)}>
                  {getEstadoText(visita.data.data.estado_visita)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Profesional Asignado">
                {visita.data.data.profesional_asignado ? (
                  <Text strong>{`${visita.data.data.profesional_asignado.nombres} ${visita.data.data.profesional_asignado.apellidos}`}</Text>
                ) : (
                  <Text type="secondary">Sin asignar</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha Programada">
                {visita.data.data.fecha_visita ? dayjs(visita.data.data.fecha_visita).format('DD/MM/YYYY') : 'No programada'}
              </Descriptions.Item>
              <Descriptions.Item label="Hora Programada">
                {visita.data.data.hora_visita ? dayjs(`2000-01-01 ${visita.data.data.hora_visita}`).format('HH:mm') : 'No programada'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Información de facturación */}
          <Card 
            title={
              <Space>
                <DollarOutlined />
                <span>Información de Facturación</span>
              </Space>
            } 
            size="small"
            loading={loadingFactura}
          >
            {factura?.data?.data ? (
              <div>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Número de Factura">
                    <Text strong>{factura.data.data.numero_factura}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha de Emisión">
                    {dayjs(factura.data.data.fecha_emision).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha de Vencimiento">
                    {factura.data.data.fecha_vencimiento ? dayjs(factura.data.data.fecha_vencimiento).format('DD/MM/YYYY') : 'No definida'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Subtotal">
                    <Text strong>${factura.data.data.subtotal?.toLocaleString()}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Impuestos">
                    ${factura.data.data.impuestos?.toLocaleString() || '0'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Descuentos">
                    ${factura.data.data.descuentos?.toLocaleString() || '0'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total">
                    <Text strong style={{ color: '#1890ff' }}>
                      ${factura.data.data.total_factura?.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>

                {pagos?.data?.data && pagos.data.data.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <Divider orientation="left">
                      <Space>
                        <FileTextOutlined />
                        <span>Pagos Registrados</span>
                      </Space>
                    </Divider>
                    <Table
                      columns={pagosColumns}
                      dataSource={pagos.data.data}
                      pagination={false}
                      size="small"
                      loading={loadingPagos}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Alert
                  message="Sin factura asociada"
                  description="Esta visita domiciliaria no tiene una factura asociada. Se puede crear una factura desde el módulo de facturación."
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  style={{ marginBottom: '16px' }}
                />
                <Text type="secondary">
                  Para crear una factura para esta visita, diríjase al módulo de facturación y busque la opción para crear facturas por visita domiciliaria.
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}; 