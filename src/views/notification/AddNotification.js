import React from 'react'
import { withNamespaces } from "react-i18next"
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader
} from '@coreui/react';
import { Table, Space, Button, Form, Input, Tag, Divider, Modal, notification } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createNotification } from 'src/services/notification';
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

const AddNotification = ({ t }) => {

  const [form, form1] = Form.useForm();

  const handleNewAppUpdate = (values) => {
    var submitData = {
      title: values.title,
      content: values.content,
      data: {
        type: "1",
      },
    }
    console.log(submitData)
    Modal.confirm({
        title: t(`Create Customer`),
        icon: <ExclamationCircleOutlined />,
        content: t(`You are going to create this notification? Are you sure you want to do this? You can't reverse this`),
        onOk() {
          createNotification(submitData, (res) => {
            if (res.status === 1) {
                
                notification.success({
                    message: t(`Notification`),
                    description: `Create notification successful.`,
                    placement: `bottomRight`,
                    duration: 1.5,
                });
            } else {
                notification.error({
                    message: t(`Notification`),
                    description: t(`${res.message}`),
                    placement: `bottomRight`,
                    duration: 1.5,
                });
              }
          })
        },
        onCancel() {
            notification.info({
                message: t(`Notification`),
                description: t(`Stop create notification`),
                placement: `bottomRight`,
                duration: 1.5,
            });
        },
        centered: true,
    });
  }

  const handleNewCampaign = (values) => {
    var submitData = {
      title: values.title,
      content: values.content,
      data: {
        type: "2",
        "url":"https://pippip.vn/khuyenmai",
      },
    }
    Modal.confirm({
        title: t(`Create Customer`),
        icon: <ExclamationCircleOutlined />,
        content: t(`You are going to create this notification? Are you sure you want to do this? You can't reverse this`),
        onOk() {
          createNotification(submitData, (res) => {
            if (res.status === 1) {
                notification.success({
                    message: t(`Notification`),
                    description: `Create notification successful.`,
                    placement: `bottomRight`,
                    duration: 1.5,
                });
            } else {
                notification.error({
                    message: t(`Notification`),
                    description: t(`${res.message}`),
                    placement: `bottomRight`,
                    duration: 1.5,
                });
              }
          })
        },
        onCancel() {
            notification.info({
                message: t(`Notification`),
                description: t(`Stop create notification`),
                placement: `bottomRight`,
                duration: 1.5,
            });
        },
        centered: true,
    });
  }

  return (
    <CRow>
      <CCol xs="12" md="6" className="mb-4">
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            {t("New app update")}
          </CCardHeader>
          <CCardBody>
            <Space
                direction="vertical"
                size="middle"
                style={{
                  display: 'flex',
                }}
              >
                <Form
                    form={form}
                    {...formItemLayout}
                    onFinish={handleNewAppUpdate}
                >
                  <Form.Item
                      label={t("Title")}
                      labelAlign="left"
                      name="title"
                      rules={
                          [{
                              required: true,
                              message: t("Please input title!"),
                          },]
                      }
                  >
                      <Input placeholder={t('Please input title')} />
                  </Form.Item>
                  <Form.Item
                      label={t("Content")}
                      labelAlign="left"
                      name="content"
                      rules={
                          [{
                              required: true,
                              message: t("Please input content!"),
                          },]
                      }
                  >
                      <Input placeholder={t('Please input content')} />
                  </Form.Item>
                  <Button 
                    type="primary"
                    block
                    htmlType="submit"
                  >
                    Thông báo cập nhật ứng dụng
                  </Button>
                </Form>
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="6" className="mb-4">
        <CCard>
          <CCardHeader>{t("New campaign")}</CCardHeader>
          <CCardBody>
            <Space
                direction="vertical"
                size="middle"
                style={{
                  display: 'flex',
                }}
              >
                <Form
                    form={form1}
                    {...formItemLayout}
                    onFinish={handleNewCampaign}
                >
                  <Form.Item
                      label={t("Title")}
                      labelAlign="left"
                      name="title"
                      rules={
                          [{
                              required: true,
                              message: t("Please input title!"),
                          },]
                      }
                  >
                      <Input placeholder={t('Please input title')} />
                  </Form.Item>
                  <Form.Item
                      label={t("Content")}
                      labelAlign="left"
                      name="content"
                      rules={
                          [{
                              required: true,
                              message: t("Please input content!"),
                          },]
                      }
                  >
                      <Input placeholder={t('Please input content')} />
                  </Form.Item>
                  <Button 
                    type="primary"
                    block
                    htmlType="submit"
                  >
                    Thông báo thêm chiến dịch mới
                  </Button>
                </Form>
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default withNamespaces()(AddNotification);