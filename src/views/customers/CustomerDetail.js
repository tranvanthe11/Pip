import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { getDistrictByProvinces } from "src/services/district";
import // Roles,
// Status,
// Type,
// Domain
// Validate
"src/configs";
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
  Radio,
} from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateCustomer,
  getCustomerDetails,
  updateCustomerLevel,
} from "src/services/customer";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
import { add } from "lodash";
import { deleteAddressLabel } from "src/services/addressLabel";
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

const CustomerDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [customer, setData] = useState();
  const province = useSelector((state) => state.provinces);
  const [currentProvince, setCurrentProvince] = useState(-1);
  const [district, setDistrict] = useState([]);
  const [level, setLevel] = useState(0);
  const [type, setType] = useState(1);
  const [addressLabel, setAddressLabel] = useState([]);
  let key = -1;

  const services = useSelector((state) => state.services);

  useEffect(() => {
    if (currentProvince != -1) {
      getDistrictByProvinces(currentProvince, (res) => {
        setDistrict(res.data.district_list);
        form.setFieldsValue({
          province_id: currentProvince,
          district_id: res.data.district_list[0].id,
        });
      });
    }
  }, [currentProvince]);
  useEffect(() => {
    let key = 0;
    getCustomerDetails(match.params.id, (res) => {
      if (res.status === 1) {
        res.data.customer.list_address_label.forEach((customer) => {
          customer.key = key++;
        });
        setData(res.data.customer);
        setAddressLabel(res.data.customer.list_address_label);
        getDistrictByProvinces(res.data.customer.province_id, (response) => {
          setDistrict(response.data.district_list);
          form.setFieldsValue({
            name: res.data.customer.name,
            phone: res.data.customer.phone,
            home_address: res.data.customer.home_address,
            office_address: "",
            other_address: "",
            was_agency: res.data.customer.was_agency,
            province_id: res.data.customer.province_id,
            district_id: res.data.customer.district_id,
          });
        });
        if (res.data.customer.level) setLevel(res.data.customer.level);
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get Customer failed.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);

  const onFinish = (values) => {
    const customer_id = match.params.id;
    console.log(values);
    var submitData = {
      name: values.name,
      home_address: values.home_address,
      is_agency: values.was_agency,
      office_address: "",
      other_address: "",
      district_id: values.district_id,
      province_id: values.province_id,
    };
    // console.log(submitData);
    Modal.confirm({
      title: t(`Update Customer`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this customer? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateCustomer(customer_id, submitData, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update customer successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/customers");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update customer failed.`,
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

  const showSetLevelPopup = (oldLevel) => {
    var level = oldLevel;

    Modal.confirm({
      title: t(`Update Customer Level`),
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form>
          <Form.Item label={t("Level")} labelAlign="left" name="level">
            <Radio.Group
              defaultValue={oldLevel}
              onChange={(e) => {
                level = e.target.value;
              }}
            >
              <Radio value={0}> {t("0")} </Radio>
              <Radio value={1}> {t("1")} </Radio>
              <Radio value={2}> {t("2")} </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      ),
      onOk() {
        const customer_id = match.params.id;
        updateCustomerLevel(customer_id, { level }, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update customer level successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            setLevel(level);
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update customer level failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update customer level`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };

  const handleDeleteAddressLabel = (id, address_label) => {
    Modal.confirm({
      title: t(`Remove Address Label`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to remove this address label? Are you sure you want to do this? You can't reverse this`
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
            const a1 = addressLabel.slice(0, address_label.key);
            const a2 = addressLabel.slice(
              address_label.key + 1,
              addressLabel.length
            );
            a2.forEach((address) => {
              address.key = address.key - 1;
            });
            const result = a1.concat(a2);
            setAddressLabel(result);
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

  const columns = [
    {
      title: t("Address"),
      dataIndex: "address_label",
      render: (address) => <>{address}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Action"),
      dataIndex: "_id",
      render: (_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/customers/address-label/${_id}`}>{t("Detail")}</Link>
            </Space>
          </>
        );
      },
    },
    {
      title: t("Delete"),
      dataIndex: "_id",
      render: (_id, address_label) => {
        return (
          <>
            <Button
              type="primary"
              htmlType="button"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAddressLabel(_id, address_label);
              }}
            >
              {t("Delete")}
            </Button>
          </>
        );
      },
    },
    {
      title: t("Create contract"),
      dataIndex: "_id",
      render: (_id, address) => {
        return (
          <>
            <Space
              direction="horizontal"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Select
                placeholder={t("Contract type")}
                onChange={(value) => setType(value)}
                defaultValue={1}
              >
                {services.map((service) => (
                  <Select.Option value={service.name_id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
              <Button size="middle" type="primary">
                <Link
                  to={{
                    pathname: `/contracts/create`,
                    state: {
                      customer_id: match.params.id,
                      type: type,
                      address: address,
                    },
                  }}
                >
                  {t("Create contract")}
                </Link>
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <CRow>
      <CCol xs="12" md="8" className="mb-4">
        <CCard>
          <CCardHeader
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            {t("Customer Detail")}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={onFinish}>
              <Form.Item
                label={t("Customer Name")}
                labelAlign="left"
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please input customer name!"),
                  },
                ]}
              >
                <Input placeholder={t("Please input customer name")} />
              </Form.Item>
              <Form.Item label={t("Phone")} labelAlign="left" name="phone">
                {customer ? (
                  <span>{customer.phone}</span>
                ) : (
                  <span>{t("EMPTY")}</span>
                )}
              </Form.Item>

              <Form.Item
                label={t("Was Agency")}
                labelAlign="left"
                name="was_agency"
              >
                <Radio.Group>
                  <Radio value={1}> {t("Yes")} </Radio>
                  <Radio value={0}> {t("No")} </Radio>
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
                rules={[
                  {
                    required: true,
                    message: t("Please input home address!"),
                  },
                ]}
              >
                <Input placeholder={t("Please input home address")} />
              </Form.Item>
              <Form.Item label={t("Level")} labelAlign="left" name="level">
                {customer ? <span>{level}</span> : <span>{t("EMPTY")}</span>}
              </Form.Item>
              <Form.Item label={t("OTP")} labelAlign="left" name="level">
                {customer ? (
                  <span>{customer.otp}</span>
                ) : (
                  <span>{t("EMPTY")}</span>
                )}
              </Form.Item>
              <Space
                direction="vertical"
                size="middle"
                style={{
                  display: "flex",
                }}
              >
                <Button type="primary" block htmlType="submit">
                  {t("Update")}
                </Button>
                <Button
                  type="default"
                  block
                  htmlType="button"
                  onClick={() => {
                    showSetLevelPopup(level);
                  }}
                >
                  {t("Update level")}
                </Button>
              </Space>
            </Form>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>{t("Address label")}</CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Table
                className="overflow-auto"
                columns={columns}
                dataSource={addressLabel}
                rowKey={(record) => record.id}
              />
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="4" className="mb-4">
        <CCard>
          <CCardHeader>{t("Create contract")}</CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Select
                placeholder={t("Contract type")}
                onChange={(value) => setType(value)}
                defaultValue={1}
                style={{ width: "100%" }}
              >
                {services.map((service) => (
                  <Select.Option value={service.name_id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
              <Button type="primary" block htmlType="button">
                <Link
                  to={{
                    pathname: `/contracts/create`,
                    state: { customer_id: match.params.id, type: type },
                  }}
                >
                  {t("Create contract")}
                </Link>
              </Button>
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(CustomerDetail);
