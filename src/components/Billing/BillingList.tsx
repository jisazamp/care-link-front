import React from "react";
import { Table, Button, Popconfirm } from "antd";
import type { Bill } from "../../types";
import { useDeleteFactura } from "../../hooks/useDeleteFactura";

interface BillingListProps {
  facturas: Bill[];
  loading?: boolean;
  onCreate?: (id_contrato?: number) => void;
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const BillingList: React.FC<BillingListProps> = ({
  facturas,
  loading,
  onCreate,
  onView,
  onDelete,
}) => {
  const { mutate: deleteFactura, isPending: deleting } = useDeleteFactura();

  const handleDelete = (id: number) => {
    deleteFactura(id);
    onDelete?.(id);
  };

  const columns = [
    { title: "N° Factura", dataIndex: "id_factura", key: "id_factura" },
    { title: "Contrato", dataIndex: "id_contrato", key: "id_contrato" },
    { title: "Fecha Emisión", dataIndex: "fecha_emision", key: "fecha_emision", render: (fecha: string) => fecha ? new Date(fecha).toLocaleDateString() : "-" },
    { title: "Total", dataIndex: "total_factura", key: "total_factura", render: (valor: number) => valor ? `$${valor.toLocaleString()}` : "-" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Bill) => (
        <>
          <Button type="link" onClick={() => onView?.(record.id_factura)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que deseas eliminar esta factura?"
            onConfirm={() => handleDelete(record.id_factura)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger loading={deleting}>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {onCreate && (
        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => onCreate(facturas[0]?.id_contrato)}>
          Nueva Factura
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={facturas}
        loading={loading}
        rowKey="id_factura"
        pagination={false}
      />
    </div>
  );
}; 