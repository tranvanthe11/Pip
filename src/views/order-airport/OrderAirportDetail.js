import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Table,
  Tag,
  Space,
  notification,
  Descriptions,
  Form,
  InputNumber,
  Radio,
  Input,
  Select,
  Modal,
  DatePicker,
  Button,
  // Avatar
} from "antd";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
// import { getListOrders } from "src/services/order";
import {
  getOrderAirportDetail,
  getPriceDistrict,
  updateOrderAirport,
  removeOrderAirport,
  completeOrderAirport,
} from "src/services/orderAirport";
import { OrderStatus } from "src/configs/OrderStatus";
import { useSelector } from "react-redux";
import { getAirportDetail } from "src/services/airport";
import { formatterNumber, parserNumber } from "src/services/money";
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

const OrderAirportDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
  });
  const [airport, setAirport] = useState({});
  const [other_status, setOrderStatus] = useState(0);
  const [district, setDistrict] = useState(0);
  const { airports, provinces, districts, carTypes } = useSelector(
    (state) => state
  );
  const pathname = useLocation().pathname;

  const order_airport_id = match.params.id;
  const [data, setData] = useState();
  const info = () => {
    Modal.error({
      title: "Oops!!!",
      centered: true,
      content: (
        <div>
          <p>
            {t("This district doesn't serve at this time. Please try again!")}
          </p>
        </div>
      ),
      onOk() {},
    });
  };
  useEffect(() => {
    getOrderAirportDetail(order_airport_id, (res) => {
      if (res.status === 1) {
        // console.log(res.data.order_airport.pickup_time);
        setData(res.data.order_airport);
        // setDistrict(res.data.order_airport.district_id);
        res.data.order_airport.payment_method += "";
        res.data.order_airport.payment_type += "";
        res.data.order_airport.payment_status += "";
        res.data.order_airport.vat += "";
        res.data.order_airport.pickup_time = moment(
          res.data.order_airport.pickup_time,
          "HH:mm DD-MM-YYYY"
        );
        res.data.order_airport.service_id += "";
        // console.log(res.data.order_airport.pickup_time);
        setOrderStatus(res.data.order_airport.order_airport_status);
        form.setFieldsValue(res.data.order_airport);
      } else if (res.status === 403) {
        notification.error({
          message: t(`Notification`),
          description: `${res.message + " " + res.expiredAt}`,
          placement: `bottomRight`,
          duration: 10,
        });
      } else {
        notification.error({
          message: t(`Notification`),
          description: `${res.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, [pathname]);
  useEffect(() => {
    if (district) {
      let priceData = {};
      priceData.service_id = data.service_id;
      priceData.car_type_name_id = data.car_type_name_id;
      priceData.airport_id = data.airport_id;
      priceData.province_id = data.province_id;
      priceData.district_id = district;
      getPriceDistrict(priceData, (res) => {
        if (res.data) {
          data.price = res.data.price;
          data.district_id = district;
        } else {
          setDistrict(data.district_id);
          info();
        }
        form.setFieldsValue(data);
      });
    }
  }, [district]);
  const handleUpdate = (values) => {
    const order_airport_id = match.params.id;
    Modal.confirm({
      title: t(`Update Order Airport`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this order airport? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        values.name = data.name;
        values.phone = data.phone;
        values.vat = parseInt(values.vat);
        values.pickup_time = values.pickup_time.format("HH:mm DD/MM/YYYY");
        updateOrderAirport(order_airport_id, values, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update order airport successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/order-airports");
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
          description: t(`Stop remove order airport`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const handleRemoveOrderAirport = () => {
    const order_airport_id = match.params.id;
    Modal.confirm({
      title: t(`Remove Order Airport`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to remove this order airport? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        removeOrderAirport(order_airport_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Remove order airport successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/order-airports");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Remove order airport failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop remove order airport`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const handleCompleteOrderAirport = () => {
    const order_airport_id = match.params.id;
    Modal.confirm({
      title: t(`Complete Order Airport`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to complete this order airport? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        completeOrderAirport(order_airport_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Complete order airport successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/order-airports");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Complete order airport failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop complete order airport`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const returnBack = () => {
    history.push("/order-airports");
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
            {t("Order Airport Detail")}
            {data ? ` (${data.order_code})` : ""}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={handleUpdate}>
              <Form.Item
                label={t("Service Name")}
                labelAlign="left"
                initialValue="1"
                name="service_id"
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select service"
                  optionFilterProp="service"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled
                >
                  <Select.Option value="1">{t("Go to airport")}</Select.Option>
                  <Select.Option value="2">
                    {t("Come back from airport")}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Car Type")}
                labelAlign="left"
                name="car_type_name_id"
                initialValue={carTypes[0] ? carTypes[0].name_id : 0}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select car type"
                  optionFilterProp="car type"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled
                >
                  {carTypes.map((item, index) => (
                    <Select.Option value={item.name_id} key={index}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Airport")}
                labelAlign="left"
                name="airport_id"
                initialValue={airports[0] ? airports[0]._id : 0}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select airport"
                  optionFilterProp="airport"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled
                >
                  {airports.map((item, index) => (
                    <Select.Option value={item._id} key={index}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Province")}
                labelAlign="left"
                name="province_id"
                initialValue={provinces[0] ? provinces[0].id : 0}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select province"
                  optionFilterProp="province"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled
                >
                  {provinces.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("District")}
                labelAlign="left"
                name="district_id"
                initialValue={districts[0] ? districts[0].id : 0}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select district"
                  optionFilterProp="district"
                  onChange={(e) => {
                    setDistrict(e);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={other_status == 1 || other_status == 2}
                >
                  {districts.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Address")}
                labelAlign="left"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input address of customer!",
                  },
                ]}
              >
                <Input
                  placeholder="Please input address"
                  disabled={other_status == 1 || other_status == 2}
                />
              </Form.Item>
              <Form.Item
                label={t("Flight Number")}
                labelAlign="left"
                name="flight_number"
              >
                <Input
                  placeholder="Please input flight number"
                  disabled={other_status == 1 || other_status == 2}
                />
              </Form.Item>
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
                  disabled={other_status == 1 || other_status == 2}
                  placeholder={t("Please input a pick up time")}
                  showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                />
              </Form.Item>
              <Form.Item label={t("Price")} labelAlign="left" name="price">
                <InputNumber
                  type="number"
                  min="0"
                  style={{ width: "100%" }}
                  formatter={(value) => formatterNumber(value)}
                  parser={(value) => parserNumber(value)}
                  placeholder="Please input price"
                  disabled={other_status == 1 || other_status == 2}
                />
              </Form.Item>
              {other_status == 0 && (
                <>
                  <Form.Item
                    label={t("Payment Type")}
                    labelAlign="left"
                    name="payment_type"
                    initialvalues={"1"}
                  >
                    <Radio.Group>
                      <Radio value="1" key="1">
                        {t("Advance Payment")}
                      </Radio>
                      <Radio value="2" key="2">
                        {t("Deferred Payment")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label={t("Payment Method")}
                    labelAlign="left"
                    name="payment_method"
                    initialvalues={"0"}
                  >
                    <Radio.Group>
                      <Radio value="0" key="0">
                        {t("Cash Transfer")}
                      </Radio>
                      <Radio value="1" key="1">
                        {t("Bank Transfer")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label={t("Payment Status")}
                    labelAlign="left"
                    name="payment_status"
                    initialvalues={"0"}
                  >
                    <Radio.Group>
                      <Radio value="0" key="0">
                        {t("Unpaid")}
                      </Radio>
                      <Radio value="1" key="1">
                        {t("Paid")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    label={t("Vat")}
                    labelAlign="left"
                    name="vat"
                    initialvalues={"1"}
                  >
                    <Radio.Group>
                      <Radio value="1" key="1">
                        {t("vat")}
                      </Radio>
                      <Radio value="0" key="0">
                        {t("Unvat")}
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </>
              )}
              {(other_status == 1 || other_status == 2) && (
                <>
                  <Form.Item
                    label={t("Payment Type")}
                    labelAlign="left"
                    name="payment_type"
                    initialvalues={"1"}
                  >
                    {data.payment_type == 1 ? (
                      <p>{t("Advance Payment")}</p>
                    ) : (
                      <p>{t("Deferred Payment")}</p>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={t("Payment Method")}
                    labelAlign="left"
                    name="payment_method"
                    initialvalues={"0"}
                  >
                    {data.payment_method == 0 ? (
                      <p>{t("Cash Transfer")}</p>
                    ) : (
                      <p>{t("Bank Transfer")}</p>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={t("Payment Status")}
                    labelAlign="left"
                    name="payment_status"
                    initialvalues={"0"}
                  >
                    {data.payment_status == 0 ? (
                      <p>{t("Unpaid")}</p>
                    ) : (
                      <p>{t("Paid")}</p>
                    )}
                  </Form.Item>
                  <Form.Item
                    label={t("Vat")}
                    labelAlign="left"
                    name="vat"
                    initialvalues={"1"}
                  >
                    {data.vat == 1 ? <p>{t("vat")}</p> : <p>{t("Unvat")}</p>}
                  </Form.Item>
                </>
              )}
              <Form.Item label={t("Note")} labelAlign="left" name="note">
                <Input
                  placeholder="Please input note for your driver"
                  disabled={other_status == 1 || other_status == 2}
                />
              </Form.Item>
              <Form.Item
                label={t("Status")}
                labelAlign="left"
                name="order_airport_status"
              >
                <Tag color={OrderStatus()[other_status].color}>
                  {t(OrderStatus()[other_status].text)}
                </Tag>
              </Form.Item>
              {other_status == 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      style={{ marginLeft: 4 }}
                      type="primary"
                      block
                      htmlType="submit"
                    >
                      {t("Update")}
                    </Button>
                    <Button
                      style={{
                        background: "rgb(190, 200, 200)",
                        marginLeft: 4,
                      }}
                      ghost
                      block
                      onClick={handleRemoveOrderAirport}
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                  <Button
                    style={{ marginTop: 8, marginLeft: 4 }}
                    type="secondary"
                    block
                    onClick={handleCompleteOrderAirport}
                  >
                    {t("Confirm Order")}
                  </Button>
                </>
              ) : (
                <Button
                  style={{
                    marginLeft: 4,
                  }}
                  type="primary"
                  block
                  onClick={returnBack}
                >
                  {t("Come back")}
                </Button>
              )}
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="5" className="mb-4">
        <CCard>
          <CCardHeader>{t("Customers' Info")}</CCardHeader>
          <CCardBody>
            <Descriptions bordered>
              <Descriptions.Item label={t("Name")} span={3}>
                {data?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("Phone")} span={3}>
                {data?.phone}
              </Descriptions.Item>
            </Descriptions>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>{t("Hỗ trợ tin nhắn cho sale")}</CCardHeader>
          <CCardBody>
            <>
              <h5>Step 0 : Giới thiệu pippip</h5>
              <b>Hướng dẫn : Sau khi add zalo hoặc qua hình thức nhắn tin nào đó</b>
              <p>Gửi tin nhắn :<br/>Mình bên dịch vụ đặt xe pippip.vn</p>        
            </>
            <>
              <h5>Step 1 : xác nhận đơn hàng</h5>
              <b>Hướng dẫn : sau khi lên đơn cho khách trên hệ thống</b>
              <p>Gửi tin nhắn :<br/>Mình gửi link check đơn hàng : pippip.vn/checkdonhang/{data?.order_code}</p>        
            </>
            <>
              <h5>Step 2 : thông tin chuyển khoản</h5>
              <b>Hướng dẫn : sau khi gửi xác nhận đơn và chốt hình thức thanh toán với khách</b>
              <p>
                Gửi tin nhắn :<br/>
                Ngân hàng: Vietcombank - Chi nhánh Thành Công<br/>
                Số tài khoản: 0451000327817<br/>
                Tên: Trần Ngọc Hiếu<br/>
                Số tiền: {`${data?.price} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}<br/>
                Nội dung: {`${data?.order_code}`}<br/>
              </p>        
            </>
            <>
              <h5>Step 3 : lưu ý đơn hàng</h5>
              <b>Hướng dẫn : sau khi xác nhận khách đã thanh toán</b>
              <p>
                Gửi tin nhắn :<br/>
                Link check đơn hàng: pippip.vn/checkdonhang/{data?.order_code}<br/>
                Ghi chú về chuyến {data?.service_id=="1" ? t("Go to airport") : t("Come back from airport")}<br/>
                {(data?.service_id=="1") ? "Các chuyến đón khách từ 3h tới 7h sáng, hệ thống sẽ có thông tin xe muộn nhất là 23h ngày hôm trước." : "Hệ thống sẽ dựa theo thời gian hạ cánh của máy bay và thời gian khách hàng đi lấy hành lý (nếu có) để sắp xếp xe đưa đón phù hợp nhất."}<br/>
                {(data?.service_id=="1") ? "Các khoảng thời gian đón khác trong ngày, hệ thống sẽ có thông tin xe trước 15' ~ 30' khi đón." : "Khi xuống sân bay, khách hàng mở app kiểm tra đơn hàng để check thông tin lái xe đưa đón, đồng thời chú ý điện thoại để lái xe có thể liên hệ với khách hàng."}<br/>
                Bất khả kháng<br/>
                Trong trường hợp mưa bão, đường ngập lụt hoặc các trường hợp bất khả kháng xe không thể di chuyển thì chuyến đi sẽ bị huỷ và khách hàng sẽ được hỗ trợ hoàn tiền theo quy định.<br/>
              </p>        
            </>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(OrderAirportDetail);
