import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
// import {
//     Domain,
// } from 'src/configs';
import { Button, Modal, Form, Input, notification } from "antd";
import { updateDriver } from "src/services/driver";
import {
  getOrderDetail,
  confirmOrderDetail,
  cancelOrderDetail,
  getListOrders,
} from "src/services/order";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { rowTextArea } from "src/configs/Table";

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
const OrderDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [orderStatus, setOrderStatus] = useState(0);
  const pathname = useLocation().pathname;
  const [data, setData] = useState();
  useEffect(() => {
    getOrderDetail(match.params.id, (res) => {
      if (res.data.order) {
        const { order } = res.data;
        // console.log(res);
        setOrderStatus(res.data?.order?.order_status);
        setData(order);
        form.setFieldsValue({
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          dropoff: order.dropoff,
          pickup: order.pickup,
          other: order.other,
        });
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get Order Detail Failed!`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, [pathname]);
  const onFinish = () => {
    const _id = match.params.id;
    Modal.confirm({
      title: t(`Confirm Order`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to confirm this order? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        confirmOrderDetail(_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/orders");
          } else {
            notification.error({
              message: t(`Notification`),
              description: t(`Confirm order failed.`),
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update order`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const cancelOrder = () => {
    const _id = match.params.id;
    Modal.confirm({
      title: t(`Cancel Order`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to cancel this order? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        cancelOrderDetail(_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/orders");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `${res.message}`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop cancel order`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  return (
    <CRow>
      <CCol xs="12" md="7" className="mb-4">
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            {t("Order Detail")}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={onFinish}>
              <>
                <Form.Item
                  label={t("Nickname")}
                  labelAlign="left"
                  name="customer_name"
                >
                  <p className="ant-form-text">{data?.customer_name}</p>
                </Form.Item>
                <Form.Item
                  label={t("Phone")}
                  labelAlign="left"
                  name="customer_phone"
                >
                  <p className="ant-form-text">{data?.customer_phone}</p>
                </Form.Item>
              </>
              {/* {orderStatus == 0 && (
                <>
                  <Form.Item
                    label={t("Nickname")}
                    labelAlign="left"
                    name="customer_name"
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label={t("Phone")}
                    labelAlign="left"
                    name="customer_phone"
                  >
                    <Input disabled />
                  </Form.Item>
                </>
              )} */}
              <Form.Item label={t("Journey")} labelAlign="left" name="other">
                <Input.TextArea rows={rowTextArea} disabled />
              </Form.Item>
              {orderStatus == 0 && (
                <>
                  <Button
                    style={{ maxWidth: "50%", width: "100%" }}
                    type="primary"
                    htmlType="submit"
                  >
                    {t("Confirm Order")}
                  </Button>
                  <Button
                    style={{ maxWidth: "50%", width: "100%" }}
                    type="default"
                    htmlType="button"
                    onClick={cancelOrder}
                  >
                    {t("Cancel")}
                  </Button>
                </>
              )}
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="5" className="mb-4">
        <CCard>
          <CCardHeader>{t("Hỗ trợ tin nhắn cho sale")}</CCardHeader>
          <CCardBody>
            <>
              <h5>Step 0 : Giới thiệu pippip</h5>
              <b>Hướng dẫn : Sau khi add zalo hoặc qua hình thức nhắn tin nào đó</b>
              <p>Gửi tin nhắn :<br/>Mình bên dịch vụ đặt xe pippip.vn</p>        
            </>
            <>
              <h5>Step 1 : xác nhận yêu cầu</h5>
              <b>Hướng dẫn : sau khi giới thiệu</b>
              <p>
                Gửi tin nhắn :
                Anh || Chị có nhu cầu "{data?.other}" đúng không ạ?<br/>
              </p>        
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(OrderDetail);
