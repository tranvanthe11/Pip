import React, { useEffect, useState } from "react";
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
  Space,
} from "antd";
import { Link } from "react-router-dom";
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
  Domain,
  // Validate
} from "src/configs";
import {
  getContractDetail,
  updateContract,
  searchDriver,
  searchCustomer,
  completeContract,
  cancelContract,
  dropContract,
} from "src/services/contract";
import { useSelector } from "react-redux";
// import { getListDrivers } from 'src/services/host';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
// import CIcon from '@coreui/icons-react';
import "./customForm.css";
import { useHistory } from "react-router";
import { ContractStatus } from "src/configs";
import SaleTextHelper from "./SaleTextHelper";
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

const ContractDetail = ({ match, t }) => {
  const history = useHistory();
  const [form] = Form.useForm();

  // const [otherPickup, setOtherPickup] = useState([]);
  // const [otherDropOff, setOtherDropOff] = useState([]);
  // const [otherPayment, setOtherPayment] = useState([]);
  const [contract, setContract] = useState();
  const [listDrivers, setListDrivers] = useState();
  const [driverResult, setDriverResult] = useState();
  const [customerSearch, setCustomerSearch] = useState();
  const [customerResult, setCustomerResult] = useState();
  const [noCustomerSearch, setNoCustomerSearch] = useState(false);

  const [noDriver, setNoDriverResult] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contractDisable, setContractDisable] = useState(false);
  const [carTypeCheck, setCarTypeCheck] = useState();
  const [isFinalUpdate, setIsFinalUpdate] = useState(false);
  const [isDrop, setIsDrop] = useState(false);

  const car_types = useSelector((state) => state.carTypes);
  const airports = useSelector((state) => state.airports);

  const [canUpdate, setCanUpdate] = useState(false);
  const [canPickDriver, setCanPickDriver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);
  const [canComplete, setCanComPlete] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [paymentTypeCheck, setPaymentTypeCheck] = useState();
  const [pickupList, setPickupList] = useState();
  const [destinationList, setDestinationList] = useState();

  useEffect(() => {
    getContractDetail(match.params.id, (res) => {
      if (res.data.contract && res.status === 1) {
        setContract(res.data.contract);
        let pick = "";
        let des = "";
        res.data.contract.contract_destination.forEach((location, index) => {
          if (index != res.data.contract.contract_destination.length - 1) {
            if (location.type == 1) pick += location.location + ",";
            else des += location.location + ",";
          } else {
            if (location.type == 1) pick += location.location + "";
            else des += location.location + "";
          }
        });
        setPickupList(pick);
        setDestinationList(des);
        if (res.data.contract.contract_customer) {
          setCustomerResult(res.data.contract.contract_customer);
        }
        if (
          res.data.contract.contract_status == 4 ||
          res.data.contract.contract_status == 5
        ) {
          setContractDisable(true);
        }
        if (res.data.contract.contract_customer && res.data.contract.supplier) {
          setIsFinalUpdate(true);
        }
        if (res.data.contract.car_type) {
          setCarTypeCheck(res.data.contract.car_type);
        }
        if (res.data.contract.payment_type) {
          setPaymentTypeCheck(res.data.contract.payment_type);
        }

        // let pickup_time = moment(res.data.contract.pickup_time).format('HH:mm DD-MM-YYYY');
        form.setFieldsValue({
          car_type: res.data.contract.car_type,
          flight_number: res.data.contract.flight_number,
          pickup_time: moment(
            res.data.contract.pickup_time,
            "HH:mm DD-MM-YYYY"
          ),
          price: res.data.contract.price,
          base_price: res.data.contract.base_price,
          vat: res.data.contract.vat,
          note: res.data.contract.note,
          payment_type: res.data.contract.payment_type,
          contract_payment: res.data.contract.contract_payment,
        });
        switch (res.data.contract.service_type) {
          case 1:
            res.data.contract.contract_destination.forEach((destination) => {
              if (destination.type === Type.DROP_OFF_LOCATION) {
                form.setFieldsValue({
                  drop_off_location: destination.location,
                });
              }
            });
            form.setFieldsValue({
              pickup_location_list:
                res.data.contract.contract_destination.filter(
                  (destination) => destination.type === Type.PICKUP_LOCATION
                ),
            });
            break;
          case 2:
            res.data.contract.contract_destination.forEach((destination) => {
              if (destination.type === Type.PICKUP_LOCATION) {
                form.setFieldsValue({
                  pickup_location: destination.location,
                });
              }
            });
            form.setFieldsValue({
              drop_off_location_list:
                res.data.contract.contract_destination.filter(
                  (destination) => destination.type === Type.DROP_OFF_LOCATION
                ),
            });
            break;
          case 3:
          case 4:
          case 5:
            form.setFieldsValue({
              pickup_location_list:
                res.data.contract.contract_destination.filter(
                  (destination) => destination.type === Type.PICKUP_LOCATION
                ),
            });
            form.setFieldsValue({
              drop_off_location_list:
                res.data.contract.contract_destination.filter(
                  (destination) => destination.type === Type.DROP_OFF_LOCATION
                ),
            });
            break;
          default:
            break;
        }

        //set button status
        if ([4, 5].includes(res.data.contract.contract_status))
          setButtonVisible(false);
        if ([0, 1, 2, 3, 6].includes(res.data.contract.contract_status)) {
          setCanUpdate(true);
          setCanPickDriver(true);
        }
        if (
          [0, 1, 2].includes(res.data.contract.contract_status) &&
          res.data.contract.contract_customer &&
          res.data.contract.supplier
        ) {
          setCanDrop(true);
        }
        if (
          [0, 1, 2, 3, 6].includes(res.data.contract.contract_status) &&
          res.data.contract.contract_customer &&
          res.data.contract.supplier
        ) {
          setCanComPlete(true);
        }
        if ([0, 1, 2].includes(res.data.contract.contract_status)) {
          setCanCancel(true);
        }
      } else {
        notification.error({
          message: t(`Notification`),
          description: `${res.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);

  const onChangeCarType = (value) => {
    if (contract) {
      if (contract.supplier !== null) {
        contract.supplier = null;
      } else {
        setDriverResult(null);
      }
    } else {
      notification.error({
        message: t(`Notification`),
        description: `Contract is empty`,
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
    setCarTypeCheck(value);
  };
  const showPickDriverModal = () => {
    setVisible(true);
  };
  const handlePickDriverOK = () => {
    if (listDrivers != null) {
      let supplier = {
        supplier: {
          driver_name: listDrivers.driver_name,
          driver_phone: listDrivers.driver_phone,
          car_number: listDrivers.car_number,
          car_name: listDrivers.car_name,
          driver_avatar: listDrivers.driver_avatar,
        },
      };
      setContract({ ...contract, ...supplier });
    }
    setDriverResult(listDrivers);
    setVisible(false);
  };
  const handleCancelPickDriverOK = () => {
    setListDrivers(null);
    setVisible(false);
  };
  const handleSearchDriver = (value) => {
    if (carTypeCheck) {
      searchDriver(value, carTypeCheck, (res) => {
        if (res.status === 1) {
          setListDrivers(res.data.supplier);
        } else {
          setListDrivers(null);
          setNoDriverResult(true);
        }
      });
    } else {
      notification.error({
        message: t(`Notification`),
        description: `Car Type is empty`,
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
  };

  const handleSearchCustomer = (value) => {
    if (value.length == 0) {
      notification.error({
        message: t(`Notification`),
        description: t("Please input customer's phone number"),
        placement: `bottomRight`,
        duration: 1.5,
      });
    } else {
      setCustomerSearch(null);
      var isExist = false;
      for (let i = 0; i < customerResult.length; i++) {
        if (customerResult[i].customer_phone === value.trim()) {
          // trim to compare if it has spaces
          isExist = true;
        }
      }
      if (!isExist) {
        searchCustomer(value, (res) => {
          if (res.status !== 0) {
            setCustomerSearch(res.data.customer);
          } else {
            setNoCustomerSearch(true);
            notification.error({
              message: t(`Notification`),
              description: t("No customers has this phone number"),
              placement: `bottomRight`,
              duration: 1.5,
            });
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
    }
  };
  const handleAddCustomer = () => {
    setCustomerResult(
      customerResult.concat({
        customer_id: customerSearch._id,
        customer_phone: customerSearch.phone,
        customer_name: customerSearch.name,
        type: 0,
      })
    );
    setCustomerSearch(null);
  };
  const handleRemoveCustomer = (event) => {
    const value = event.target.value;
    setCustomerResult(
      customerResult.filter((customer) => customer.customer_id !== value)
    );
  };
  const handleRemoveDriver = () => {
    setDriverResult(null);
  };
  const handleCompleteContract = () => {
    Modal.confirm({
      title: t(`Complete Contract`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to complete this contract? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        completeContract(match.params.id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Complete Contract successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/contracts");
          } else {
            notification.error({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop complete contract`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const handleCancelContract = () => {
    Modal.confirm({
      title: t(`Cancel Contract`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to cancel this contract? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        cancelContract(match.params.id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Cancel Contract successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/contracts");
          } else {
            notification.error({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop cancel contract`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };

  const onFinishContract = (values) => {
    const contract_id = match.params.id;
    var customerSubmit = [];
    customerResult.forEach((customer) => {
      customerSubmit.push({
        customer_id: customer.customer_id,
        type: customer.type,
      });
    });
    var destinationListSubmit = [];
    if (contract) {
      switch (contract.service_type) {
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
        description: `Contract is empty`,
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
    var paymentsSubmit = [];
    values.contract_payment.forEach((payment) => {
      paymentsSubmit.push({
        payment_method: payment.payment_method,
        amount: payment.amount,
        payment_status: payment.payment_status,
      });
    });
    let submitData = {
      flight_number:
        contract && (contract.service_type === 1 || contract.service_type === 2)
          ? values.flight_number
          : "",
      supplier_id:
        contract && contract.supplier !== null
          ? contract.supplier_id
          : driverResult
          ? driverResult.supplier_id
          : "",
      car_type: values.car_type,
      customers: customerSubmit,
      pickup_time: values.pickup_time.format("HH:mm DD/MM/YYYY"),
      price: values.price,
      base_price: values.base_price,
      vat: values.vat,
      payment_type: values.payment_type,
      destination_list: destinationListSubmit,
      payments: paymentsSubmit,
      note: values.note,
    };
    Modal.confirm({
      title: t(`Update Contract`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this contract? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        if (listDrivers) {
          submitData.supplier_id = listDrivers.supplier_id;
        }
        console.log(submitData);
        updateContract(contract_id, submitData, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update Contract successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            setIsFinalUpdate(true);
            history.push("/contracts");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update Contract failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update contract`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };

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

  const handleDropContract = () => {
    Modal.confirm({
      title: t(`Drop Contract`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to drop this contract? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        dropContract(match.params.id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Drop Contract successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            history.push("/contracts");
          } else {
            notification.error({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop drop contract`),
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
          <CCardHeader>
            {t("Contract Detail")} {contract ? ` (${contract.order_code})` : ""}
          </CCardHeader>
          <CCardBody>
            <Form
              {...formItemLayout}
              form={form}
              style={{ marginBottom: "0px" }}
              onFinish={onFinishContract}
            >
              {contract ? (
                <>
                  <Form.Item label={t("Service name")} labelAlign="left">
                    <span className="ant-form-text">
                      {" "}
                      {contract.service_name}{" "}
                    </span>
                  </Form.Item>
                </>
              ) : null}
              <Form.Item
                label={t("Car Type")}
                labelAlign="left"
                name="car_type"
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
              {contract && contract.service_type === 2 ? (
                <Form.Item
                  label={t("Airport")}
                  labelAlign="left"
                  name="pickup_location"
                >
                  <Select disabled={contractDisable}>
                    {airports ? (
                      <>
                        {airports.map((airport) => (
                          <Select.Option value={airport.name} key={airport._id}>
                            {airport.name}
                          </Select.Option>
                        ))}
                      </>
                    ) : (
                      <Select.Option>{t("Airport is empty.")}</Select.Option>
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
                            key={index}
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
                              <Input disabled={contractDisable} />
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
                      {!contractDisable ? (
                        <Form.Item
                          wrapperCol={{
                            xs: { span: 24, offset: 8 },
                          }}
                          style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            icon={<PlusOutlined />}
                            disabled={contractDisable}
                          >
                            {t("Add pick up destination")}
                          </Button>
                        </Form.Item>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Form.List>
              )}
              {contract && contract.service_type === 1 ? (
                <Form.Item
                  label={t("Airport")}
                  labelAlign="left"
                  name="drop_off_location"
                >
                  <Select disabled={contractDisable}>
                    {airports ? (
                      <>
                        {airports.map((airport) => (
                          <Select.Option value={airport.name} key={airport._id}>
                            {airport.name}
                          </Select.Option>
                        ))}
                      </>
                    ) : (
                      <Select.Option>{t("Airport is empty.")}</Select.Option>
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
                            key={index}
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
                              <Input disabled={contractDisable} />
                            </Form.Item>
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                style={{ fontSize: 25, paddingLeft: 8 }}
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </Form.Item>
                        );
                      })}
                      {!contractDisable ? (
                        <Form.Item
                          wrapperCol={{
                            xs: { span: 24, offset: 8 },
                          }}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                            icon={<PlusOutlined />}
                            disabled={contractDisable}
                          >
                            {t("Add drop off destination")}
                          </Button>
                        </Form.Item>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Form.List>
              )}
              {contract &&
              (contract.service_type === 1 || contract.service_type === 2) ? (
                <Form.Item
                  label={t("Flight Number")}
                  labelAlign="left"
                  name="flight_number"
                >
                  <Input disabled={contractDisable} className="ant-form-text" />
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
                  showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                />
                {/* <DatePicker
                  style={{ width: "100%" }}
                  format="HH:mm DD/MM/YYYY"
                  showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                /> */}
              </Form.Item>
              <Form.Item
                label={t("Price (VND)")}
                labelAlign="left"
                name="price"
              >
                <InputNumber
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
              >
                <InputNumber
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
              <Form.Item label={t("VAT")} labelAlign="left" name="vat">
                <Radio.Group disabled={contractDisable}>
                  <Radio value={1}> {t("Yes")} </Radio>
                  <Radio value={0}> {t("No")} </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={t("Payment")}
                labelAlign="left"
                name="payment_type"
              >
                <Select
                  disabled={contractDisable}
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
                            style={{
                              display: "flex",
                              width: "100% !important",
                            }}
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
                              style={{ width: "100%" }}
                              className="payment"
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
                                style={{ marginRight: 10, width: "100%" }}
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

              <>
                {buttonVisible && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {canUpdate ? (
                      <Button
                        style={{
                          width: "49%",
                        }}
                        type="primary"
                        block
                        htmlType="submit"
                      >
                        {t("Update")}
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={true}
                        style={{
                          width: "49%",
                        }}
                      >
                        {t("Update")}
                      </Button>
                    )}
                    {canPickDriver ? (
                      <Button
                        style={{
                          background: "rgb(190, 200, 200)",
                          width: "49%",
                        }}
                        ghost
                        block
                        onClick={showPickDriverModal}
                        disabled={false}
                      >
                        {t("Pick Driver")}
                      </Button>
                    ) : (
                      <Button
                        style={{
                          background: "rgb(190, 200, 200)",
                          width: "49%",
                        }}
                        ghost
                        block
                        onClick={showPickDriverModal}
                        disabled={true}
                      >
                        {t("Pick Driver")}
                      </Button>
                    )}
                  </div>
                )}
                <Modal
                  title={t("Pick Driver")}
                  visible={visible}
                  onOk={handlePickDriverOK}
                  onCancel={handleCancelPickDriverOK}
                >
                  <Input.Search
                    size="large"
                    placeholder={t("search driver by phone here")}
                    enterButton
                    onSearch={handleSearchDriver}
                  />
                  {listDrivers && contract ? (
                    <>
                      <Divider />
                      <Descriptions title={t("Driver's Info")} bordered>
                        <Descriptions.Item label={t("Driver name")} span={3}>
                          {listDrivers.driver_name}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Driver phone")} span={3}>
                          {listDrivers.driver_phone}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Car Type")} span={3}>
                          {listDrivers.car_type_name}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Car Number")} span={3}>
                          {listDrivers.car_number}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Car Name")} span={3}>
                          {listDrivers.car_name}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider />
                    </>
                  ) : noDriver === true ? (
                    <Empty />
                  ) : (
                    <></>
                  )}
                </Modal>
              </>

              <br></br>
              {contract && contract.supplier !== null ? (
                <>
                  <Divider />
                  <Descriptions title={t("Driver's Info")} bordered>
                    <Descriptions.Item label={t("Driver name")} span={3}>
                      {contract.supplier.driver_name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Driver phone")} span={3}>
                      {contract.supplier.driver_phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Car Number")} span={3}>
                      {contract.supplier.car_number}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Car Name")} span={3}>
                      {contract.supplier.car_name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Avatar")} span={3}>
                      <Avatar
                        size={64}
                        src={`${Domain.BASE_DOMAIN}/${contract.supplier.driver_avatar}`}
                        // src="http://api.pippip.vn/data/customer-avatar/customer_avatar_1630814786115_157569419.jpg"
                        alt="Driver avatar"
                      />
                    </Descriptions.Item>
                  </Descriptions>
                  <Divider />
                </>
              ) : driverResult ? (
                <>
                  <Divider />
                  <Descriptions title={t("Driver's Info")} bordered>
                    <Descriptions.Item label={t("Driver name")} span={3}>
                      {driverResult.driver_name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Driver phone")} span={3}>
                      {driverResult.driver_phone}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Car Number")} span={3}>
                      {driverResult.car_number}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Car Name")} span={3}>
                      {driverResult.car_name}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("Avatar")} span={3}>
                      <Avatar
                        size={64}
                        src={`${process.env.REACT_APP_BASE_DOMAIN}/${driverResult.driver_avatar}`}
                        alt="Driver avatar"
                      />
                    </Descriptions.Item>
                  </Descriptions>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="primary"
                      block
                      style={{ width: "49%", marginTop: 32 }}
                      onClick={handleRemoveDriver}
                    >
                      {t("Remove")}
                    </Button>
                  </div>
                  <Divider />
                </>
              ) : (
                <></>
              )}
              {buttonVisible &&
                (canDrop ? (
                  <Button
                    style={{ marginRight: 4 }}
                    type="primary"
                    block
                    onClick={handleDropContract}
                  >
                    {t("Drop")}
                  </Button>
                ) : (
                  <Button
                    style={{ marginRight: 4 }}
                    type="primary"
                    block
                    disabled={true}
                    onClick={handleDropContract}
                  >
                    {t("Drop")}
                  </Button>
                ))}
              <br></br>
              <br></br>

              <>
                {buttonVisible && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {canComplete ? (
                      <Button
                        style={{ marginRight: 4 }}
                        type="primary"
                        block
                        onClick={handleCompleteContract}
                      >
                        {t("Complete")}
                      </Button>
                    ) : (
                      <Button
                        style={{ marginRight: 4 }}
                        type="primary"
                        block
                        onClick={handleCompleteContract}
                        disabled={true}
                      >
                        {t("Complete")}
                      </Button>
                    )}
                    {canCancel ? (
                      <Button
                        style={{
                          background: "rgb(190, 200, 200)",
                          marginLeft: 4,
                        }}
                        ghost
                        block
                        onClick={handleCancelContract}
                      >
                        {t("Cancel")}
                      </Button>
                    ) : (
                      <Button
                        style={{
                          background: "rgb(190, 200, 200)",
                          marginLeft: 4,
                        }}
                        ghost
                        block
                        onClick={handleCancelContract}
                        disabled={true}
                      >
                        {t("Cancel")}
                      </Button>
                    )}
                  </div>
                )}
              </>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="5" className="mb-4">
        <CCard>
          <CCardHeader>{t("Customers' Info")}</CCardHeader>
          <CCardBody>
            {!contractDisable ? (
              <Input.Search
                disabled={contractDisable}
                size="large"
                placeholder={t("search customer by phone here")}
                enterButton
                onSearch={handleSearchCustomer}
              />
            ) : (
              <></>
            )}
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
            ) : noCustomerSearch === true ? (
              <Empty />
            ) : (
              <></>
            )}
            {customerResult ? (
              <>
                {customerResult.map((customer) => (
                  <>
                    {customer.type === Type.MAIN_CUSTOMER.id ? (
                      <div key={customer.customer_id}>
                        <Divider />
                        <Descriptions
                          title={t(Type.MAIN_CUSTOMER.name)}
                          bordered
                        >
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
                      </div>
                    ) : customer.type === Type.SUB_CUSTOMER.id ? (
                      <div key={customer.customer_id}>
                        <Descriptions
                          title={t(Type.SUB_CUSTOMER.name)}
                          bordered
                        >
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
                      </div>
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
        <CCard>
          <CCardHeader>{t("Contract status")}</CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Descriptions
                title={t(
                  `${
                    contract &&
                    ContractStatus.find(
                      (element) => element.id == contract.contract_status
                    ).name
                  }`
                )}
                bordered
              ></Descriptions>
            </Space>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>{t("Reverse contract")}</CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Button size="middle" type="primary">
                <Link
                  to={{
                    pathname: `/contracts/create`,
                    state: { contract_id: contract?._id },
                  }}
                >
                  {t("Create contract")}
                </Link>
              </Button>
            </Space>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>{t("Hỗ trợ tin nhắn cho sale")}</CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <SaleTextHelper
                contract={contract}
                customerResult={customerResult}
                pickupList={pickupList}
                destinationList={destinationList}
              />
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(ContractDetail);
