import React, { useState, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import { Table, Space, Button, Modal, Form, Input, Select, notification, Upload, Avatar, Radio } from 'antd';
import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CCardHeader
} from '@coreui/react';
import { getAddressLabelDetail, updateAddressLabel, deleteAddressLabel } from 'src/services/addressLabel';
import {
    ExclamationCircleOutlined,
    UploadOutlined,
    PlusSquareOutlined,
  } from "@ant-design/icons";
import { useSelector } from "react-redux"
import { getDistrictByProvinces } from "src/services/district"
import { useHistory } from "react-router"

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

const AddressLabel = ({ match, t }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState()
    const province = useSelector((state) => state.provinces);
    const [currentProvince, setCurrentProvince] = useState(-1);
    const [district, setDistrict] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (currentProvince != -1) {
          getDistrictByProvinces(currentProvince, (res) => {
            setDistrict(res.data.district_list);
            form.setFieldsValue({
              ...data,
              province_id: currentProvince,
              district_id: res.data.district_list[0].id,
            });
          });
        }
      }, [currentProvince]);

    useEffect(() => {
        getAddressLabelDetail(match.params.id, (res) => {
            if (res.status === 1) {
                setData(res.data.address_label)
                const province_id = res.data.address_label.province_id == 0 ? 1 : res.data.address_label.province_id
                getDistrictByProvinces(province_id, (response) => {
                    setDistrict(response.data.district_list);
                    form.setFieldsValue({
                        address_label: res.data.address_label.address_label,
                        district_id: res.data.address_label.district_id==0 ? 1 : res.data.address_label.district_id,
                        province_id: province_id,
                        latLong: `${res.data.address_label.lat}, ${res.data.address_label.long}`,
                    });
                  });
            } else {
            notification.error({
                message: t(`Notification`),
                description: `Get Address Label failed.`,
                placement: `bottomRight`,
                duration: 1.5,
            });
            }
        });
        }, []);

    const onFinish = (values) => {
        const id = match.params.id;
        // console.log(values);
        var submitData = {
            address_label: values.address_label,
            district_id: values.district_id,
            province_id: values.province_id,
            lat: values.latLong.split(', ')[0],
            long: values.latLong.split(', ')[1]
        };
        // console.log(submitData);
        Modal.confirm({
            title: t(`Update Customer`),
            icon: <ExclamationCircleOutlined />,
            content: t(
            `You are going to update this customer? Are you sure you want to do this? You can't reverse this`
            ),
            onOk() {
                updateAddressLabel(id, submitData, (res) => {
                if (res.status === 1) {
                    notification.success({
                        message: t(`Notification`),
                        description: `Update customer successful.`,
                        placement: `bottomRight`,
                        duration: 1.5,
                    });
                    history.push(`/customers/${data?.customer_id}`)
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
                description: t(`Stop update customer`),
                placement: `bottomRight`,
                duration: 1.5,
            });
            },
            centered: true,
        });
        };

    const handleDeleteAddressLabel = () => {
        
        const id = match.params.id;
        Modal.confirm({
          title: t(`Remove Flight`),
          icon: <ExclamationCircleOutlined />,
          content: t(
            `You are going to remove this flight? Are you sure you want to do this? You can't reverse this`
          ),
          onOk() {
            deleteAddressLabel(id, (res) => {
              if (res.status === 1) {
                notification.success({
                  message: t(`Notification`),
                  description: `Remove address label successful.`,
                  placement: `bottomRight`,
                  duration: 1.5,
                });
                history.push(`/customers/${data?.customer_id}`)
              } else {
                notification.error({
                  message: t(`Notification`),
                  description: `Remove address label failed.`,
                  placement: `bottomRight`,
                  duration: 1.5,
                });
              }
            });
          },
          onCancel() {
            notification.info({
              message: t(`Notification`),
              description: t(`Stop remove address label`),
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
                <CCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    {t("Address label Detail")}
                </CCardHeader>
                <CCardBody>
                    <Form form={form} {...formItemLayout} onFinish={onFinish}>
                        <Form.Item
                            name="province_id"
                            style={{ marginTop: "15px !important" }}
                            label={t("Province")}
                            labelAlign="left"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
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
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
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
                            name="address_label"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input home address!"),
                                },
                            ]}
                        >
                            <Input placeholder={t("Please input home address")} />
                        </Form.Item>
                        <Form.Item
                            label={t("Lat Long")}
                            labelAlign="left"
                            name="latLong"
                            rules={[
                            {
                                required: true,
                                message: t("Please input lat!"),
                            },
                            ]}
                        >
                            <Input placeholder={t("Please input lat")} />
                        </Form.Item>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{
                                display: 'flex',
                            }}
                        >
                            <Button type="primary" block htmlType="submit">
                                {t("Update")}
                            </Button>
                            <Button type="default" block htmlType="button" onClick={handleDeleteAddressLabel}>
                                {t("Delete")}
                            </Button>
                        </Space>
                    </Form>
                </CCardBody>
            </CCard>
        </CCol>

    </CRow>
  )
}

export default withNamespaces()(AddressLabel)