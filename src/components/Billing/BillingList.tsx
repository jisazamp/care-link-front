import React, { useState } from "react";
import { Table, Tag, Button, Space, Tooltip, Input, Select } from "antd";
import type { Bill } from "../../types";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

interface BillingListProps {
  bills: Bill[];
  loading?: boolean;
  onView?: (bill: Bill) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
}

export const BillingList: React.FC<BillingListProps> = ({
  bills,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<string | undefined>(undefined);

  const filteredBills = bills.filter((bill) => {
    const matchSearch = bill.numero_factura?.toLowerCase().includes(search.toLowerCase()) || String(bill.id_factura).includes(search);
    const matchEstado = estado ? bill.estado_factura === estado : true;
    return matchSearch && matchEstado;
  });

  const columns = [
    {
      title: "# Factura",
      dataIndex: "numero_factura",
      key: "numero_factura",
      render: (text: string) => text || "-",
    },
    {
      title: "Fecha Emisión",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Impuestos",
      dataIndex: "impuestos",
      key: "impuestos",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Descuentos",
      dataIndex: "descuentos",
      key: "descuentos",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Total",
      dataIndex: "total_factura",
      key: "total_factura",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Estado",
      dataIndex: "estado_factura",
      key: "estado_factura",
      render: (estado: string) => <Tag color={getEstadoColor(estado)} style={{ fontWeight: 'bold', fontSize: 14 }}>{estado}</Tag>,
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (text: string) => text || "-",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Bill) => (
        <Space>
          <Tooltip title="Ver Detalles">
            <Button type="link" onClick={() => onView && onView(record)}>Ver</Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="link" onClick={() => onEdit && onEdit(record)}>Editar</Button>
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button type="link" danger onClick={() => onDelete && onDelete(record)}>Eliminar</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  function getEstadoColor(estado: string) {
    switch (estado) {
      case "PENDIENTE": return "orange";
      case "PAGADA": return "green";
      case "VENCIDA": return "red";
      case "CANCELADA": return "volcano";
      case "ANULADA": return "gray";
      default: return "blue";
    }
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por número de factura o ID"
          allowClear
          onSearch={setSearch}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <Select
          placeholder="Filtrar por estado"
          allowClear
          style={{ width: 180 }}
          value={estado}
          onChange={setEstado}
        >
          <Option value="PENDIENTE">Pendiente</Option>
          <Option value="PAGADA">Pagada</Option>
          <Option value="VENCIDA">Vencida</Option>
          <Option value="CANCELADA">Cancelada</Option>
          <Option value="ANULADA">Anulada</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredBills}
        loading={loading}
        rowKey="id_factura"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50] }}
        locale={{ emptyText: "No hay facturas registradas" }}
      />
    </>
  );
}; 