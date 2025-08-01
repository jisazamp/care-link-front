import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  InputNumber,
  Button,
  message,
  Space,
  Typography,
  Divider,
} from "antd";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { useGetServiceRates } from "../../../../hooks/useGetServiceRates/useGetServiceRates";
import { useUpdateServiceRates } from "../../../../hooks/useUpdateServiceRates/useUpdateServiceRates";

const { Title, Text } = Typography;

interface ServiceRate {
  id: number;
  id_servicio: number;
  anio: number;
  precio_por_dia: number;
  nombre_servicio: string;
}

export const ServiceRatesEditor: React.FC = () => {
  const [editingRates, setEditingRates] = useState<ServiceRate[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    data: serviceRatesData,
    isLoading,
    error,
    refetch,
  } = useGetServiceRates();
  const updateServiceRatesMutation = useUpdateServiceRates();

  // Inicializar datos de edición cuando se cargan las tarifas
  useEffect(() => {
    if (serviceRatesData?.data?.TarifasServicioPorAnio) {
      setEditingRates([...serviceRatesData.data.TarifasServicioPorAnio]);
      setHasChanges(false);
    }
  }, [serviceRatesData]);

  // Manejar cambios en los precios
  const handlePriceChange = (id: number, newPrice: number) => {
    setEditingRates((prev) =>
      prev.map((rate) =>
        rate.id === id ? { ...rate, precio_por_dia: newPrice } : rate,
      ),
    );
    setHasChanges(true);
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      await updateServiceRatesMutation.mutateAsync({
        TarifasServicioPorAnio: editingRates.map((rate) => ({
          id: rate.id,
          id_servicio: rate.id_servicio,
          anio: rate.anio,
          precio_por_dia: rate.precio_por_dia,
        })),
      });

      message.success(" Tarifas actualizadas exitosamente");
      setHasChanges(false);
    } catch (error) {
      message.error(" Error al actualizar las tarifas");
    }
  };

  // Recargar datos
  const handleReload = () => {
    refetch();
    setHasChanges(false);
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id: number) => <Text code>{id}</Text>,
    },
    {
      title: "Servicio",
      dataIndex: "nombre_servicio",
      key: "nombre_servicio",
      render: (nombre: string) => <Text strong>{nombre}</Text>,
    },
    {
      title: "Año",
      dataIndex: "anio",
      key: "anio",
      width: 100,
      render: (anio: number) => <Text>{anio}</Text>,
    },
    {
      title: "Precio por Día",
      dataIndex: "precio_por_dia",
      key: "precio_por_dia",
      width: 200,
      render: (precio: number, record: ServiceRate) => (
        <InputNumber
          value={precio}
          onChange={(value) => handlePriceChange(record.id, value || 0)}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
          min={0}
          step={1000}
          style={{ width: "100%" }}
          placeholder="0.00"
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text>Cargando tarifas de servicios...</Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text type="danger">Error al cargar las tarifas de servicios</Text>
          <br />
          <Button
            onClick={handleReload}
            type="primary"
            style={{ marginTop: 16 }}
          >
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Title level={4} style={{ margin: 0 }}>
            Configuración de Tarifas por Servicio
          </Title>
          {hasChanges && (
            <Text type="warning" style={{ fontSize: "12px" }}>
              ! Hay cambios sin guardar
            </Text>
          )}
        </div>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReload}
            disabled={updateServiceRatesMutation.isPending}
          >
            Recargar
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={updateServiceRatesMutation.isPending}
            disabled={!hasChanges}
          >
            Guardar Cambios
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Edita los precios por día para cada servicio y año. Los cambios se
          aplicarán a todas las facturas futuras.
        </Text>
      </div>

      <Divider />

      <Table
        columns={columns}
        dataSource={editingRates}
        rowKey="id"
        pagination={false}
        size="middle"
        scroll={{ x: 600 }}
      />

      {editingRates.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text type="secondary">No hay tarifas configuradas</Text>
        </div>
      )}
    </Card>
  );
};
