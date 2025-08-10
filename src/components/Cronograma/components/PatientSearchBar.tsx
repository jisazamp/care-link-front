import { useState, useEffect, useRef } from "react";
import { Input, Dropdown, Button, Space, Typography, Avatar, Spin } from "antd";
import { SearchOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useSearchPatients } from "../../../hooks/useSearchPatients";

const { Text } = Typography;

interface PatientSearchBarProps {
  onPatientSelect: (patientId: number) => void;
}

export const PatientSearchBar: React.FC<PatientSearchBarProps> = ({
  onPatientSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<any>(null);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useSearchPatients(
    debouncedQuery,
    debouncedQuery.length >= 2
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownVisible(true);
  };

  const handlePatientSelect = (patientId: number) => {
    onPatientSelect(patientId);
    setSearchQuery("");
    setIsDropdownVisible(false);
    inputRef.current?.blur();
  };

  const getStatusColor = (porcentaje: number) => {
    if (porcentaje >= 80) return "#52c41a"; // Verde
    if (porcentaje >= 60) return "#faad14"; // Amarillo
    return "#ff4d4f"; // Rojo
  };

  const getStatusText = (porcentaje: number) => {
    if (porcentaje >= 80) return "Excelente";
    if (porcentaje >= 60) return "Regular";
    return "Bajo";
  };

  const dropdownItems = isLoading 
    ? [{ key: "loading", label: <div style={{ textAlign: "center", padding: "20px" }}><Spin size="small" /> <Text>Cargando...</Text></div> }]
    : searchResults?.data?.data?.map((patient) => ({
        key: patient.id_usuario,
        label: (
          <div style={{ padding: "8px 0" }}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <div>
                  <Text strong>
                    {patient.nombres} {patient.apellidos}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    CC: {patient.n_documento}
                  </Text>
                </div>
              </Space>
              
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {patient.total_asistio}/{patient.total_agendado} asistencias
                </Text>
                <Text
                  style={{
                    color: getStatusColor(patient.porcentaje_asistencia),
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {patient.porcentaje_asistencia}% ({getStatusText(patient.porcentaje_asistencia)})
                </Text>
              </Space>
              
              <Button
                type="primary"
                size="small"
                icon={<FileTextOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePatientSelect(patient.id_usuario);
                }}
                style={{ width: "100%", marginTop: "4px" }}
              >
                Ver Informe
              </Button>
            </Space>
          </div>
        ),
      })) || [];

  return (
    <div style={{ marginBottom: "16px" }}>
      <Dropdown
        open={isDropdownVisible && searchQuery.length >= 2}
        onOpenChange={setIsDropdownVisible}
        menu={{
          items: dropdownItems,
          style: { width: "400px", maxHeight: "300px", overflow: "auto" },
        }}
        placement="bottomLeft"
        trigger={["click"]}
      >
        <Input
          ref={inputRef}
          placeholder="Buscar paciente por nombre o documento..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownVisible(true)}
          style={{ width: "400px" }}
          allowClear
        />
      </Dropdown>
    </div>
  );
};

