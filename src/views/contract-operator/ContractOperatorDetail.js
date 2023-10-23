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
} from "antd";
import { Type, Domain } from "src/configs";
import {
  getContractDetail,
  updateContract,
  searchDriver,
  cancelContract,
} from "src/services/contract";

import { updateContractsOperator } from "src/services/operator";
import { useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import "./customForm.css";
import { useHistory } from "react-router";
import { formatterNumber } from "src/services/money";
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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 8 },
  },
};

const ContractOperatorDetail = ({ match, t }) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [contract, setContract] = useState();
  const [listDrivers, setListDrivers] = useState();
  const [driverResult, setDriverResult] = useState();
  const [customerResult, setCustomerResult] = useState();
  const [noDriver, setNoDriverResult] = useState(false);
  const [visible, setVisible] = useState(false);
  const [contractDisable, setContractDisable] = useState(false);
  const [carTypeCheck, setCarTypeCheck] = useState();
  const [isFinalUpdate, setIsFinalUpdate] = useState(false);
  const [pickupList, setPickupList] = useState();
  const [destinationList, setDestinationList] = useState();

  useEffect(() => {
    getContractDetail(match.params.id, (res) => {
      if (res.data.contract && res.status === 1) {
        setContract(res.data.contract);
        form.setFieldsValue(res.data.contract);
        if (res.data.contract.contract_customer) {
          setCustomerResult(res.data.contract.contract_customer);
        }
        if (res.data.contract.contract_status !== 0) {
          setContractDisable(true);
        }
        if (res.data.contract.contract_customer && res.data.contract.supplier) {
          setIsFinalUpdate(true);
        }
        if (res.data.contract.car_type) {
          setCarTypeCheck(res.data.contract.car_type);
        }
        let pick = [];
        let des = [];
        res.data.contract.contract_destination.forEach((location, index) => {
          if (location.type == 1) pick.push(location.location);
          else des.push(location.location);
        });
        setPickupList(pick);
        setDestinationList(des);
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
  const handleRemoveDriver = () => {
    setDriverResult(null);
  };

  const onFinishContract = () => {
    const contract_id = match.params.id;
    Modal.confirm({
      title: t(`Update Contract`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this contract? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateContractsOperator(contract_id, listDrivers.supplier_id, (res) => {
          if (res.data.status == 1) {
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

  return (
    <CRow>
      <CCol xs="12" md="7" className="mb-4">
        <CCard>
          <CCardHeader>
            {t("Contract Detail")} {` (${contract?.order_code})`}
          </CCardHeader>
          <CCardBody>
            <div>
              {`Xe ${contract?.car_type_name}, ${contract?.pickup_time}, từ `}
              {pickupList?.map((pick) => {
                return <span>{`${pick} => `}</span>;
              })}
              {destinationList?.map((des, index) => {
                if (index == destinationList.length - 1) {
                  return <span>{`${des}`}</span>;
                } else {
                  return <span>{`${des} => `}</span>;
                }
              })}
            </div>
            <div>
              {contract?.flight_number &&
                `Số hiệu chuyến bay: ${contract?.flight_number}`}
            </div>
            <Divider />
            <div>
              {`Giá bán khách: ${`${contract?.price} VND`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}, ${contract?.vat == 0 ? "không" : "có"} VAT, 
              ${t(
                `${
                  [Type.PREPAY, Type.POSTPAID, Type.INSTALMENT_PAYMENT].find(
                    (item) => item.id == contract?.payment_type
                  )?.name
                }`
              )}`}
            </div>
            <div>
              {contract?.contract_payment.map((item, index) => {
                return (
                  <div>
                    <span className="ant-form-text">
                      {`${t(`#Lần ${index + 1}`)}: ${
                        formatterNumber(item?.amount) + " VNĐ"
                      }, 
                      ${
                        item.payment_method == 0 ? `Tiền mặt` : `Chuyển khoản`
                      }, 
                      ${
                        item.payment_status == 0
                          ? `Chưa thanh toán`
                          : `Đã thanh toán`
                      }
                    `}
                    </span>
                  </div>
                );
              })}
            </div>
            {contract?.note && <Divider />}
            <div>{contract?.note && `Ghi chú: ${contract?.note}`}</div>
            <Divider />
            <div>
              Giá giao xe:{" "}
              {`${contract?.base_price} VND`.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
            </div>
            <Form
              {...formItemLayout}
              form={form}
              style={{ marginBottom: "0px" }}
              onFinish={onFinishContract}
            >
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
              {contract && contract.contract_status === 0 ? (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {!listDrivers?.supplier_id ? (
                      <Button
                        type="primary"
                        block
                        htmlType="button"
                        onClick={() => history.push("/contracts")}
                      >
                        {t("Back")}
                      </Button>
                    ) : (
                      <Form.Item
                        style={{
                          width: "100%",
                          marginRight: 8,
                        }}
                        wrapperCol={{
                          sm: 24,
                        }}
                      >
                        <Button
                          type="primary"
                          block
                          htmlType="submit"
                          disabled={listDrivers?.supplier_id ? false : true}
                        >
                          {t("Update")}
                        </Button>
                      </Form.Item>
                    )}
                    <Button
                      type="primary"
                      ghost
                      block
                      onClick={showPickDriverModal}
                    >
                      {t("Pick Driver")}
                    </Button>
                  </div>
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
            {customerResult ? (
              <>
                {customerResult.map((customer) => (
                  <>
                    {customer.type === Type.MAIN_CUSTOMER.id ? (
                      <div key={customer.customer_id}>
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
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(ContractOperatorDetail);
