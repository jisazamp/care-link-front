import React from "react";
import { Form, Input, Select, Button, Typography } from "antd";
import { MMSEQuestionsProps } from "./types";
import { mmseQuestions } from "./questions";

const { Option } = Select;
const { Title } = Typography;

export const MMSEQuestions: React.FC<MMSEQuestionsProps> = ({ onNext, onChange, answers }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, string>) => {
    onChange(values);
    onNext();
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: 16 }}>Mini-Mental State Examination (MMSE)</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={answers}
        onFinish={handleFinish}
        onValuesChange={(_, values) => onChange(values)}
      >
        {mmseQuestions.map((q) => (
          <Form.Item
            key={q.key}
            name={q.key}
            label={q.label}
            help={q.help}
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            {q.type === "select" ? (
              <Select>
                {q.options?.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Siguiente
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}; 