import { useState, useMemo, useEffect } from 'react';
import { Calendar, Card, Typography, Badge, Modal, Table, Button, Tag, Space, message, notification, Tooltip } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import { CalendarOutlined, UserOutlined, CarOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetCronogramasPorRango } from '../../hooks/useGetCronogramasPorRango';
import { useUpdateEstadoAsistencia } from '../../hooks/useUpdateEstadoAsistencia';
import { useReagendarPaciente } from '../../hooks/useReagendarPaciente';
import type { PacientePorFecha, EventoCalendario, CronogramaAsistencia, CronogramaAsistenciaPaciente } from '../../types';
import { CronogramaBreadcrumb } from './components/CronogramaBreadcrumb';
import { CronogramaStats } from './components/CronogramaStats';
import { JustificacionModal } from './components/JustificacionModal';

const { Title, Text } = Typography;

export const Cronograma: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPacientes, setSelectedPacientes] = useState<PacientePorFecha[]>([]);
  const [justificacionModalVisible, setJustificacionModalVisible] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<CronogramaAsistenciaPaciente | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [botonCargando, setBotonCargando] = useState<null | number | string>(null);
  const [highlightedPatientId, setHighlightedPatientId] = useState<number | null>(null);
  
  // 🔴 NUEVO: Estado para el mes seleccionado en el calendario
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  // 🔴 NUEVO: Obtener cronogramas del mes seleccionado (no siempre el actual)
  const startOfMonth = selectedMonth.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = selectedMonth.endOf('month').format('YYYY-MM-DD');

  const { data: cronogramas, isLoading, refetch } = useGetCronogramasPorRango(startOfMonth, endOfMonth);
  const { mutate: updateEstado } = useUpdateEstadoAsistencia();
  const { mutate: reagendarPaciente } = useReagendarPaciente();

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

  // 🔴 NUEVO: Recargar datos cuando cambie el mes seleccionado
  useEffect(() => {
    console.log('📅 Mes seleccionado cambiado:', selectedMonth.format('YYYY-MM'));
    console.log(' Rango de fechas:', startOfMonth, 'a', endOfMonth);
    refetch();
  }, [selectedMonth, startOfMonth, endOfMonth, refetch]);

  // 🔴 NUEVO: Manejar parámetros de URL para resaltar paciente y abrir modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightPatientId = searchParams.get('highlightPatient');
    const shouldOpenModal = searchParams.get('openModal') === 'true';

    if (highlightPatientId && shouldOpenModal && cronogramas?.data?.data) {
      const patientId = parseInt(highlightPatientId);
      
      // Buscar el paciente en todos los cronogramas
      let foundPatient: CronogramaAsistenciaPaciente | null = null;
      let foundDate: string | null = null;
      
      for (const cronograma of cronogramas.data.data) {
        const paciente = cronograma.pacientes.find(p => p.id_cronograma_paciente === patientId);
        if (paciente) {
          foundPatient = paciente;
          foundDate = cronograma.fecha;
          break;
        }
      }

      if (foundPatient && foundDate) {
        // Establecer la fecha encontrada
        const targetDate = dayjs(foundDate);
        setSelectedMonth(targetDate);
        
        // Abrir el modal con los pacientes de esa fecha
        const pacientes = eventosPorFecha[foundDate] || [];
        if (pacientes.length > 0) {
          setSelectedPacientes(pacientes.map(e => e.paciente as unknown as PacientePorFecha));
          setSelectedDate(targetDate);
          setIsModalVisible(true);
          
          // Resaltar el paciente por 2 segundos
          setHighlightedPatientId(patientId);
          setTimeout(() => {
            setHighlightedPatientId(null);
          }, 2000);
        }
        
        // Limpiar los parámetros de URL
        navigate('/cronograma', { replace: true });
      }
    }
  }, [cronogramas?.data?.data, location.search, navigate, eventosPorFecha]);

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

  // 🔴 NUEVA FUNCIÓN: Manejar cambio de mes en el calendario
  const handleMonthChange = (date: Dayjs, mode: 'month' | 'year') => {
    console.log(' Cambio de mes detectado:', date.format('YYYY-MM'), 'Modo:', mode);
    setSelectedMonth(date);
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
    
    reagendarPaciente({
      id_cronograma_paciente: selectedPaciente.id_cronograma_paciente,
      data: {
        estado_asistencia: 'PENDIENTE',
        observaciones: observaciones,
        nueva_fecha: nuevaFecha
      }
    }, {
      onSuccess: () => {
        // const nuevoPaciente = response.data.data; // No se usa actualmente
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
      onError: (error: any) => {
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
          {record.requiere_transporte && (
            <Tooltip title="Requiere transporte">
              <CarOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
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
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              📅 Mostrando cronogramas de: <strong>{selectedMonth.format('MMMM YYYY')}</strong>
            </Text>
          </div>
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
            onPanelChange={handleMonthChange}
            disabledDate={disabledDate}
            value={selectedMonth}
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
            rowClassName={(record) => {
              return record.id_cronograma_paciente === highlightedPatientId 
                ? 'highlighted-patient-row' 
                : '';
            }}
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