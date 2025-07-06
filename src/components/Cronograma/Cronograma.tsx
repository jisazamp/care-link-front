import { useState, useMemo } from 'react';
import { Calendar, Card, Typography, Badge, Modal, Table, Button, Tag, Space, message, notification } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useGetCronogramasPorRango } from '../../hooks/useGetCronogramasPorRango';
import { useUpdateEstadoAsistencia } from '../../hooks/useUpdateEstadoAsistencia';
import { useReagendarPaciente } from '../../hooks/useReagendarPaciente';
import type { PacientePorFecha, EventoCalendario, CronogramaAsistencia, CronogramaAsistenciaPaciente } from '../../types';
import { CronogramaBreadcrumb } from './components/CronogramaBreadcrumb';
import { CronogramaStats } from './components/CronogramaStats';
import { JustificacionModal } from './components/JustificacionModal';

const { Title, Text } = Typography;

export const Cronograma: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPacientes, setSelectedPacientes] = useState<PacientePorFecha[]>([]);
  const [justificacionModalVisible, setJustificacionModalVisible] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<CronogramaAsistenciaPaciente | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [botonCargando, setBotonCargando] = useState<null | number | string>(null);

  // Obtener cronogramas del mes actual
  const currentMonth = dayjs();
  const startOfMonth = currentMonth.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = currentMonth.endOf('month').format('YYYY-MM-DD');

  const { data: cronogramas, isLoading, refetch } = useGetCronogramasPorRango(startOfMonth, endOfMonth);
  const { mutate: updateEstado, isPending: updateLoading } = useUpdateEstadoAsistencia();
  const { mutate: reagendarPaciente, isPending: reagendarLoading } = useReagendarPaciente();

  const getEstadoBadgeType = (estado: string): BadgeProps['status'] => {
    switch (estado) {
      case 'ASISTIO':
        return 'success';
      case 'NO_ASISTIO':
        return 'error';
      case 'CANCELADO':
        return 'default';
      default:
        return 'processing';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ASISTIO':
        return 'green';
      case 'NO_ASISTIO':
        return 'red';
      case 'CANCELADO':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Crear mapa de eventos por fecha
  const eventosPorFecha = useMemo(() => {
    const eventos: Record<string, EventoCalendario[]> = {};
    
    if (cronogramas?.data?.data) {
      cronogramas.data.data.forEach((cronograma: CronogramaAsistencia) => {
        const fecha = cronograma.fecha;
        if (!eventos[fecha]) {
          eventos[fecha] = [];
        }
        
        cronograma.pacientes.forEach((paciente: CronogramaAsistenciaPaciente) => {
          const tipo = getEstadoBadgeType(paciente.estado_asistencia) || 'processing';
          eventos[fecha].push({
            type: tipo,
            content: `${paciente.nombres || 'Paciente'} ${paciente.apellidos || ''}`,
            paciente: paciente as any,
          });
        });
      });
    }
    
    return eventos;
  }, [cronogramas]);

  const handleDateSelect = (date: Dayjs) => {
    const fecha = date.format('YYYY-MM-DD');
    const pacientes = eventosPorFecha[fecha] || [];
    
    if (pacientes.length > 0) {
      setSelectedPacientes(pacientes.map(e => e.paciente as unknown as PacientePorFecha));
      setSelectedDate(date);
      setIsModalVisible(true);
    } else {
      message.info('No hay pacientes agendados para esta fecha');
    }
  };

  const handleEstadoChange = (pacienteId: number, nuevoEstado: string) => {
    // 🔴 VALIDACIÓN: Solo se puede cambiar estado de registros "PENDIENTE"
    const paciente = selectedPacientes.find(p => p.id_cronograma_paciente === pacienteId);
    if (paciente && paciente.estado_asistencia !== 'PENDIENTE') {
      message.error(`No se puede cambiar el estado de un paciente con estado "${paciente.estado_asistencia}". Solo se puede modificar registros con estado "PENDIENTE".`);
      return;
    }

    setBotonCargando(`${pacienteId}-${nuevoEstado}`);
    if (nuevoEstado === 'NO_ASISTIO') {
      // Abrir modal de justificación para "No asistió"
      if (paciente) {
        setSelectedPaciente(paciente as CronogramaAsistenciaPaciente);
        setJustificacionModalVisible(true);
        setBotonCargando(null);
      }
    } else {
      // Para otros estados, actualizar directamente
      updateEstado({
        id_cronograma_paciente: pacienteId,
        data: {
          estado_asistencia: nuevoEstado as 'PENDIENTE' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO',
        }
      }, {
        onSuccess: (response) => {
          const updatedPaciente = response.data.data;
          setSelectedPacientes((prev) =>
            prev.map((p) =>
              p.id_cronograma_paciente === updatedPaciente.id_cronograma_paciente
                ? { ...p, ...updatedPaciente }
                : p
            )
          );
          setSelectedPaciente((prev) =>
            prev && prev.id_cronograma_paciente === updatedPaciente.id_cronograma_paciente
              ? { ...prev, ...updatedPaciente }
              : prev
          );
          setLoadingAction(false);
          setBotonCargando(null);
          setJustificacionModalVisible(false);
          setSelectedPaciente(null);
          refetch();
        },
        onError: () => {
          setLoadingAction(false);
          setBotonCargando(null);
        }
      });
    }
  };

  const handleJustificacionConfirm = (estado: string, observaciones: string) => {
    if (!selectedPaciente) return;
    setLoadingAction(true);
    updateEstado({
      id_cronograma_paciente: selectedPaciente.id_cronograma_paciente,
      data: {
        estado_asistencia: estado as 'PENDIENTE' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO',
        observaciones: observaciones
      }
    }, {
      onSuccess: (response) => {
        const updatedPaciente = response.data.data;
        setSelectedPacientes((prev) =>
          prev.map((p) =>
            p.id_cronograma_paciente === updatedPaciente.id_cronograma_paciente
              ? { ...p, ...updatedPaciente }
              : p
          )
        );
        setSelectedPaciente((prev) =>
          prev && prev.id_cronograma_paciente === updatedPaciente.id_cronograma_paciente
            ? { ...prev, ...updatedPaciente }
            : prev
        );
        setLoadingAction(false);
        setBotonCargando(null);
        setJustificacionModalVisible(false);
        setSelectedPaciente(null);
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

  const handleReagendar = (observaciones: string, nuevaFecha: string) => {
    if (!selectedPaciente) {
      console.error('No hay paciente seleccionado');
      return;
    }
    if (selectedPaciente.estado_asistencia !== 'PENDIENTE') {
      message.error(`No se puede reagendar un paciente con estado "${selectedPaciente.estado_asistencia}". Solo se puede reagendar pacientes con estado "PENDIENTE".`);
      return;
    }
    setLoadingAction(true);
    const requestData = {
      id_cronograma_paciente: selectedPaciente.id_cronograma_paciente,
      data: {
        estado_asistencia: 'PENDIENTE' as const,
        observaciones: observaciones,
        nueva_fecha: nuevaFecha
      }
    };
    reagendarPaciente(requestData, {
      onSuccess: (response) => {
        const nuevoPaciente = response.data.data;
        setSelectedPacientes((prev) =>
          prev.map((p) =>
            p.id_cronograma_paciente === selectedPaciente.id_cronograma_paciente
              ? { ...p, estado_asistencia: 'REAGENDADO' as any, observaciones }
              : p
          )
        );
        setSelectedPaciente((prev) =>
          prev && prev.id_cronograma_paciente === selectedPaciente.id_cronograma_paciente
            ? { ...prev, estado_asistencia: 'REAGENDADO' as any, observaciones }
            : prev
        );
        setJustificacionModalVisible(false);
        setSelectedPaciente(null);
        setLoadingAction(false);
        notification.success({
          message: 'Paciente reagendado exitosamente',
          description: 'El paciente fue reagendado con justificación. El día NO se descuenta de la tiquetera.',
        });
        refetch();
      },
      onError: (error) => {
        console.error('Error en reagendamiento:', error);
        message.error('Error al reagendar el paciente');
        setLoadingAction(false);
      }
    });
  };

  const dateCellRender = (value: Dayjs) => {
    const fecha = value.format('YYYY-MM-DD');
    const listData = eventosPorFecha[fecha] || [];
    
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index} style={{ marginBottom: 2 }}>
            <Badge 
              status={item.type as BadgeProps['status']} 
              text={
                <Text 
                  style={{ 
                    fontSize: '10px', 
                    color: '#666',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80px'
                  }}
                >
                  {item.content}
                </Text>
              } 
            />
          </li>
        ))}
      </ul>
    );
  };

  // Función para deshabilitar sábados y domingos
  const disabledDate = (date: Dayjs) => {
    const day = date.day(); // 0: domingo, 6: sábado
    return day === 0 || day === 6;
  };

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'nombres',
      key: 'nombres',
      render: (_: any, record: PacientePorFecha) => (
        <Space>
          <UserOutlined />
          <Text>{`${record.nombres} ${record.apellidos}`}</Text>
        </Space>
      ),
    },
    {
      title: 'Documento',
      dataIndex: 'n_documento',
      key: 'n_documento',
    },
    {
      title: 'Estado',
      dataIndex: 'estado_asistencia',
      key: 'estado_asistencia',
      render: (estado: string) => (
        <Tag color={getEstadoColor(estado)}>
          {estado.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record: PacientePorFecha) => {
        const isPending = record.estado_asistencia === 'PENDIENTE';
        const isDisabled = !isPending || (botonCargando !== null);
        return (
          <Space>
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

  return (
    <div className="cronograma-container">
      <CronogramaBreadcrumb />
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>
            <CalendarOutlined style={{ marginRight: '8px' }} />
            Cronograma de Asistencia
          </Title>
          <Text type="secondary">
            Gestiona la asistencia de pacientes en cada fecha del calendario
          </Text>
        </div>

        {cronogramas?.data?.data && <CronogramaStats cronogramas={cronogramas.data.data} />}

        <div style={{ 
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          padding: '16px'
        }}>
          {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Cargando cronograma...</div>}
          <Calendar
            cellRender={dateCellRender as CalendarProps<Dayjs>['cellRender']}
            onSelect={(date, info) => {
              // 🔴 SOLO abrir modal si el usuario hizo click en el día
              if (info.source === 'date') {
                handleDateSelect(date);
              }
              // Si el source es "month" o "year", NO hacer nada
            }}
            disabledDate={disabledDate}
          />
        </div>

        <Modal
          title={
            <Space>
              <CalendarOutlined />
              Pacientes Agendados - {selectedDate?.format('DD/MM/YYYY')}
            </Space>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <Table
            columns={columns}
            dataSource={selectedPacientes}
            rowKey="id_cronograma_paciente"
            pagination={false}
            size="small"
          />
        </Modal>

        <JustificacionModal
          visible={justificacionModalVisible}
          paciente={selectedPaciente}
          onCancel={() => {
            setJustificacionModalVisible(false);
            setSelectedPaciente(null);
          }}
          onConfirm={handleJustificacionConfirm}
          onReagendar={handleReagendar}
          loading={loadingAction}
        />
      </Card>
    </div>
  );
}; 