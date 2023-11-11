import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Button,
  Modal,
  Form,
  Input,
  notification,
} from "antd";
import { useSelector } from "react-redux";
import {
  deleteVoucher,
  getVoucherDetails,
  updateVoucher,
} from "src/services/voucher";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from "moment";

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


const VoucherDetail = ({ match, t }) => {

  function onChange(date, dateString) {}

  const [form] = Form.useForm();
  const history = useHistory();
  const [voucher, setData] = useState();

  useEffect(() => {
    getVoucherDetails(match.params.id, (res) => {

      if (res.status === 1) {
        console.log('res.data',res.data)
        setData(res.data);
        form.setFieldsValue({
          voucher_name: res.data.voucherDetail.voucher_name,
          voucher_code: res.data.voucherDetail.voucher_code,
          description: res.data.voucherDetail.description,
          // description: (res.data.description === undefined) ? '' : res.data.voucherDetail.description,
          amount: res.data.voucherDetail.amount,
          start_at: moment(res.data.voucherDetail.start_at, "DD/MM/YYYY"),
          end_at: moment(res.data.voucherDetail.end_at, "DD/MM/YYYY"),
          min_order_value: res.data.voucherDetail.min_order_value,
        });
        console.log('form data res', form.voucher_name)
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get voucher failed.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);

  const handleDeleteVoucher = (values) => {
    const voucher_id = match.params.id;
    Modal.confirm({
      title: t(`Delete Voucher`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to delete this voucher? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        deleteVoucher(voucher_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: t(`Delete voucher successful.`),
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/vouchers");
          } else {
            notification.error({
              message: t(`Notification`),
              description: t(`Delete voucher failed.`),
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop delete voucher`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  }
  const onFinish = (values) => {
    const voucher_id = match.params.id;
    // console.log('voucher_id',voucher_id)
    var submitData = {
      voucher_name: values.voucher_name,
      voucher_code: values.voucher_code,
      // description: values.description,
      description: (values.description === undefined) ? '' : values.description,
      amount: values.amount,
      start_at: values.start_at,
      end_at: values.end_at,
      min_order_value: values.min_order_value,
    };
    Modal.confirm({
      title: t(`Update Voucher`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this voucher? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateVoucher(voucher_id, submitData, (res) => {
          console.log('voucher_id', submitData)
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: t(`Update voucher successful.`),
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/vouchers");
          } else {
            notification.error({
              message: t(`Notification`),
              description: t(`Update voucher failed.`),
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update voucher`),
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
            {t("Voucher Detail")}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={onFinish} >
            <Form.Item
                                label={t("Voucher Name")}
                                labelAlign="left"
                                name="voucher_name"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input voucher name!"),
                                    },]
                                }
                            >
                                <Input placeholder={t('Please input voucher name')} />
                            </Form.Item>
                            <Form.Item
                                label={t("Voucher Code")}
                                labelAlign="left"
                                name="voucher_code"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input voucher code!"),
                                    },]
                                }
                            >
                                <Input placeholder={t('Please input voucher code')} />
                            </Form.Item>
                            <Form.Item
                                label={t("Description")}
                                labelAlign="left"
                                name="description"
                                rules={
                                  [{
                                      required: true,
                                      message: t("Please input description"),
                                  },]
                              }
                            >
                                <Input placeholder={t('Please input description')} />
                            </Form.Item>
                            <Form.Item
                                label={t("Amount")}
                                labelAlign="left"
                                name="amount"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input amount!"),
                                    },]
                                }
                            >
                                <Input placeholder={t('Please input amount')} />
                            </Form.Item>
                            

                            <Form.Item
                                label={t("Date of application")}
                                labelAlign="left"
                                name="start_at"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input date of application!"),
                                    },]
                                }
                            >
                                <DatePicker format="DD/MM/YYYY" onChange={onChange} placeholder={t('Please input date of application')} />
                            </Form.Item>
                            <Form.Item
                                label={t("End date")}
                                labelAlign="left"
                                name="end_at"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input end date!"),
                                    },]
                                }
                            >
                                <DatePicker format="DD/MM/YYYY" onChange={onChange} placeholder={t('Please input date of application')} />
                            </Form.Item>

                            

                            <Form.Item
                                label={t("Conditions apply")}
                                labelAlign="left"
                                name="min_order_value"
                                rules={
                                  [{
                                      required: true,
                                      message: t("Please input conditions apply"),
                                  },]
                              }
                            >
                                <Input placeholder={t('Please input conditions apply')} />
                            </Form.Item>
              <Button type="primary" block htmlType="submit">
                {t("Update")}
              </Button>
            </Form>
              <br />
              <Button
                type="primary" 
                block
                htmlType="button"
                onClick={handleDeleteVoucher}
              >
                {t("Delete")}
              </Button>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(VoucherDetail);
