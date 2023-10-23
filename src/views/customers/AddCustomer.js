import React, { useEffect, useState } from 'react';
import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CCardHeader
} from '@coreui/react';
import { getDistrictByProvinces } from "src/services/district";
import {
    // Roles,
    // Status,
    // Type,
    // Domain
    Validate
} from 'src/configs';
import { Table, Space, Button, Modal, Form, Input, Select, notification, Upload, Avatar, Radio } from 'antd';
import { useSelector } from 'react-redux';
import { createCustomer } from 'src/services/customer';
import { ExclamationCircleOutlined, UploadOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { withNamespaces } from 'react-i18next';
import { useHistory } from 'react-router';
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

const AddCustomer = ({ t }) => {
    const [form] = Form.useForm();
    const history = useHistory();

    const province = useSelector((state) => state.provinces);
    const [currentProvince, setCurrentProvince] = useState(-1);
    const [district, setDistrict] = useState([]);
    // const [customer, setData] = useState();
    // const [avatarURL, setAvatarURL] = useState();
    // const [avatarUpload, setAvatarUpload] = useState()
    // const car_types = useSelector(state => state.carTypes)

    // const handleUploadAvatar = (e) => {
    //     const formData = new FormData()
    //     formData.append(
    //         'customer_avatar',
    //         e.file,
    //         e.file.name
    //     )
    //     updateAvatar(match.params.id, formData, (res) => {
    //         if (res.status === 1) {
    //             setAvatarURL(res.data.path)
    //             notification.success({
    //                 message: t(`Notification`),
    //                 description: `Avatar upload successful!`,
    //                 placement: `bottomRight`,
    //                 duration: 1.5,
    //             });
    //         } else {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `Avatar upload failed!`,
    //                 placement: `bottomRight`,
    //                 duration: 1.5,
    //             });
    //         }
    //     })
    // }

    // const beforeUpload = (file) => {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isPNG = file.type === 'image/jpeg';
    //     const isLt5M = file.size / 1024 / 1024 < 5;
    //     if (!isJPG && !isPNG) {
    //         notification.warning({
    //             message: t(`Notification`),
    //             description: `You can only upload JPG or PNG file!`,
    //             placement: `bottomRight`,
    //             duration: 3.5,
    //         });
    //     }
    //     if (!isLt5M) {
    //         notification.warning({
    //             message: t(`Notification`),
    //             description: `Image must smaller than 5MB!`,
    //             placement: `bottomRight`,
    //             duration: 3.5,
    //         });
    //     }
    //     return (isJPG || isPNG) && isLt5M
    // }
    // useEffect(() => {
    //     getCustomerDetails(match.params.id, (res) => {
    //         if (res.status === 1) {
    //             setData(res.data.customer);
    //             setAvatarURL(res.data.customer.avatar)
    //             form.setFieldsValue({
    //                 name: res.data.customer.name,
    //                 phone: res.data.customer.phone,
    //                 home_address: res.data.customer.home_address,
    //                 office_address: res.data.customer.office_address,
    //                 other_address: res.data.customer.other_address,
    //                 was_agency: res.data.customer.was_agency
    //             })
    //         } else {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `Get Driver failed.`,
    //                 placement: `bottomRight`,
    //                 duration: 1.5,
    //             });
    //         }
    //     })
    // }, []);

    useEffect(() => {
        if (currentProvince != -1) {
          getDistrictByProvinces(currentProvince, (res) => {
            setDistrict(res.data.district_list);
          });
        }
      }, [currentProvince]);

    const onFinish = (values) => {
        // const customer_id = match.params.id
        // console.log(values);
        var submitData = {
            name: values.name,
            phone: values.phone,
            home_address: values.home_address,
            office_address: (values.office_address === undefined) ? '' : values.office_address,
            other_address: (values.other_address === undefined) ? '' : values.other_address,
            is_agency: values.was_agency,
            district_id: values.district_id,
            province_id: values.province_id,
        }
        console.log(submitData);
        Modal.confirm({
            title: t(`Create Customer`),
            icon: <ExclamationCircleOutlined />,
            content: t(`You are going to create this customer? Are you sure you want to do this? You can't reverse this`),
            onOk() {
                createCustomer(submitData, (res) => {
                    if (res.status === 1) {
                        notification.success({
                            message: t(`Notification`),
                            description: `Create customer successful.`,
                            placement: `bottomRight`,
                            duration: 1.5,
                        });
                        // setIsFinalUpdate(true)
                        history.push('/customers');
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
                    description: t(`Stop create customer`),
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
                        {t("Customer Detail")}
                    </CCardHeader>
                    <CCardBody>
                        <Form
                            form={form}
                            {...formItemLayout}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label={t("Customer Name")}
                                labelAlign="left"
                                name="name"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input customer name!"),
                                    },]
                                }
                            >
                                <Input placeholder={t('Please input customer name')} />
                            </Form.Item>
                            <Form.Item
                                label={t("Phone")}
                                labelAlign="left"
                                name="phone"
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value) {
                                                let regex_phone = new RegExp(Validate.REGEX_PHONE);
                                                if (regex_phone.test(value)) {
                                                    return Promise.resolve();
                                                } else {
                                                    return Promise.reject(new Error(t('Please enter a valid phone number!')));
                                                }
                                            } else {
                                                return Promise.reject(new Error(t('Please input a phone number!')));
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder={t('Please input customer phone')} />
                            </Form.Item>

                            <Form.Item
                                label={t("Was Agency")}
                                labelAlign="left"
                                name="was_agency"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please choose your status!"),
                                    },]
                                }
                            >
                                <Radio.Group

                                >
                                    <Radio value={1} > {t("Yes")} </Radio>
                                    <Radio value={0} > {t("No")} </Radio>
                                </Radio.Group>
                            </Form.Item>
                            
							<Form.Item
                                name="province_id"
                                style={{ marginTop: "15px !important" }}
                                label={t("Province")}
                                labelAlign="left"
                            >
                                <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select province"
                                optionFilterProp="province_id"
                                filterOption={(input, option) => {
                                    if (option.children) {
                                    return (
                                        option.children[0]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    );
                                    } else {
                                    return true;
                                    }
                                }}
                                onChange={(e) => setCurrentProvince(e)}
                                >
                                {province.map((item, index) => (
                                    <Select.Option value={item.id} key={index}>
                                    {item.name}{" "}
                                    </Select.Option>
                                ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="district_id"
                                style={{ marginTop: "15px !important" }}
                                label={t("District")}
                                labelAlign="left"
                            >
                                <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select district"
                                optionFilterProp="district_id"
                                onChange={(e) => console.log(e)}
                                filterOption={(input, option) => {
                                    if (option.children) {
                                    return (
                                        option.children[0]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    );
                                    } else {
                                    return true;
                                    }
                                }}
                                >
                                {district.map((item, index) => (
                                    <Select.Option value={item.id} key={index}>
                                    {item.name}{" "}
                                    </Select.Option>
                                ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={t("Home")}
                                labelAlign="left"
                                name="home_address"
                                rules={
                                    [{
                                        required: true,
                                        message: t("Please input home address!"),
                                    },]
                                }
                            >
                                <Input placeholder={t('Please input home address')} />
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

export default withNamespaces()(AddCustomer)