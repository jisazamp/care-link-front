import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Input, Row, Select, Space } from "antd";
//import dayjs from 'dayjs';
import type { Dayjs } from "dayjs";
import type React from "react";

const { Option } = Select;

// Filtros para la tabla de CONTRATOS
export interface ContractFiltersValues {
  documento: string;
  estado: string;
  contrato: string;
  tipoContrato: string;
  fechaEmision: Dayjs | null;
  facturaAsociada: string;
  fechaVencimiento: Dayjs | null;
  nombreUsuario: string;
}

interface ContractFiltersProps {
  filters: ContractFiltersValues;
  onFiltersChange: (filters: ContractFiltersValues) => void;
}

export const ContractFilters: React.FC<ContractFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleReset = () => {
    onFiltersChange({
      documento: "",
      estado: "",
      contrato: "",
      tipoContrato: "",
      fechaEmision: null,
      facturaAsociada: "",
      fechaVencimiento: null,
      nombreUsuario: "",
    });
  };

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={3}>
        <Input
          placeholder="Documento"
          value={filters.documento}
          onChange={(e) =>
            onFiltersChange({ ...filters, documento: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={2}>
        <Select
          style={{ width: "100%" }}
          value={filters.estado}
          onChange={(value) => onFiltersChange({ ...filters, estado: value })}
          placeholder="Estado"
          allowClear
        >
          <Option value="PENDIENTE">Pendiente</Option>
          <Option value="PAGADA">Pagada</Option>
          <Option value="VENCIDA">Vencida</Option>
          <Option value="CANCELADA">Cancelada</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={2}>
        <Input
          placeholder="Contrato"
          value={filters.contrato}
          onChange={(e) =>
            onFiltersChange({ ...filters, contrato: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={2}>
        <Input
          placeholder="Tipo Contrato"
          value={filters.tipoContrato}
          onChange={(e) =>
            onFiltersChange({ ...filters, tipoContrato: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={3}>
        <DatePicker
          placeholder="Fecha Emisión"
          value={filters.fechaEmision}
          onChange={(value) =>
            onFiltersChange({ ...filters, fechaEmision: value })
          }
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={2}>
        <Input
          placeholder="Factura Asociada"
          value={filters.facturaAsociada}
          onChange={(e) =>
            onFiltersChange({ ...filters, facturaAsociada: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={3}>
        <DatePicker
          placeholder="Fecha Vencimiento"
          value={filters.fechaVencimiento}
          onChange={(value) =>
            onFiltersChange({ ...filters, fechaVencimiento: value })
          }
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={3}>
        <Input
          placeholder="Nombre de usuario"
          value={filters.nombreUsuario}
          onChange={(e) =>
            onFiltersChange({ ...filters, nombreUsuario: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={24} md={4}>
        <Space>
          <Button type="primary" icon={<FilterOutlined />}>
            Aplicar Filtros
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Limpiar
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

// Filtros para la tabla de FACTURAS
export interface InvoiceFiltersValues {
  factura: string;
  estado: string;
  fechaEmision: Dayjs | null;
  fechaVencimiento: Dayjs | null;
}

interface InvoiceFiltersProps {
  filters: InvoiceFiltersValues;
  onFiltersChange: (filters: InvoiceFiltersValues) => void;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleReset = () => {
    onFiltersChange({
      factura: "",
      estado: "",
      fechaEmision: null,
      fechaVencimiento: null,
    });
  };

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={4}>
        <Input
          placeholder="Factura"
          value={filters.factura}
          onChange={(e) =>
            onFiltersChange({ ...filters, factura: e.target.value })
          }
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={3}>
        <Select
          style={{ width: "100%" }}
          value={filters.estado}
          onChange={(value) => onFiltersChange({ ...filters, estado: value })}
          placeholder="Estado"
          allowClear
        >
          <Option value="PENDIENTE">Pendiente</Option>
          <Option value="PAGADA">Pagada</Option>
          <Option value="VENCIDA">Vencida</Option>
          <Option value="CANCELADA">Cancelada</Option>
        </Select>
      </Col>
      <Col xs={24} sm={12} md={4}>
        <DatePicker
          placeholder="Fecha de emisión"
          value={filters.fechaEmision}
          onChange={(value) =>
            onFiltersChange({ ...filters, fechaEmision: value })
          }
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          allowClear
        />
      </Col>
      <Col xs={24} sm={12} md={4}>
        <DatePicker
          placeholder="Fecha de vencimiento"
          value={filters.fechaVencimiento}
          onChange={(value) =>
            onFiltersChange({ ...filters, fechaVencimiento: value })
          }
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          allowClear
        />
      </Col>
      <Col xs={24} sm={24} md={4}>
        <Space>
          <Button type="primary" icon={<FilterOutlined />}>
            Aplicar Filtros
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Limpiar
          </Button>
        </Space>
      </Col>
    </Row>
  );
};
