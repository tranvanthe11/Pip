import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { Status } from "src/configs";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Upload,
  Avatar,
  Radio,
  Divider,
} from "antd";
// import { useSelector } from 'react-redux';
import {
  getFlightDetail,
  removeFlight,
  updateFlight,
} from "src/services/flight";
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

// const tailLayout = {
//     wrapperCol: { offset: 8, span: 16 },
// };

// const { Option } = Select;

const FlightDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [sale, setData] = useState();
  const handleRemoveFlight = () => {
    const flight_id = match.params.id;
    Modal.confirm({
      title: t(`Remove Flight`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to remove this flight? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        removeFlight(flight_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Remove flight successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/flights");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Remove flight failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop remove flight`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const updateFlightHandler = (values) => {
    const flight_id = match.params.id;
    Modal.confirm({
      title: t(`Update Flight`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update the infomation of this flight ? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateFlight(flight_id, values, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update Flight Successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/flights");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update Flight Failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update flight's information`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  useEffect(() => {
    getFlightDetail(match.params.id, (res) => {
      if (res.status === 1) {
        setData(res.data.flight_number);
        form.setFieldsValue(res.data.flight_number);
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get Flight's Information Failed`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);
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
            {t("Flight Detail")}
          </CCardHeader>
          <CCardBody>
            <Form
              form={form}
              {...formItemLayout}
              onFinish={updateFlightHandler}
            >
              <Form.Item
                label={t("Flight Number")}
                labelAlign="left"
                name="flight_number"
              >
                <Input placeholder="Please input flight number" disabled />
              </Form.Item>
              <Form.Item
                label={t("Departure Hour")}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={{ marginLeft: 4 }}
                  type="primary"
                  block
                  htmlType="submit"
                >
                  {t("Update Flight")}
                </Button>
                <Button
                  style={{ background: "rgb(190, 200, 200)", marginLeft: 4 }}
                  ghost
                  block
                  onClick={handleRemoveFlight}
                >
                  {t("Remove Flight")}
                </Button>
              </div>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(FlightDetail);
