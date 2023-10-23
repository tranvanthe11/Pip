import React, {
  useEffect,
  // useEffect,
  useState,
} from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Modal,
  Radio,
  notification,
  DatePicker,
  Avatar,
  Divider,
  Descriptions,
  Empty,
} from "antd";
import {
  // FastBackwardFilled,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  // Roles,
  // Status,
  Type,
  // Validate
} from "src/configs";
import {
  // searchDriver,
  searchCustomer,
  createContract,
} from "src/services/contract";
import { useSelector } from "react-redux";
// import { getListDrivers } from 'src/services/host';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
// import CIcon from '@coreui/icons-react';
import "./customForm.css";
import { useHistory } from "react-router";
import { getCustomerDetails } from "src/services/customer";
import { getContractDetail } from "src/services/contract";
// import { Redirect } from 'react-router-dom';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function disabledDate(current) {
  return current && current < moment().endOf("day");
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 8 },
  },
};

// const { Option } = Select;

const CreateContract = (props) => {
  const { t } = props;
  const history = useHistory();
  const [form] = Form.useForm();

  // const [otherPickup, setOtherPickup] = useState([]);
  // const [otherDropOff, setOtherDropOff] = useState([]);
  // const [otherPayment, setOtherPayment] = useState([]);
  // const [contract, setContract] = useState();
  // const [listDrivers, setListDrivers] = useState();
  // const [driverResult, setDriverResult] = useState();
  const [customerSearch, setCustomerSearch] = useState();
  const [customerResult, setCustomerResult] = useState();
  const [noCustomerSearch, setNoCustomerSearch] = useState(false);

  // const [noDriver, setNoDriverResult] = useState(false)
  // const [visible, setVisible] = useState(false)
  const [contractDisable, setContractDisable] = useState(false);
  // const [carTypeCheck, setCarTypeCheck] = useState()
  const [serviceTypeCheck, setServiceTypeCheck] = useState();
  const [paymentTypeCheck, setPaymentTypeCheck] = useState();
  const [customerSearchDone, setCustomerSearchDone] = useState(false);
  // const [isFinalUpdate, setIsFinalUpdate] = useState(false)

  const car_types = useSelector((state) => state.carTypes);
  const airports = useSelector((state) => state.airports);
  const services = useSelector((state) => state.services);

  useEffect(() => {
    let info = props.location.state;
    if (info) {
      console.log(info);
      if (info?.customer_id && info?.type) {
        const _id = info.customer_id;
        const service_type = info.type;
        getCustomerDetails(_id, (res) => {
          if (res.status === 1) {
            const user = res.data.customer;
            setServiceTypeCheck(service_type);
            setPaymentTypeCheck(Type.PREPAY.id);
            service_type == 1 &&
              form.setFieldsValue({
                service_type: service_type,
                car_type: 1,
                pickup_location_list: [
                  {
                    location: info?.address
                      ? `${info?.address.address_label}`
                      : user.home_address,
                  },
                ],
                drop_off_location: airports[0].name,
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            service_type == 2 &&
              form.setFieldsValue({
                service_type: service_type,
                car_type: 1,
                pickup_location: airports[0].name,
                drop_off_location_list: [
                  {
                    location: info?.address
                      ? `${info?.address.address_label}`
                      : user.home_address,
                  },
                ],
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            (service_type == 3 || service_type == 4 || service_type == 5) &&
              form.setFieldsValue({
                service_type: service_type,
                car_type: 1,
                pickup_location_list: [
                  {
                    location: info?.address
                      ? `${info?.address.address_label}`
                      : user.home_address,
                  },
                ],
                drop_off_location_list: [
                  {
                    location: "",
                  },
                ],
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            setCustomerResult([
              {
                customer_id: user._id,
                customer_phone: user.phone,
                customer_name: user.name,
                type: 1,
              },
            ]);
            setCustomerSearch(null);
            setCustomerSearchDone(true);
          } else {
            console.log("error");
          }
        });
      } else if (info?.contract_id) {
        getContractDetail(info?.contract_id, (res) => {
          if (res.data.contract && res.status === 1) {
            const contract = res.data.contract;
            const listDes = [];
            const listPick = [];
            const service_type = contract.service_type;

            for (
              let i = contract.contract_destination.length - 1;
              i >= 0;
              i--
            ) {
              if (contract.contract_destination[i].type == 1)
                listPick.push({
                  location: contract.contract_destination[i].location,
                });
              else
                listDes.push({
                  location: contract.contract_destination[i].location,
                });
            }

            if (service_type == 1) {
              setServiceTypeCheck(2);
              setPaymentTypeCheck(Type.PREPAY.id);
              form.setFieldsValue({
                service_type: 2,
                car_type: 1,
                pickup_location: airports[0].name,
                drop_off_location_list: listPick,
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            } else if (service_type == 2) {
              setServiceTypeCheck(1);
              setPaymentTypeCheck(Type.PREPAY.id);
              form.setFieldsValue({
                service_type: 1,
                car_type: 1,
                pickup_location_list: listDes,
                drop_off_location: airports[0].name,
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            } else {
              setServiceTypeCheck(service_type);
              setPaymentTypeCheck(Type.PREPAY.id);
              form.setFieldsValue({
                service_type: service_type,
                car_type: 1,
                pickup_location_list: listDes,
                drop_off_location_list: listPick,
                vat: 0,
                payment_type: Type.PREPAY.id,
                contract_payment: [
                  {
                    payment_method: 1,
                    amount: 0,
                    payment_status: 0,
                  },
                ],
              });
            }
            setCustomerResult(contract.contract_customer);
            setCustomerSearch(null);
            setCustomerSearchDone(true);
          } else {
            console.log("error");
          }
        });
      }
    }
  }, []);

  console.log("contract", form.getFieldValue());

  const onChangePaymentType = (value) => {
    setPaymentTypeCheck(value);
    switch (value) {
      case Type.PREPAY.id:
        form.setFieldsValue({
          contract_payment: [
            {
              payment_method: 0,
              amount: 0,
              payment_status: 0,
            },
          ],
        });
        break;

      case Type.POSTPAID.id:
        form.setFieldsValue({
          contract_payment: [
            {
              payment_method: 0,
              amount: 0,
              payment_status: 0,
            },
          ],
        });
        break;
      case Type.INSTALMENT_PAYMENT.id:
        form.setFieldsValue({
          contract_payment: [
            {
              payment_method: 0,
              amount: 0,
              payment_status: 0,
            },
            {
              payment_method: 0,
              amount: 0,
              payment_status: 0,
            },
          ],
        });
        break;
      default:
        notification.error({
          message: t(`Notification`),
          description: `Payment type is undefined`,
          placement: `bottomRight`,
          duration: 1.5,
        });
        break;
    }
  };
  const onChangeServiceType = (value) => {
    setServiceTypeCheck(value);
    switch (value) {
      case 1:
        form.setFieldsValue({
          pickup_location_list: [
            {
              location: "",
            },
          ],
        });
        break;
      case 2:
        form.setFieldsValue({
          drop_off_location_list: [
            {
              location: "",
            },
          ],
        });
        break;
      case 3:
      case 4:
      case 5:
        form.setFieldsValue({
          pickup_location_list: [
            {
              location: "",
            },
          ],
          drop_off_location_list: [
            {
              location: "",
            },
          ],
        });
        break;
      default:
        break;
    }
  };
  const onChangeCarType = (value) => {};

  const handleSearchCustomer = (value) => {
    setCustomerSearch(null);
    setCustomerSearchDone(false);
    var isExist = false;
    if (customerResult) {
      for (let i = 0; i < customerResult.length; i++) {
        if (customerResult[i].customer_phone === value) {
          isExist = true;
        }
      }
    }
    if (!isExist) {
      searchCustomer(value, (res) => {
        if (res.status !== 0) {
          setCustomerSearch(res.data.customer);
        } else {
          setNoCustomerSearch(true);
        }
      });
    } else {
      setNoCustomerSearch(true);
      notification.error({
        message: t(`Notification`),
        description: t("Customer is already exist in contract"),
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
  };
  const handleAddCustomer = () => {
    setCustomerResult([
      {
        customer_id: customerSearch._id,
        customer_phone: customerSearch.phone,
        customer_name: customerSearch.name,
        type: 1,
      },
    ]);
    setCustomerSearch(null);
    setCustomerSearchDone(true);
  };
  const handleRemoveCustomer = (event) => {
    const value = event.target.value;
    setCustomerResult(
      customerResult.filter((customer) => customer.customer_id !== value)
    );
  };

  const onFinishContract = (values) => {
    if (customerResult) {
      var destinationListSubmit = [];
      if (serviceTypeCheck) {
        switch (serviceTypeCheck) {
          case 1:
            values.pickup_location_list.forEach((pickup) => {
              destinationListSubmit.push({
                location: pickup.location,
                type: 1,
              });
            });
            destinationListSubmit.push({
              location: values.drop_off_location,
              type: 2,
            });
            break;
          case 2:
            destinationListSubmit.push({
              location: values.pickup_location,
              type: 1,
            });
            values.drop_off_location_list.forEach((drop_off) => {
              destinationListSubmit.push({
                location: drop_off.location,
                type: 2,
              });
            });
            break;
          case 3:
          case 4:
          case 5:
            values.pickup_location_list.forEach((pickup) => {
              destinationListSubmit.push({
                location: pickup.location,
                type: 1,
              });
            });
            values.drop_off_location_list.forEach((drop_off) => {
              destinationListSubmit.push({
                location: drop_off.location,
                type: 2,
              });
            });
            break;
          default:
            break;
        }
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Service type is empty`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
      var paymentsSubmit = [];
      console.log(values);
      values?.contract_payment?.forEach((payment) => {
        paymentsSubmit.push({
          payment_method: payment.payment_method,
          amount: payment.amount,
          payment_status: payment.payment_status,
        });
      });
      let submitData = {
        service_type: values.service_type,
        car_type: values.car_type,
        customer_id: customerResult[0].customer_id,
        pickup_time: values.pickup_time.format("HH:mm DD/MM/YYYY"),
        flight_number:
          serviceTypeCheck === 1 || serviceTypeCheck === 2
            ? values.flight_number
            : "",
        // supplier_id: (driverResult) ? driverResult.supplier_id : '',
        supplier_id: "",
        price: values.price,
        base_price: values.base_price,
        vat: values.vat,
        payment_type: values.payment_type,
        destination_list: destinationListSubmit,
        payments: paymentsSubmit,
        note: values.note,
      };
      // console.log(values);
      console.log(submitData);
      Modal.confirm({
        title: t(`Create Contract`),
        icon: <ExclamationCircleOutlined />,
        content: t(
          `You are going to create this contract? Are you sure you want to do this? You can't reverse this`
        ),
        onOk() {
          createContract(submitData, (res) => {
            if (res.status === 1) {
              notification.success({
                message: t(`Notification`),
                description: `Create Contract successful.`,
                placement: `bottomRight`,
                duration: 1.5,
              });
              // setIsFinalUpdate(true)
              history.push("/contracts");
            } else {
              notification.error({
                message: t(`Notification`),
                description: `Create Contract failed.`,
                placement: `bottomRight`,
                duration: 1.5,
              });
            }
          });
        },
        onCancel() {
          notification.info({
            message: t(`Notification`),
            description: t(`Stop create contract`),
            placement: `bottomRight`,
            duration: 1.5,
          });
        },
        centered: true,
      });
    } else {
      notification.error({
        message: t(`Notification`),
        description: `Please choose customer.`,
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
  };

  return (
    <CRow>
      <CCol xs="12" md="7" className="mb-4">
        <CCard>
          <CCardHeader>{t("Contract Detail")}</CCardHeader>
          <CCardBody>
            <Form
              {...formItemLayout}
              form={form}
              style={{ marginBottom: "0px" }}
              onFinish={onFinishContract}
            >
              <Form.Item
                label={t("Service name")}
                labelAlign="left"
                name="service_type"
              >
                <Select
                  disabled={contractDisable}
                  placeholder={t("Please select a service type")}
                  onChange={onChangeServiceType}
                >
                  {services ? (
                    services.map((service) => (
                      <Select.Option
                        value={service.name_id}
                        key={service.name_id}
                      >
                        {" "}
                        {service.name}{" "}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option>{t("Service type is empty.")}</Select.Option>
                  )}
                </Select>
              </Form.Item>
              {serviceTypeCheck ? (
                <>
                  <Form.Item
                    label={t("Car Type")}
                    labelAlign="left"
                    name="car_type"
                    rules={[
                      {
                        required: true,
                        message: t("Please select a car type"),
                      },
                    ]}
                  >
                    <Select
                      disabled={contractDisable}
                      placeholder={t("Please select a car type")}
                      onChange={onChangeCarType}
                    >
                      {car_types ? (
                        <>
                          {car_types.map((car_type) => (
                            <Select.Option
                              value={car_type.name_id}
                              key={car_type.name_id}
                            >
                              {" "}
                              {car_type.name}{" "}
                            </Select.Option>
                          ))}
                        </>
                      ) : (
                        <Select.Option>{t("Car type is empty.")}</Select.Option>
                      )}
                    </Select>
                  </Form.Item>
                  {serviceTypeCheck && serviceTypeCheck === 2 ? (
                    <Form.Item
                      label={t("Airport")}
                      labelAlign="left"
                      name="pickup_location"
                      rules={[
                        {
                          required: true,
                          message: t("Please select an airport"),
                        },
                      ]}
                    >
                      <Select
                        disabled={contractDisable}
                        placeholder={t("Please select an airport")}
                      >
                        {airports ? (
                          <>
                            {airports.map((airport) => (
                              <Select.Option value={airport.name}>
                                {airport.name}
                              </Select.Option>
                            ))}
                          </>
                        ) : (
                          <Select.Option>
                            {t("Airport is empty.")}
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.List name="pickup_location_list">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => {
                            return (
                              <Form.Item
                                required={false}
                                {...(index === 0
                                  ? formItemLayout
                                  : formItemLayoutWithOutLabel)}
                                key={field.key}
                                style={{ whiteSpace: "nowrap" }}
                                label={index === 0 ? t("Pick up") : ""}
                                labelAlign="left"
                              >
                                <Form.Item
                                  name={[field.name, "location"]}
                                  validateTrigger={["onChange", "onBlur"]}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: t(
                                        "Please input destination or delete this field."
                                      ),
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    disabled={contractDisable}
                                    placeholder={t(
                                      "Please input a pick up destination"
                                    )}
                                  />
                                </Form.Item>
                                {contractDisable ? null : fields.length > 1 ? (
                                  <MinusCircleOutlined
                                    style={{ fontSize: 25, paddingLeft: 8 }}
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </Form.Item>
                            );
                          })}
                          <Form.Item
                            wrapperCol={{
                              xs: { span: 24, offset: 8 },
                            }}
                          >
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              disabled={contractDisable}
                            >
                              {t("Add pick up destination")}
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  )}
                  {serviceTypeCheck && serviceTypeCheck === 1 ? (
                    <Form.Item
                      label={t("Airport")}
                      labelAlign="left"
                      name="drop_off_location"
                      rules={[
                        {
                          required: true,
                          message: t("Please choose an airport"),
                        },
                      ]}
                    >
                      <Select
                        disabled={contractDisable}
                        placeholder={t("Please choose an airport")}
                      >
                        {airports ? (
                          <>
                            {airports.map((airport) => (
                              <Select.Option value={airport.name}>
                                {airport.name}
                              </Select.Option>
                            ))}
                          </>
                        ) : (
                          <Select.Option>
                            {t("Airport is empty.")}
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.List name="drop_off_location_list">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => {
                            return (
                              <Form.Item
                                required={false}
                                {...(index === 0
                                  ? formItemLayout
                                  : formItemLayoutWithOutLabel)}
                                key={field.key}
                                style={{ whiteSpace: "nowrap" }}
                                label={index === 0 ? t("Drop off") : ""}
                                labelAlign="left"
                              >
                                <Form.Item
                                  name={[field.name, "location"]}
                                  validateTrigger={["onChange", "onBlur"]}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: t(
                                        "Please input destination or delete this field."
                                      ),
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input
                                    disabled={contractDisable}
                                    placeholder={t(
                                      "Please input a drop off destination"
                                    )}
                                  />
                                </Form.Item>
                                {contractDisable ? null : fields.length > 1 ? (
                                  <MinusCircleOutlined
                                    style={{ fontSize: 25, paddingLeft: 8 }}
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                  />
                                ) : null}
                              </Form.Item>
                            );
                          })}
                          <Form.Item
                            wrapperCol={{
                              xs: { span: 24, offset: 8 },
                            }}
                          >
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              icon={<PlusOutlined />}
                              disabled={contractDisable}
                            >
                              {t("Add drop off destination")}
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  )}
                  {serviceTypeCheck &&
                  (serviceTypeCheck === 1 || serviceTypeCheck === 2) ? (
                    <Form.Item
                      label={t("Flight Number")}
                      labelAlign="left"
                      name="flight_number"
                      rules={[
                        {
                          required: true,
                          message: t("Please input a flight number"),
                        },
                      ]}
                    >
                      <Input
                        disabled={contractDisable}
                        className="ant-form-text"
                        placeholder={t("Please input a flight number")}
                      />
                    </Form.Item>
                  ) : (
                    <></>
                  )}
                  <Form.Item
                    label={t("Pickup Time")}
                    labelAlign="left"
                    name="pickup_time"
                    rules={[
                      {
                        required: true,
                        message: t("Please choose a pickup time!"),
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      format="HH:mm DD/MM/YYYY"
                      // disabledDate={disabledDate}
                      disabled={contractDisable}
                      placeholder={t("Please input a pick up time")}
                      showTime={{
                        defaultValue: moment("00:00:00", "HH:mm:ss"),
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("Price (VND)")}
                    labelAlign="left"
                    name="price"
                    rules={[
                      {
                        required: true,
                        message: t("Please input price"),
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={t("Please input price")}
                      disabled={contractDisable}
                      formatter={(value) =>
                        value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/,/g, "")}
                      style={{ marginRight: 10, width: "100%" }}
                      min={0}
                      max={1000000000}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("Base Price (VND)")}
                    labelAlign="left"
                    name="base_price"
                    rules={[
                      {
                        required: true,
                        message: t("Please input base price!"),
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={t("Please input base price")}
                      disabled={contractDisable}
                      formatter={(value) =>
                        value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/,/g, "")}
                      style={{ marginRight: 10, width: "100%" }}
                      min={0}
                      max={1000000000}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t("VAT")}
                    labelAlign="left"
                    name="vat"
                    rules={[
                      {
                        required: true,
                        message: t("Please select VAT status"),
                      },
                    ]}
                  >
                    <Radio.Group disabled={contractDisable}>
                      <Radio value={1}> {t("Yes")} </Radio>
                      <Radio value={0}> {t("No")} </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={t("Payment")}
                    labelAlign="left"
                    name="payment_type"
                    rules={[
                      {
                        required: true,
                        message: t("Please input payment type!"),
                      },
                    ]}
                  >
                    <Select
                      disabled={contractDisable}
                      placeholder={t("Please select a payment type")}
                      onChange={onChangePaymentType}
                    >
                      <Select.Option value={Type.PREPAY.id}>
                        {" "}
                        {t(Type.PREPAY.name)}{" "}
                      </Select.Option>
                      <Select.Option value={Type.POSTPAID.id}>
                        {" "}
                        {t(Type.POSTPAID.name)}{" "}
                      </Select.Option>
                      <Select.Option value={Type.INSTALMENT_PAYMENT.id}>
                        {" "}
                        {t(Type.INSTALMENT_PAYMENT.name)}{" "}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  {paymentTypeCheck ? (
                    <Form.List name={["contract_payment"]}>
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <>
                              <Form.Item
                                {...formItemLayoutWithOutLabel}
                                required={false}
                                key={field.key}
                                style={{ display: "flex" }}
                              >
                                <Form.Item
                                  name={[field.name, "amount"]}
                                  validateTrigger={["onChange", "onBlur"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: t(
                                        "Please input payment or delete this field."
                                      ),
                                    },
                                  ]}
                                  label={t(`#${index + 1} (VND)`)}
                                  style={{ width: "90%" }}
                                >
                                  <InputNumber
                                    placeholder={t(
                                      "Please input price per payment"
                                    )}
                                    disabled={contractDisable}
                                    formatter={(value) =>
                                      `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    parser={(value) => value.replace(/,/g, "")}
                                    style={{ marginRight: 10, width: "90%" }}
                                    min={0}
                                    max={1000000000}
                                  />
                                </Form.Item>
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "payment_method"]}
                                label={t("Payment method")}
                                // wrapperCol={
                                //     {
                                //         xs: { span: 30, offset: 8 }
                                //     }
                                // }
                              >
                                <Radio.Group
                                  disabled={contractDisable}
                                  style={{ display: "flex" }}
                                >
                                  <Radio value={Type.TRANSFER_MONEY.id}>
                                    {" "}
                                    {t(Type.TRANSFER_MONEY.name)}{" "}
                                  </Radio>
                                  <Radio value={Type.PAY_IN_CASH.id}>
                                    {" "}
                                    {t(Type.PAY_IN_CASH.name)}{" "}
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                              <Form.Item
                                name={[field.name, "payment_status"]}
                                label={t("Status")}
                              >
                                <Radio.Group disabled={contractDisable}>
                                  <Radio value={Type.PAYMENT_PENDING.id}>
                                    {" "}
                                    {t(Type.PAYMENT_PENDING.name)}{" "}
                                  </Radio>
                                  <Radio value={Type.PAYMENT_SUCCESS.id}>
                                    {" "}
                                    {t(Type.PAYMENT_SUCCESS.name)}{" "}
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                            </>
                          ))}
                        </>
                      )}
                    </Form.List>
                  ) : (
                    <></>
                  )}
                  <Form.Item label={t("Note")} labelAlign="left" name="note">
                    <Input.TextArea
                      disabled={contractDisable}
                      className="ant-form-text"
                    />
                  </Form.Item>
                  <br></br>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Item
                      style={{
                        width: "100%",
                        marginRight: 8,
                      }}
                      wrapperCol={{
                        sm: 24,
                      }}
                    >
                      <Button type="primary" block htmlType="submit">
                        {t("Create")}
                      </Button>
                    </Form.Item>
                  </div>
                </>
              ) : (
                <></>
              )}
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="5" className="mb-4">
        <CCard>
          <CCardHeader>{t("Customers' Info")}</CCardHeader>
          <CCardBody>
            <Input.Search
              disabled={contractDisable}
              size="large"
              placeholder={t("search customer by phone here")}
              enterButton
              onSearch={handleSearchCustomer}
            />
            {customerSearch ? (
              <>
                <Divider />
                <Descriptions title={t("Search result")} bordered>
                  <Descriptions.Item label={t("Customer phone")} span={3}>
                    {customerSearch.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("Customer name")} span={3}>
                    {customerSearch.name}
                  </Descriptions.Item>
                </Descriptions>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 8 }}
                  onClick={handleAddCustomer}
                >
                  {t("Add")}
                </Button>
              </>
            ) : noCustomerSearch === true && customerSearchDone === false ? (
              <Empty />
            ) : (
              <></>
            )}
            {customerResult ? (
              <>
                {customerResult.map((customer) => (
                  <>
                    {customer.type === Type.MAIN_CUSTOMER.id ? (
                      <>
                        <Divider />
                        <Descriptions title={Type.MAIN_CUSTOMER.name} bordered>
                          <Descriptions.Item
                            label={t("Customer phone")}
                            span={3}
                          >
                            {customer.customer_phone}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={t("Customer Name")}
                            span={3}
                          >
                            {customer.customer_name}
                          </Descriptions.Item>
                        </Descriptions>
                        <Divider />
                      </>
                    ) : customer.type === Type.SUB_CUSTOMER.id ? (
                      <>
                        <Descriptions title={Type.SUB_CUSTOMER.name} bordered>
                          <Descriptions.Item
                            label={t("Customer phone")}
                            span={3}
                          >
                            {customer.customer_phone}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={t("Customer Name")}
                            span={3}
                          >
                            {customer.customer_name}
                          </Descriptions.Item>
                        </Descriptions>
                        <Button
                          disabled={contractDisable}
                          type="primary"
                          block
                          value={customer.customer_id}
                          style={{ marginTop: 8 }}
                          onClick={handleRemoveCustomer}
                        >
                          {t("Remove")}
                        </Button>
                        <Divider />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </>
            ) : (
              <></>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(CreateContract);
