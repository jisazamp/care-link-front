import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { CronogramaAsistencia } from "../../../types";

interface CronogramaStatsProps {
  cronogramas: CronogramaAsistencia[];
}

export const CronogramaStats: React.FC<CronogramaStatsProps> = ({
  cronogramas,
}) => {
  // Obtener el mes y año actual a partir del primer cronograma (o de hoy si no hay)
  const today = dayjs();
  const anyFecha = cronogramas[0]?.fecha || today.format("YYYY-MM-DD");
  const currentMonth = dayjs(anyFecha).month();
  const currentYear = dayjs(anyFecha).year();
  const daysInMonth = dayjs(anyFecha).daysInMonth();

  const stats = useMemo(() => {
    // Set para almacenar IDs únicos de pacientes
    const pacientesUnicos = new Set<number>();
    const pacientesAsistieron = new Set<number>();
    const pacientesNoAsistieron = new Set<number>();
    // Días con al menos un paciente pendiente
    const diasPendientes = new Set<string>();
    // Días con al menos un paciente agendado
    const diasConAgenda = new Set<string>();

    cronogramas.forEach((cronograma) => {
      let tienePendiente = false;
      let tieneAlMenosUno = false;
      cronograma.pacientes.forEach((paciente) => {
        pacientesUnicos.add(paciente.id_usuario);
        tieneAlMenosUno = true;
        if (paciente.estado_asistencia === "PENDIENTE") {
          tienePendiente = true;
        }
        switch (paciente.estado_asistencia) {
          case "ASISTIO":
            pacientesAsistieron.add(paciente.id_usuario);
            break;
          case "NO_ASISTIO":
            pacientesNoAsistieron.add(paciente.id_usuario);
            break;
        }
      });
      if (tienePendiente) diasPendientes.add(cronograma.fecha);
      if (tieneAlMenosUno) diasConAgenda.add(cronograma.fecha);
    });

    // Calcular días libres del mes
    const diasLibres = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const fecha = dayjs(
        `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`,
      ).format("YYYY-MM-DD");
      if (!diasConAgenda.has(fecha)) diasLibres.push(fecha);
    }

    return {
      totalPacientes: pacientesUnicos.size,
      asistieron: pacientesAsistieron.size,
      noAsistieron: pacientesNoAsistieron.size,
      pendientes: diasPendientes.size,
      diasLibres: diasLibres.length,
    };
  }, [cronogramas, currentMonth, currentYear, daysInMonth]);

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={5}>
        <Card>
          <Statistic
            title="Total Pacientes"
            value={stats.totalPacientes}
            prefix={<UserOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Asistieron"
            value={stats.asistieron}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="No Asistieron"
            value={stats.noAsistieron}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Card>
      </Col>
      <Col span={5}>
        <Card>
          <Statistic
            title="Pendientes (días con agenda)"
            value={stats.pendientes}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Días libres (sin agenda)"
            value={stats.diasLibres}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: "#bfbfbf" }}
          />
        </Card>
      </Col>
    </Row>
  );
};
