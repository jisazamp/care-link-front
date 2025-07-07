import React from "react";
import { Card, Typography, Table, Button } from "antd";
import type { Bill, Payment } from "../../types";

interface BillingDetailsProps {
  factura: Bill;
  pagos: Payment[];
  onAddPayment?: () => void;
  onDeletePayment?: (id: number) => void;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({
  factura,
  pagos,
  onAddPayment,
  onDeletePayment,
}) => {
  const columns = [
    { title: "ID Pago", dataIndex: "id_pago", key: "id_pago" },
    { title: "Fecha", dataIndex: "fecha_pago", key: "fecha_pago" },
    { title: "Valor", dataIndex: "valor", key: "valor" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Payment) => (
        <Button type="link" danger onClick={() => onDeletePayment?.(record.id_pago)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Card title={`Factura #${factura.id_factura}`}>
      <Typography.Paragraph>
        <strong>Contrato:</strong> {factura.id_contrato}<br />
        <strong>Fecha de emisión:</strong> {factura.fecha_emision}<br />
        <strong>Total:</strong> {factura.total_factura}
      </Typography.Paragraph>
      <Table
        columns={columns}
        dataSource={pagos}
        rowKey="id_pago"
        pagination={false}
      />
      <Button type="dashed" onClick={onAddPayment} style={{ marginTop: 16 }}>
        Agregar pago
      </Button>
    </Card>
  );
}; 