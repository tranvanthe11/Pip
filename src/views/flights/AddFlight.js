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
// import { useSelector } from 'react-redux';
// import { createUser } from "src/services/user";
import { createFlightNumber } from "src/services/flight";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
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
const AddSale = ({ t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const onFinish = (values) => {
    Modal.confirm({
      title: t(`Create Flight`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to create this flight? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        createFlightNumber(values, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Create flight successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/flights");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Create flight failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop create flight`),
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
                label={t("Flight Number")}
                labelAlign="left"
                name="flight_number"
                rules={
                  [{
                      required: true,
                      message: t("Please input flight number!"),
                  },]
              }
              >
                <Input placeholder="Please input flight number" />
              </Form.Item>
              <Form.Item
                label={t("Departure hour")}
                labelAlign="left"
                name="departure_hour"
                rules={
                  [{
                      required: true,
                      message: t("Please input departure hour!"),
                  },]
              }
              >
                <InputNumber
                  min={1}
                  max={24}
                  style={{ width: "100%" }}
                  type="number"
                  placeholder="Please input departure hour"
                />
              </Form.Item>
              <Form.Item
                label={t("Departure Mins")}
                labelAlign="left"
                name="departure_mins"
                rules={
                  [{
                      required: true,
                      message: t("Please input departure mins!"),
                  },]
              }
              >
                <InputNumber
                  min={0}
                  max={60}
                  style={{ width: "100%" }}
                  type="number"
                  placeholder="Please input departure minutes"
                />
              </Form.Item>
              <Form.Item
                label={t("Arrival Hour")}
                labelAlign="left"
                name="arrival_hour"
                rules={
                  [{
                      required: true,
                      message: t("Please input arrival hour!"),
                  },]
              }
              >
                <InputNumber
                  min={1}
                  max={24}
                  style={{ width: "100%" }}
                  type="number"
                  placeholder="Please input arrival hour"
                />
              </Form.Item>
              <Form.Item
                label={t("Arrival Mins")}
                labelAlign="left"
                name="arrival_mins"
                rules={
                  [{
                      required: true,
                      message: t("Please input arrival mins!"),
                  },]
              }
              >
                <InputNumber
                  min={0}
                  max={60}
                  style={{ width: "100%" }}
                  type="number"
                  placeholder="Please input arrival minutes"
                />
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

export default withNamespaces()(AddSale);
