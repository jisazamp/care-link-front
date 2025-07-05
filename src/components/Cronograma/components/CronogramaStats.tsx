import { useMemo } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { CronogramaAsistencia } from '../../../types';

interface CronogramaStatsProps {
  cronogramas: CronogramaAsistencia[];
}

export const CronogramaStats: React.FC<CronogramaStatsProps> = ({ cronogramas }) => {
  const stats = useMemo(() => {
    let totalPacientes = 0;
    let asistieron = 0;
    let noAsistieron = 0;
    let pendientes = 0;

    cronogramas.forEach(cronograma => {
      cronograma.pacientes.forEach(paciente => {
        totalPacientes++;
        switch (paciente.estado_asistencia) {
          case 'ASISTIO':
            asistieron++;
            break;
          case 'NO_ASISTIO':
            noAsistieron++;
            break;
          default:
            pendientes++;
            break;
        }
      });
    });

    return {
      totalPacientes,
      asistieron,
      noAsistieron,
      pendientes,
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