import React from 'react';
import { Row, Col, Statistic, Progress } from 'antd';
import { 
  CarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

interface TransporteStatsProps {
  stats: {
    total: number;
    pendientes: number;
    realizados: number;
    cancelados: number;
    porcentaje: number;
  };
}

export const TransporteStats: React.FC<TransporteStatsProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Statistic
          title="Total de Rutas"
          value={stats.total}
          prefix={<CarOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Statistic
          title="Pendientes"
          value={stats.pendientes}
          prefix={<ClockCircleOutlined />}
          valueStyle={{ color: '#faad14' }}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Statistic
          title="Realizados"
          value={stats.realizados}
          prefix={<CheckCircleOutlined />}
          valueStyle={{ color: '#52c41a' }}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Statistic
          title="Cancelados"
          value={stats.cancelados}
          prefix={<CloseCircleOutlined />}
          valueStyle={{ color: '#ff4d4f' }}
        />
      </Col>
      <Col span={24}>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Progreso de Completado</span>
            <span>{stats.porcentaje}%</span>
          </div>
          <Progress 
            percent={stats.porcentaje} 
            status={stats.porcentaje === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>
      </Col>
    </Row>
  );
}; 