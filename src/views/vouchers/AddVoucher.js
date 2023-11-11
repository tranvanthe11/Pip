import React, { useEffect, useState } from 'react';
import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CCardHeader
} from '@coreui/react';
import { getDistrictByProvinces } from "src/services/district";

import {  Button, Modal, Form, Input,  notification } from 'antd';
import { useSelector } from 'react-redux';
import { createVoucher } from 'src/services/voucher';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { withNamespaces } from 'react-i18next';
import { useHistory } from 'react-router';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';



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

const AddVoucher = ({ t }) => {
    function onChange(date, dateString) {}


    const [form] = Form.useForm();
    const history = useHistory();

    

    const onFinish = (values) => {
        var submitData = {
            voucher_name: values.voucher_name,
            voucher_code: values.voucher_code,
            description: values.description,
            // description: (values.description === undefined) ? '' : values.description,
            amount: values.amount,
            start_at: values.start_at,
            end_at: values.end_at,
            min_order_value:values.min_order_value,
        }
        Modal.confirm({
            title: t(`Create voucher`),
            icon: <ExclamationCircleOutlined />,
            content: t(`You are going to create this voucher ? Are you sure you want to do this? You can't reverse this`),
            onOk() {
                console.log('submitData',submitData)
                createVoucher(submitData, (res) => {
                    if (res.status === 1) {
                        notification.success({
                            message: t(`Notification`),
                            description: t(`Create voucher successful.`),
                            placement: `bottomRight`,
                            duration: 1.5,
                        });
                        // setIsFinalUpdate(true)
                        history.push('/vouchers');
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
                    description: t(`Stop create voucher`),
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
                    <CCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        {t("Voucher Detail")}
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={form}
                            {...formItemLayout}
                            onFinish={onFinish}
                        >
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
                                <DatePicker 
                                    format="DD/MM/YYYY"
                                    onChange={onChange}
                                    placeholder="Please input date of application!"
                                />
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
                                <DatePicker 
                                    format="DD/MM/YYYY"
                                    onChange={onChange}
                                    placeholder="Please input end date"
                                />
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
                    
                            <Button
                                type="primary"
                                block
                                htmlType="submit"
                            >
                                {t("Create")}
                            </Button>
                        </Form>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default withNamespaces()(AddVoucher)