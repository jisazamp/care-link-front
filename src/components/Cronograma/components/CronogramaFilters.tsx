import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Row, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CronogramaFiltersProps {
  onFilterChange: (filters: {
    dateRange: [Dayjs, Dayjs] | null;
    estado: string;
  }) => void;
  onReset: () => void;
}

export const CronogramaFilters: React.FC<CronogramaFiltersProps> = ({
  onFilterChange,
  onReset,
}) => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [estado, setEstado] = useState<string>("");

  const handleFilter = () => {
    onFilterChange({
      dateRange,
      estado,
    });
  };

  const handleReset = () => {
    setDateRange(null);
    setEstado("");
    onReset();
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Rango de Fechas
          </label>
          <RangePicker
            style={{ width: "100%" }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
            placeholder={["Fecha inicio", "Fecha fin"]}
          />
        </Col>
        <Col span={6}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Estado de Asistencia
          </label>
          <Select
            style={{ width: "100%" }}
            value={estado}
            onChange={setEstado}
            placeholder="Seleccionar estado"
            allowClear
          >
            <Option value="PENDIENTE">Pendiente</Option>
            <Option value="ASISTIO">Asistió</Option>
            <Option value="NO_ASISTIO">No Asistió</Option>
            <Option value="CANCELADO">Cancelado</Option>
          </Select>
        </Col>
        <Col span={10}>
          <Space style={{ marginTop: 32 }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleFilter}
            >
              Filtrar
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Limpiar
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
