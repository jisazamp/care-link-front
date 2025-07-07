import React from 'react';
import { Row, Col, DatePicker, Select, Input, Button, Space } from 'antd';
import { FilterOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BillingFiltersProps {
  selectedDateRange: [Dayjs, Dayjs] | null;
  onDateRangeChange: (dates: [Dayjs, Dayjs] | null) => void;
  filters: {
    estado: string;
    contrato: string;
  };
  onFiltersChange: (filters: { estado: string; contrato: string }) => void;
}

export const BillingFilters: React.FC<BillingFiltersProps> = ({
  selectedDateRange,
  onDateRangeChange,
  filters,
  onFiltersChange,
}) => {
  const handleReset = () => {
    onDateRangeChange(null);
    onFiltersChange({ estado: '', contrato: '' });
  };

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={6}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <CalendarOutlined />
          <span style={{ fontWeight: 500 }}>Rango de Fechas</span>
        </div>
        <RangePicker
          value={selectedDateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              onDateRangeChange([dates[0], dates[1]]);
            } else {
              onDateRangeChange(null);
            }
          }}
          format="DD/MM/YYYY"
          style={{ width: '100%' }}
          placeholder={['Fecha inicio', 'Fecha fin']}
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <div style={{ marginBottom: '4px', fontWeight: 500 }}>
          Estado
        </div>
        <Select
          style={{ width: '100%' }}
          value={filters.estado}
          onChange={(value) => onFiltersChange({ ...filters, estado: value })}
          placeholder="Seleccionar estado"
          allowClear
        >
          <Option value="PENDIENTE">Pendiente</Option>
          <Option value="PAGADA">Pagada</Option>
          <Option value="VENCIDA">Vencida</Option>
          <Option value="CANCELADA">Cancelada</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <div style={{ marginBottom: '4px', fontWeight: 500 }}>
          Contrato
        </div>
        <Input
          placeholder="Buscar por contrato"
          value={filters.contrato}
          onChange={(e) => onFiltersChange({ ...filters, contrato: e.target.value })}
          allowClear
        />
      </Col>
      <Col xs={24} sm={24} md={10}>
        <Space style={{ marginTop: '32px' }}>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => {}} // Los filtros se aplican automáticamente
          >
            Aplicar Filtros
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Limpiar
          </Button>
        </Space>
      </Col>
    </Row>
  );
}; 