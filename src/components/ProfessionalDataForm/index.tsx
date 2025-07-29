import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  type Control,
  Controller,
  type FieldErrors,
  useFormContext,
} from "react-hook-form";

import type { UserDTO } from "../CreateAuthorizedUser/index.schema";
import { Charge, Profession, Specialty } from "./index.schema";

const { Text } = Typography;
const { Option } = Select;

interface ProfessionalDataFormProps {
  control?: Control<UserDTO>;
  errors?: FieldErrors<UserDTO>;
}

export const ProfessionalDataForm: React.FC<ProfessionalDataFormProps> = ({
  control: propControl,
  errors: propErrors,
}) => {
  const context = useFormContext<UserDTO>();
  const control = propControl ?? context?.control;
  const errors = propErrors ?? context?.formState?.errors;

  const professionalErrors = errors?.professional_user ?? {};

  if (!control || !errors) {
    console.warn(
      "ProfessionalDataForm debe usarse dentro de un FormProvider o recibir control y errors como props.",
    );
    return null;
  }

  return (
    <Card variant="borderless" style={{ marginTop: 20 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Número de documento"
            validateStatus={professionalErrors.documentNumber ? "error" : ""}
            help={
              professionalErrors.documentNumber?.message && (
                <Text type="danger">
                  {professionalErrors.documentNumber.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.documentNumber"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="123456789" />
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Tarjeta Profesional"
            validateStatus={professionalErrors.professionalId ? "error" : ""}
            help={
              professionalErrors.professionalId?.message && (
                <Text type="danger">
                  {professionalErrors.professionalId.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.professionalId"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="ID profesional" />
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Fecha de nacimiento"
            validateStatus={professionalErrors.birthdate ? "error" : ""}
            help={
              professionalErrors.birthdate?.message && (
                <Text type="danger">
                  {professionalErrors.birthdate.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.birthdate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate())}
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Fecha de ingreso"
            validateStatus={professionalErrors.entryDate ? "error" : ""}
            help={
              professionalErrors.entryDate?.message && (
                <Text type="danger">
                  {professionalErrors.entryDate.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.entryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate())}
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Profesión"
            validateStatus={professionalErrors.profession ? "error" : ""}
            help={
              professionalErrors.profession?.message && (
                <Text type="danger">
                  {professionalErrors.profession.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.profession"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione una profesión">
                  {Object.values(Profession).map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Especialidad"
            validateStatus={professionalErrors.specialty ? "error" : ""}
            help={
              professionalErrors.specialty?.message && (
                <Text type="danger">
                  {professionalErrors.specialty.message}
                </Text>
              )
            }
          >
            <Controller
              name="professional_user.specialty"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione una especialidad">
                  {Object.values(Specialty).map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Cargo"
            validateStatus={professionalErrors.charge ? "error" : ""}
            help={
              professionalErrors.charge?.message && (
                <Text type="danger">{professionalErrors.charge.message}</Text>
              )
            }
          >
            <Controller
              name="professional_user.charge"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione un cargo">
                  {Object.values(Charge).map((value) => (
                    <Option key={value} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Teléfono"
            validateStatus={professionalErrors.phone ? "error" : ""}
            help={
              professionalErrors.phone?.message && (
                <Text type="danger">{professionalErrors.phone.message}</Text>
              )
            }
          >
            <Controller
              name="professional_user.phone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="3001234567" />
              )}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Dirección de residencia"
            validateStatus={professionalErrors.address ? "error" : ""}
            help={
              professionalErrors.address?.message && (
                <Text type="danger">{professionalErrors.address.message}</Text>
              )
            }
          >
            <Controller
              name="professional_user.address"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Calle 123 # 45 - 67" />
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
