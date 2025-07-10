import React from 'react';
import { Row, Col, DatePicker, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { Text } = Typography;

interface TransporteFiltersProps {
  selectedDate: Dayjs;
  onDateChange: (date: Dayjs | null) => void;
}

export const TransporteFilters: React.FC<TransporteFiltersProps> = ({
  selectedDate,
  onDateChange
}) => {
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={8}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined />
          <Text strong>Fecha:</Text>
        </div>
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
          format="DD/MM/YYYY"
          style={{ width: '100%', marginTop: '4px' }}
          placeholder="Selecciona una fecha"
        />
      </Col>
      <Col xs={24} sm={24} md={16}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          padding: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px'
        }}>
          <Text type="secondary">
            Mostrando todos los servicios para el {selectedDate.format('DD/MM/YYYY')}
          </Text>
        </div>
      </Col>
    </Row>
  );
}; 