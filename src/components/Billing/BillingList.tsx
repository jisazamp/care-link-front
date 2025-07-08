import React from "react";
import { Table, Tag, Button, Space, Typography, Badge, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import type { Bill } from "../../types";
import dayjs from "dayjs";

const { Text } = Typography;

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
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PAGADA':
        return { color: 'success', text: 'PAGADA' };
      case 'VENCIDA':
        return { color: 'error', text: 'VENCIDA' };
      case 'PENDIENTE':
        return { color: 'warning', text: 'PENDIENTE' };
      default:
        return { color: 'default', text: 'PENDIENTE' };
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PAGADA':
        return 'success';
      case 'VENCIDA':
        return 'error';
      case 'PENDIENTE':
        return 'processing';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Número",
      dataIndex: "numero_factura",
      key: "numero_factura",
      width: 120,
      render: (numero: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <Text strong style={{ color: '#1890ff' }}>
            {numero || 'N/A'}
          </Text>
        </Space>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_factura",
      key: "estado_factura",
      width: 120,
      render: (estado: string) => {
        const estadoInfo = getEstadoColor(estado || 'PENDIENTE');
        return (
          <Badge 
            status={getEstadoBadge(estado || 'PENDIENTE') as any} 
            text={
              <Tag color={estadoInfo.color}>
                {estadoInfo.text}
              </Tag>
            }
          />
        );
      },
    },
    {
      title: "Fecha Emisión",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
      width: 120,
      render: (fecha: string) => (
        <Text>
          {fecha ? dayjs(fecha).format('DD/MM/YYYY') : 'N/A'}
        </Text>
      ),
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      width: 120,
      render: (fecha: string) => (
        <Text>
          {fecha ? dayjs(fecha).format('DD/MM/YYYY') : 'N/A'}
        </Text>
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: 100,
      render: (subtotal: number) => (
        <Text>
          $ {Number(subtotal || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Impuestos",
      dataIndex: "impuestos",
      key: "impuestos",
      width: 100,
      render: (impuestos: number) => (
        <Text style={{ color: '#52c41a' }}>
          + $ {Number(impuestos || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Descuentos",
      dataIndex: "descuentos",
      key: "descuentos",
      width: 100,
      render: (descuentos: number) => (
        <Text style={{ color: '#ff4d4f' }}>
          - $ {Number(descuentos || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_factura",
      key: "total_factura",
      width: 120,
      render: (total: number) => (
        <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
          $ {Number(total || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Pagos",
      key: "pagos",
      width: 120,
      render: (record: Bill) => {
        const totalPagado = record.pagos?.reduce((acc, pago) => acc + (Number(pago.valor) || 0), 0) || 0;
        const totalFactura = Number(record.total_factura) || 0;
        const saldoPendiente = totalFactura - totalPagado;
        
        return (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Pagado: $ {totalPagado.toLocaleString()}
            </Text>
            <br />
            <Text 
              type={saldoPendiente > 0 ? "danger" : "success"} 
              style={{ fontSize: 12 }}
            >
              Saldo: $ {saldoPendiente.toLocaleString()}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Contrato",
      dataIndex: "id_contrato",
      key: "id_contrato",
      width: 80,
      render: (id: number) => (
        <Text code>
          #{id}
        </Text>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      render: (record: Bill) => (
        <Space size="small">
          {onView && (
            <Tooltip title="Ver detalles">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onView(record)}
                size="small"
              />
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Editar factura">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                size="small"
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Eliminar factura">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={bills}
      loading={loading}
      rowKey="id_factura"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} facturas`,
      }}
      scroll={{ x: 1200 }}
    />
  );
}; 