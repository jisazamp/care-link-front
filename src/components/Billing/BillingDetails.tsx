import React from "react";
import { Descriptions, Tag, Divider, Table, Empty } from "antd";
import dayjs from "dayjs";
import type { Bill } from "../../types";

interface BillingDetailsProps {
  bill: Bill;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({ bill }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "orange";
      case "PAGADA": return "green";
      case "VENCIDA": return "red";
      case "CANCELADA": return "volcano";
      case "ANULADA": return "gray";
      default: return "blue";
    }
  };

  const pagosColumns = [
    { title: "Fecha", dataIndex: "fecha_pago", key: "fecha_pago", render: (v: string) => dayjs(v).format("DD/MM/YYYY") },
    { title: "Método", dataIndex: "metodo_pago_nombre", key: "metodo_pago_nombre", render: (v: string, r: any) => v || r.id_metodo_pago },
    { title: "Tipo", dataIndex: "tipo_pago_nombre", key: "tipo_pago_nombre", render: (v: string, r: any) => v || r.id_tipo_pago },
    { title: "Valor", dataIndex: "valor", key: "valor", render: (v: number) => `$ ${Number(v || 0).toLocaleString()}` },
  ];

  return (
    <div>
      <Descriptions title={`Factura #${bill.numero_factura || bill.id_factura}`} bordered column={2}>
        <Descriptions.Item label="Fecha de Emisión">{dayjs(bill.fecha_emision).format("DD/MM/YYYY")}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Vencimiento">{bill.fecha_vencimiento ? dayjs(bill.fecha_vencimiento).format("DD/MM/YYYY") : "-"}</Descriptions.Item>
        <Descriptions.Item label="Subtotal">$ {Number(bill.subtotal || 0).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Impuestos">$ {Number(bill.impuestos || 0).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Descuentos">$ {Number(bill.descuentos || 0).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Total">$ {Number(bill.total_factura || 0).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Estado" span={2}>
          <Tag color={getEstadoColor(bill.estado_factura || "PENDIENTE")}
            style={{ fontWeight: 'bold', fontSize: 16, padding: '4px 16px' }}>
            {bill.estado_factura || "PENDIENTE"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Observaciones" span={2}>{bill.observaciones || "-"}</Descriptions.Item>
      </Descriptions>
      {/* Mostrar pagos asociados si existen */}
      <Divider>Pagos Asociados</Divider>
      {bill.pagos && bill.pagos.length > 0 ? (
        <Table
          columns={pagosColumns}
          dataSource={bill.pagos}
          rowKey={(r) => `${r.fecha_pago}-${r.valor}`}
          pagination={false}
          size="small"
        />
      ) : (
        <Empty description="No hay pagos registrados para esta factura" style={{ margin: '24px 0' }} />
      )}
    </div>
  );
}; 