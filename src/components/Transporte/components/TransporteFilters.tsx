import React from 'react';
import { Row, Col, DatePicker, Select, Typography } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

interface TransporteFiltersProps {
  selectedDate: Dayjs;
  selectedProfesional: number;
  onDateChange: (date: Dayjs | null) => void;
  onProfesionalChange: (profesional: number) => void;
}

export const TransporteFilters: React.FC<TransporteFiltersProps> = ({
  selectedDate,
  selectedProfesional,
  onDateChange,
  onProfesionalChange
}) => {
  // Lista de profesionales (en un caso real, esto vendría de un hook)
  const profesionales = [
    { id: 1, nombre: 'Dr. Juan Pérez' },
    { id: 2, nombre: 'Dra. María García' },
    { id: 3, nombre: 'Dr. Carlos López' },
    { id: 4, nombre: 'Dra. Ana Rodríguez' },
  ];

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
      <Col xs={24} sm={12} md={8}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined />
          <Text strong>Profesional:</Text>
        </div>
        <Select
          value={selectedProfesional}
          onChange={onProfesionalChange}
          style={{ width: '100%', marginTop: '4px' }}
          placeholder="Selecciona un profesional"
        >
          {profesionales.map(prof => (
            <Option key={prof.id} value={prof.id}>
              {prof.nombre}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={24} md={8}>
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
            Mostrando rutas para el {selectedDate.format('DD/MM/YYYY')}
          </Text>
        </div>
      </Col>
    </Row>
  );
}; 