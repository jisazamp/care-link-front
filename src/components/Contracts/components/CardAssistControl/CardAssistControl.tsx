import { Button, Card, Checkbox, Table, Typography, Space, Tooltip, Modal, Form, Input, Select, message, Spin, Empty, Tag, notification, DatePicker } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDailyAttendance } from "../../../../hooks/useGetDailyAttendance/useGetDailyAttendance";
import type { AsistenciaDiaria } from "../../../../types";
import { useUpdateAttendanceStatus } from "../../../../hooks/useUpdateAttendanceStatus/useUpdateAttendanceStatus";
import { useUpdateEstadoAsistencia } from "../../../../hooks/useUpdateEstadoAsistencia";
import { useReagendarPaciente } from "../../../../hooks/useReagendarPaciente";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const CardAsistControl = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<AsistenciaDiaria | null>(null);
  const [justificacionModalVisible, setJustificacionModalVisible] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [botonCargando, setBotonCargando] = useState<null | number | string>(null);
  const [observaciones, setObservaciones] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState<dayjs.Dayjs | null>(null);
  const [form] = Form.useForm();

  // Obtener datos de asistencia del día actual
  const { data: attendanceData, isLoading, error, refetch } = useGetDailyAttendance();
  const updateAttendanceStatus = useUpdateAttendanceStatus();
  const { mutate: updateEstado } = useUpdateEstadoAsistencia();
  const { mutate: reagendarPaciente } = useReagendarPaciente();

  // Manejar selección de filas
  const handleRowSelection = (selectedRowKeys: React.Key[]) => {
    setSelectedRows(selectedRowKeys as number[]);
  };

  // Manejar cambio de estado de asistencia (nuevo método similar al cronograma)
  const handleEstadoChange = (pacienteId: number, nuevoEstado: string) => {
    // Validación: Solo se puede cambiar estado de registros "PENDIENTE"
    const paciente = attendanceData?.data.data?.find(p => p.id_cronograma_paciente === pacienteId);
    if (paciente && paciente.estado_asistencia !== 'PENDIENTE') {
      message.error(`No se puede cambiar el estado de un paciente con estado "${paciente.estado_asistencia}". Solo se puede modificar registros con estado "PENDIENTE".`);
      return;
    }

    setBotonCargando(`${pacienteId}-${nuevoEstado}`);
    if (nuevoEstado === 'NO_ASISTIO') {
      // Abrir modal de justificación para "No asistió"
      if (paciente) {
        setSelectedPatient(paciente);
        setJustificacionModalVisible(true);
        setBotonCargando(null);
        // Resetear campos del modal
        setObservaciones('');
        setNuevaFecha(null);
      }
    } else {
      // Para otros estados, actualizar directamente
      updateEstado({
        id_cronograma_paciente: pacienteId,
        data: {
          estado_asistencia: nuevoEstado as 'PENDIENTE' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO',
        }
      }, {
        onSuccess: () => {
          setLoadingAction(false);
          setBotonCargando(null);
          setJustificacionModalVisible(false);
          setSelectedPatient(null);
          refetch();
        },
        onError: () => {
          setLoadingAction(false);
          setBotonCargando(null);
        }
      });
    }
  };

  // Manejar confirmación de justificación
  const handleJustificacionConfirm = (estado: string, observaciones: string) => {
    if (!selectedPatient) return;
    setLoadingAction(true);
    updateEstado({
      id_cronograma_paciente: selectedPatient.id_cronograma_paciente,
      data: {
        estado_asistencia: estado as 'PENDIENTE' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO',
        observaciones: observaciones
      }
    }, {
      onSuccess: () => {
        setLoadingAction(false);
        setBotonCargando(null);
        setJustificacionModalVisible(false);
        setSelectedPatient(null);
        // Unificar mensaje para reagendamiento
        if (estado === 'REAGENDADO') {
          notification.success({
            message: 'Paciente reagendado exitosamente',
            description: 'El paciente fue reagendado con justificación. El día NO se descuenta de la tiquetera.',
          });
        }
        refetch();
      },
      onError: () => {
        setLoadingAction(false);
        setBotonCargando(null);
      }
    });
  };

  // Manejar reagendamiento
  const handleReagendar = (observaciones: string, nuevaFecha: string) => {
    if (!selectedPatient) {
      console.error('No hay paciente seleccionado');
      return;
    }
    if (selectedPatient.estado_asistencia !== 'PENDIENTE') {
      message.error(`No se puede reagendar un paciente con estado "${selectedPatient.estado_asistencia}". Solo se puede reagendar pacientes con estado "PENDIENTE".`);
      return;
    }
    setLoadingAction(true);
    
    reagendarPaciente({
      id_cronograma_paciente: selectedPatient.id_cronograma_paciente,
      data: {
        estado_asistencia: 'PENDIENTE',
        observaciones: observaciones,
        nueva_fecha: nuevaFecha
      }
    }, {
      onSuccess: () => {
        setJustificacionModalVisible(false);
        setSelectedPatient(null);
        setLoadingAction(false);
        setObservaciones('');
        setNuevaFecha(null);
        notification.success({
          message: 'Paciente reagendado exitosamente',
          description: 'El paciente fue reagendado con justificación. El día NO se descuenta de la tiquetera.',
        });
        refetch();
      },
      onError: (error: any) => {
        console.error('Error en reagendamiento:', error);
        message.error('Error al reagendar el paciente');
        setLoadingAction(false);
      }
    });
  };

  // Método legacy para compatibilidad (mantener por si acaso)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStatusChange = (record: AsistenciaDiaria, newStatus: string) => {
    setSelectedPatient(record);
    form.setFieldsValue({
      estado_asistencia: newStatus,
      observaciones: record.observaciones || ""
    });
    setIsModalVisible(true);
  };

  // Manejar envío del formulario (método legacy)
  const handleFormSubmit = async (values: any) => {
    if (!selectedPatient) return;

    try {
      await updateAttendanceStatus.mutateAsync({
        id_cronograma_paciente: selectedPatient.id_cronograma_paciente,
        data: {
          estado_asistencia: values.estado_asistencia,
          observaciones: values.observaciones
        }
      });
      
      setIsModalVisible(false);
      setSelectedPatient(null);
      form.resetFields();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  // Funciones auxiliares para el modal de justificación
  const handleObservacionesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservaciones(e.target.value);
  };

  const handleReagendarClick = () => {
    if (!observaciones.trim()) {
      message.error('Debe ingresar una justificación');
      return;
    }
    if (!nuevaFecha) {
      message.error('Debe seleccionar una nueva fecha para reagendar');
      return;
    }
    handleReagendar(observaciones, nuevaFecha.format('YYYY-MM-DD'));
  };

  const handleNoAsistioClick = () => {
    handleJustificacionConfirm('NO_ASISTIO', observaciones);
  };

  const handleCancelModal = () => {
    setJustificacionModalVisible(false);
    setSelectedPatient(null);
    setObservaciones('');
    setNuevaFecha(null);
  };

  // Validaciones para el modal
  const canReagendar = selectedPatient?.estado_asistencia === 'PENDIENTE' && 
                      observaciones.trim().length > 0 && 
                      nuevaFecha !== null;
  
  const showFecha = observaciones.trim().length > 0;
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  // Columnas de la tabla
  const columnsAttendance = [
    {
      title: <Checkbox 
        checked={selectedRows.length > 0 && selectedRows.length === (attendanceData?.data.data?.length || 0)}
        indeterminate={selectedRows.length > 0 && selectedRows.length < (attendanceData?.data.data?.length || 0)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows(attendanceData?.data.data?.map(p => p.id_cronograma_paciente) || []);
          } else {
            setSelectedRows([]);
          }
        }}
      />,
      dataIndex: "checkbox",
      key: "checkbox",
      width: 50,
      render: (_: any, record: AsistenciaDiaria) => (
        <Checkbox 
          checked={selectedRows.includes(record.id_cronograma_paciente)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, record.id_cronograma_paciente]);
            } else {
              setSelectedRows(selectedRows.filter(id => id !== record.id_cronograma_paciente));
            }
          }}
        />
      ),
    },
    { 
      title: "Usuario", 
      dataIndex: "nombres", 
      key: "user",
      render: (_: any, record: AsistenciaDiaria) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.nombres} {record.apellidos}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.id_usuario}
          </Text>
        </div>
      )
    },
    { 
      title: "Tipo de servicio", 
      dataIndex: "tipo_servicio", 
      key: "serviceType",
      render: (tipo_servicio: string) => (
        <Tag color="blue">{tipo_servicio}</Tag>
      )
    },
    {
      title: "Estado",
      dataIndex: "estado_asistencia",
      key: "status",
      render: (_: string, record: AsistenciaDiaria) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              backgroundColor: record.color_estado,
              borderRadius: "50%",
              width: 10,
              height: 10,
              flexShrink: 0
            }}
          />
          <span>{record.estado_texto}</span>
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 300,
      render: (_: any, record: AsistenciaDiaria) => {
        const isPending = record.estado_asistencia === 'PENDIENTE';
        const isDisabled = !isPending || (botonCargando !== null);
        return (
          <Space>
            <Tooltip title="Ver en cronograma y resaltar paciente">
              <Button 
                type="link" 
                size="small"
                onClick={() => {
                  // Navegar al cronograma con parámetros para abrir el modal y resaltar el paciente
                  navigate(`/cronograma?highlightPatient=${record.id_cronograma_paciente}&openModal=true`);
                }}
              >
                Ver
              </Button>
            </Tooltip>
            <Button
              size="small"
              type="primary"
              onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'ASISTIO')}
              disabled={isDisabled}
              loading={botonCargando === `${record.id_cronograma_paciente}-ASISTIO`}
              title={!isPending ? 'Solo se pueden modificar registros con estado "PENDIENTE"' : ''}
            >
              Asistió
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'NO_ASISTIO')}
              disabled={isDisabled}
              loading={botonCargando === `${record.id_cronograma_paciente}-NO_ASISTIO`}
              title={!isPending ? 'Solo se pueden modificar registros con estado "PENDIENTE"' : ''}
            >
              No Asistió
            </Button>
            <Button
              size="small"
              onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'CANCELADO')}
              disabled={isDisabled}
              loading={botonCargando === `${record.id_cronograma_paciente}-CANCELADO`}
              title={!isPending ? 'Solo se pueden modificar registros con estado "PENDIENTE"' : ''}
            >
              Cancelar
            </Button>
          </Space>
        );
      },
    },
  ];

  // Manejar clic en "Agregar"
  const handleAddClick = () => {
    navigate("/cronograma");
  };

  if (error) {
    return (
      <Card title={<Title level={5}>Control de asistencia del día</Title>}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="danger">Error al cargar los datos de asistencia</Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={<Title level={5}>Control de asistencia del día</Title>}
        extra={
          <Space>
            {selectedRows.length > 0 && (
              <Text type="secondary">
                {selectedRows.length} seleccionado{selectedRows.length !== 1 ? 's' : ''}
              </Text>
            )}
            <Button type="primary" onClick={handleAddClick}>
              Agregar
            </Button>
          </Space>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Cargando asistencia del día...</Text>
            </div>
          </div>
        ) : attendanceData?.data.data && attendanceData.data.data.length > 0 ? (
          <Table
            rowKey="id_cronograma_paciente"
            dataSource={attendanceData.data.data}
            columns={columnsAttendance}
            pagination={false}
            rowSelection={{
              selectedRowKeys: selectedRows,
              onChange: handleRowSelection,
            }}
            scroll={{ x: 800 }}
          />
        ) : (
          <Empty
            description="No hay pacientes agendados para hoy"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleAddClick}>
              Agregar pacientes al cronograma
            </Button>
          </Empty>
        )}
      </Card>

      {/* Modal para actualizar estado de asistencia */}
      <Modal
        title="Actualizar Estado de Asistencia"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedPatient(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Paciente"
          >
            <Text strong>
              {selectedPatient ? `${selectedPatient.nombres} ${selectedPatient.apellidos}` : ''}
            </Text>
          </Form.Item>

          <Form.Item
            name="estado_asistencia"
            label="Estado de Asistencia"
            rules={[{ required: true, message: 'Seleccione un estado' }]}
          >
            <Select>
              <Option value="ASISTIO">Asistió</Option>
              <Option value="NO_ASISTIO">No asistió</Option>
              <Option value="CANCELADO">Cancelado</Option>
              <Option value="REAGENDADO">Reagendado</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="observaciones"
            label="Observaciones"
          >
            <TextArea rows={3} placeholder="Observaciones adicionales..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={updateAttendanceStatus.isPending}
              >
                Actualizar
              </Button>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  setSelectedPatient(null);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Justificación (similar al del cronograma) */}
      <Modal
        title={
          <Space>
            <span style={{ color: '#faad14' }}>⚠️</span>
            <span>Justificación de Inasistencia</span>
          </Space>
        }
        open={justificacionModalVisible}
        onCancel={handleCancelModal}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>Paciente:</strong> {selectedPatient?.nombres} {selectedPatient?.apellidos}
          </p>
          <p>
            <strong>Estado actual:</strong> {selectedPatient?.estado_asistencia}
          </p>
        </div>

        {/* Alerta si el paciente no tiene estado PENDIENTE */}
        {selectedPatient && selectedPatient.estado_asistencia !== 'PENDIENTE' && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fff7e6', 
            border: '1px solid #ffd591', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <p style={{ margin: 0, color: '#d46b08' }}>
              <strong>⚠️ No se puede reagendar:</strong> Solo se puede reagendar pacientes con estado "PENDIENTE". 
              El estado actual es "{selectedPatient.estado_asistencia}".
            </p>
          </div>
        )}

        <Form layout="vertical">
          <Form.Item
            label="Observaciones / Justificación"
            name="observaciones"
          >
            <Input.TextArea
              rows={4}
              placeholder="Describa el motivo por el cual el paciente no asistió..."
              value={observaciones}
              onChange={handleObservacionesChange}
            />
          </Form.Item>
          
          {showFecha && (
            <Form.Item
              label="Nueva fecha"
              name="nueva_fecha"
              rules={[
                { required: true, message: 'Debe seleccionar una nueva fecha' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Seleccione la nueva fecha"
                value={nuevaFecha}
                onChange={setNuevaFecha}
                disabledDate={disabledDate}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          )}
          
          <div style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                danger
                onClick={handleNoAsistioClick}
                style={{ width: '100%' }}
                loading={loadingAction}
                disabled={selectedPatient?.estado_asistencia !== 'PENDIENTE'}
              >
                Marcar como "No Asistió"
              </Button>
              <Button
                type="primary"
                onClick={handleReagendarClick}
                disabled={!canReagendar}
                style={{ width: '100%' }}
                loading={loadingAction}
              >
                Reagendar Cita
              </Button>
              <Button
                onClick={handleCancelModal}
                style={{ width: '100%' }}
              >
                Cancelar
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </>
  );
};
