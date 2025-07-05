import { useMemo } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { CronogramaAsistencia } from '../../../types';

interface CronogramaStatsProps {
  cronogramas: CronogramaAsistencia[];
}

export const CronogramaStats: React.FC<CronogramaStatsProps> = ({ cronogramas }) => {
  const stats = useMemo(() => {
    // Set para almacenar IDs únicos de pacientes
    const pacientesUnicos = new Set<number>();
    const pacientesAsistieron = new Set<number>();
    const pacientesNoAsistieron = new Set<number>();
    const pacientesPendientes = new Set<number>();

    cronogramas.forEach(cronograma => {
      cronograma.pacientes.forEach(paciente => {
        // Agregar paciente al set de pacientes únicos
        pacientesUnicos.add(paciente.id_usuario);
        
        switch (paciente.estado_asistencia) {
          case 'ASISTIO':
            pacientesAsistieron.add(paciente.id_usuario);
            break;
          case 'NO_ASISTIO':
            pacientesNoAsistieron.add(paciente.id_usuario);
            break;
          default:
            pacientesPendientes.add(paciente.id_usuario);
            break;
        }
      });
    });

    return {
      totalPacientes: pacientesUnicos.size,
      asistieron: pacientesAsistieron.size,
      noAsistieron: pacientesNoAsistieron.size,
      pendientes: pacientesPendientes.size,
    };
  }, [cronogramas]);

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Pacientes"
            value={stats.totalPacientes}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Asistieron"
            value={stats.asistieron}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="No Asistieron"
            value={stats.noAsistieron}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Pendientes"
            value={stats.pendientes}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );
}; 