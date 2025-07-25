import dayjs from "dayjs";
import type { UseFormGetValues } from "react-hook-form";
import type {
  Contract,
  Service as ContractService,
  CreateContractRequest,
} from "../../../../types";
import type { FormValues, Service } from "../FormContracts";

const getServiceType = (serviceId: number, length?: number) => {
  switch (serviceId) {
    case 1:
      return length ? `Tiquetera ${length / 4}` : null;
    case 2:
      return length ? `Transporte ${length / 4}` : null;
    case 3:
      return "Servicio dia";
    default:
      return "";
  }
};

const getServiceId = (serviceType: string) => {
  if (serviceType.includes("Transporte")) return 2;
  if (serviceType.includes("Tiquetera")) return 1;
  return 3;
};

export const convertServicesData = (
  services: ContractService[],
  startingServices: Service[],
): Service[] => {
  let result: Service[] = services.map((s) => ({
    description: s.descripcion,
    endDate: dayjs(s.fecha).add(1, "month"),
    key: `${s.id_servicio}`,
    price: s.precio_por_dia,
    quantity: s.fechas_servicio.length,
    selected: !!s.fechas_servicio.length,
    serviceType: getServiceType(s.id_servicio, s.fechas_servicio.length) || "",
    startDate: dayjs(s.fecha),
  }));

  if (services.length === 1)
    result = [
      ...result,
      {
        ...startingServices[1],
        startDate: result[0].startDate,
        endDate: result[0].endDate,
      },
    ];

  return result;
};

export const convertSelectedDates = (dates: { fecha: string }[]): string[] =>
  dates.map((d) => d.fecha);

export const convertContractData = (
  contract: Contract & { servicios: ContractService[] },
  startingServices: Service[],
): Omit<FormValues, "payments"> => {
  const {
    tipo_contrato,
    facturar_contrato,
    fecha_inicio,
    fecha_fin,
    servicios,
  } = contract;

  const services = convertServicesData(servicios, startingServices);

  return {
    contractType: tipo_contrato,
    billed: facturar_contrato ? "si" : "no",
    startDate: dayjs(fecha_inicio),
    endDate: dayjs(fecha_fin),
    services,
    selectedDatesService: convertSelectedDates(
      servicios.find((e) => e.id_servicio === 1)?.fechas_servicio ?? [],
    ),
    selectedDatesTransport: convertSelectedDates(
      servicios.find((e) => e.id_servicio === 2)?.fechas_servicio ?? [],
    ),
    selectedDateDay:
      servicios.find((e) => e.id_servicio === 3)?.fechas_servicio?.[0]?.fecha ??
      null,
  };
};

export const buildContractFromForm = (
  data: FormValues,
  userId: number,
  contractId: number,
): Contract => ({
  id_usuario: userId,
  id_contrato: contractId,
  facturar_contrato: data.billed === "si",
  tipo_contrato: data.contractType as "Nuevo" | "Recurrente",
  fecha_inicio:
    data.startDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
  fecha_fin: data.endDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
});

export const buildContractData = (
  id: string | number,
  data: FormValues,
  getValues: UseFormGetValues<FormValues>,
): CreateContractRequest => {
  return {
    id_usuario: Number(id),
    tipo_contrato: data.contractType,
    fecha_inicio:
      data.startDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
    fecha_fin:
      data.endDate?.format("YYYY-MM-DD") ??
      dayjs().add(1, "month").format("YYYY-MM-DD"),
    facturar_contrato: data.billed !== "no",
    servicios: data.services
      .filter((s) => !!s.quantity)
      .map((s) => ({
        id_servicio: getServiceId(s.serviceType),
        fecha:
          s.startDate?.format("YYYY-MM-DD") ?? dayjs().format("YYYY-MM-DD"),
        descripcion: s.description,
        precio_por_dia: s.price,
        fechas_servicio: s.serviceType.includes("Transporte")
          ? getValues("selectedDatesTransport")
              .filter(
                (f: string | null): f is string =>
                  f !== null && f !== undefined,
              )
              .map((f: string) => ({
                fecha: f,
              }))
          : s.serviceType.includes("Tiquetera")
            ? getValues("selectedDatesService")
                .filter(
                  (f: string | null): f is string =>
                    f !== null && f !== undefined,
                )
                .map((f: string) => ({
                  fecha: f,
                }))
            : getValues("selectedDateDay")
              ? [{ fecha: getValues("selectedDateDay") as string }]
              : [],
      })),
  };
};
