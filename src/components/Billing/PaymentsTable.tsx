import { Button, Table } from "antd";
import type React from "react";
import type { Payment } from "../../types";

interface PaymentsTableProps {
  pagos: Payment[];
  onDelete?: (id: number) => void;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  pagos,
  onDelete,
}) => {
  const columns = [
    { title: "ID Pago", dataIndex: "id_pago", key: "id_pago" },
    { title: "Fecha", dataIndex: "fecha_pago", key: "fecha_pago" },
    { title: "Valor", dataIndex: "valor", key: "valor" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Payment) => (
        <Button type="link" danger onClick={() => onDelete?.(record.id_pago)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={pagos}
      rowKey="id_pago"
      pagination={false}
    />
  );
};
