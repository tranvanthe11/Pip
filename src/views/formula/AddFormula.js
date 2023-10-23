import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Upload,
  Avatar,
  InputNumber,
  Radio,
  Divider,
} from "antd";
// import { createUser } from "src/services/user";
import { createFormula } from "src/services/formula";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const AddFormula = ({ t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [serve, setServe] = useState(0);
  const { airports, provinces, districts, carTypes } = useSelector(
    (state) => state
  );

  const onFinish = (values) => {
    Modal.confirm({
      title: t(`Create Formula`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to create this formula? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        createFormula(values, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Create formula successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/formulas");
          } else {
            notification.error({
              message: t(`Notification`),
              description: t(`${res.message}`),
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop create formula`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };

  return (
    <CRow>
      <CCol xs="12" md="9" className="mb-4">
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            {t("Add Flight")}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={onFinish}>
              <Form.Item
                label={t("Service Name")}
                labelAlign="left"
                initialValue="1"
                name="service_id"
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select service"
                  optionFilterProp="service"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value="1">{t("Go to airport")}</Select.Option>
                  <Select.Option value="2">
                    {t("Come back from airport")}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Airport")}
                labelAlign="left"
                name="airport_id"
                initialValue={airports[0]?._id}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select airport"
                  optionFilterProp="airport"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {airports.map((item, index) => (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Province")}
                labelAlign="left"
                name="province_id"
                initialValue={provinces[0]?.id}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select province"
                  optionFilterProp="province"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {provinces.map((item, index) => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("District")}
                labelAlign="left"
                name="district_id"
                initialValue={districts[0]?.id}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select district"
                  optionFilterProp="district"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {districts.map((item, index) => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Car Type")}
                labelAlign="left"
                name="car_type_name_id"
                initialValue={carTypes[0]?.name_id}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select car type"
                  optionFilterProp="car type"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {carTypes.map((item, index) => (
                    <Select.Option value={item.name_id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Serve")}
                labelAlign="left"
                initialValue="1"
                name="serve"
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select serve"
                  optionFilterProp="serve"
                  onChange={(e) => setServe(e)}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option value="1">{t("Yes")}</Select.Option>
                  <Select.Option value="2">{t("No")}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item 
                label={t("Price")} 
                labelAlign="left" 
                name="price"
                rules={
                  [{
                      required: true,
                      message: t("Please input price!"),
                  },]
                }
              >
                <InputNumber min={0} style={{ width: "100%" }} type="number" />
              </Form.Item>
              <Button type="primary" block htmlType="submit">
                {t("Create")}
              </Button>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(AddFormula);
