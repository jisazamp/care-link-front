import React from 'react';
import { Row, Col, Statistic, Progress } from 'antd';
import { 
  DollarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

interface BillingStatsProps {
  stats: {
    total: number;
    pendientes: number;
    pagadas: number;
    vencidas: number;
    totalValor: number;
    valorPendiente: number;
  };
}

export const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  const porcentajePagadas = stats.total > 0 ? Math.round((stats.pagadas / stats.total) * 100) : 0;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Total Facturas"
          value={stats.total}
          prefix={<FileTextOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Pendientes"
          value={stats.pendientes}
          prefix={<ClockCircleOutlined />}
          valueStyle={{ color: '#faad14' }}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Pagadas"
          value={stats.pagadas}
          prefix={<CheckCircleOutlined />}
          valueStyle={{ color: '#52c41a' }}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Vencidas"
          value={stats.vencidas}
          prefix={<CloseCircleOutlined />}
          valueStyle={{ color: '#ff4d4f' }}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Valor Total"
          value={stats.totalValor}
          prefix={<DollarOutlined />}
          valueStyle={{ color: '#722ed1' }}
          formatter={(value) => `$${value?.toLocaleString()}`}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <Statistic
          title="Valor Pendiente"
          value={stats.valorPendiente}
          prefix={<DollarOutlined />}
          valueStyle={{ color: '#fa8c16' }}
          formatter={(value) => `$${value?.toLocaleString()}`}
        />
      </Col>
      <Col span={24}>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Progreso de Facturas Pagadas</span>
            <span>{porcentajePagadas}%</span>
          </div>
          <Progress 
            percent={porcentajePagadas} 
            status={porcentajePagadas === 100 ? 'success' : 'active'}
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