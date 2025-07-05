import { useState, useMemo } from 'react';
import { Calendar, Card, Typography, Badge, Modal, Table, Button, Tag, Space, message } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useGetCronogramasPorRango } from '../../hooks/useGetCronogramasPorRango';
import { useUpdateEstadoAsistencia } from '../../hooks/useUpdateEstadoAsistencia';
import { useReagendarPaciente } from '../../hooks/useReagendarPaciente';
import type { PacientePorFecha, EventoCalendario, CronogramaAsistencia, CronogramaAsistenciaPaciente } from '../../types';
import { CronogramaBreadcrumb } from './components/CronogramaBreadcrumb';
import { CronogramaStats } from './components/CronogramaStats';

const { Title, Text } = Typography;

export const Cronograma: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPacientes, setSelectedPacientes] = useState<PacientePorFecha[]>([]);

  // Obtener cronogramas del mes actual
  const currentMonth = dayjs();
  const startOfMonth = currentMonth.startOf('month').format('YYYY-MM-DD');
  const endOfMonth = currentMonth.endOf('month').format('YYYY-MM-DD');

  const { data: cronogramas, isLoading } = useGetCronogramasPorRango(startOfMonth, endOfMonth);
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
    updateEstado({
      id_cronograma_paciente: pacienteId,
      estado_asistencia: nuevoEstado as 'PENDIENTE' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO',
    });
  };

  const handleReagendar = (pacienteId: number, nuevaFecha: string) => {
    reagendarPaciente({
      id_cronograma_paciente: pacienteId,
      nueva_fecha: nuevaFecha,
    });
    setIsModalVisible(false);
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
      render: (record: PacientePorFecha) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'ASISTIO')}
            disabled={record.estado_asistencia === 'ASISTIO'}
          >
            Asistió
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'NO_ASISTIO')}
            disabled={record.estado_asistencia === 'NO_ASISTIO'}
          >
            No Asistió
          </Button>
          <Button
            size="small"
            onClick={() => handleEstadoChange(record.id_cronograma_paciente, 'CANCELADO')}
            disabled={record.estado_asistencia === 'CANCELADO'}
          >
            Cancelar
          </Button>
        </Space>
      ),
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
            onSelect={handleDateSelect}
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
      </Card>
    </div>
  );
}; 