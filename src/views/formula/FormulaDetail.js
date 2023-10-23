import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { Status } from "src/configs";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
  Upload,
  Avatar,
  Radio,
  Divider,
} from "antd";
// import { useSelector } from 'react-redux';
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import {
  getFormulaDetail,
  updateFormula,
  removeFormula,
} from "src/services/formula";
import {
  numberWithCommas,
  formatterNumber,
  parserNumber,
} from "src/services/money";

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

const FormulaDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [data, setData] = useState();
  const [serve, setServe] = useState(1);
  const { airports, provinces, districts, carTypes } = useSelector(
    (state) => state
  );

  const handleRemoveFormula = () => {
    const formula_id = match.params.id;
    Modal.confirm({
      title: t(`Remove Formula`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to remove this formula? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        removeFormula(formula_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Remove formula successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/formulas");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Remove formula failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop remove formula`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const updateFormulaHandler = (values) => {
    const formula_id = match.params.id;
    if (!values.price) {
      values.price = data.price;
    }
    Modal.confirm({
      title: t(`Update Formula`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update the infomation of this formula ? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateFormula(formula_id, values, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update Formula Successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/formulas");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update Formula Failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update formula's information`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  useEffect(() => {
    getFormulaDetail(match.params.id, (res) => {
      if (res.status === 1) {
        setData(res.data.first_protocol);
        res.data.first_protocol.service_id += "";
        res.data.first_protocol.serve += "";
        form.setFieldsValue(res.data.first_protocol);
        setServe(res.data.first_protocol.serve);
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get Flight's Information Failed`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);
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
            {t("Formula Detail")}
          </CCardHeader>
          <CCardBody>
            <Form
              form={form}
              {...formItemLayout}
              onFinish={updateFormulaHandler}
            >
              <Form.Item
                label={t("Service Name")}
                labelAlign="left"
                initialValue={serve}
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
                label={t("Airport")}
                labelAlign="left"
                name="airport_id"
                initialValue={airports[0]._id}
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
                initialValue={provinces[0].id}
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
                    <Select.Option key={index} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("District")}
                labelAlign="left"
                name="district_id"
                initialValue={districts[0].id}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Select district"
                  optionFilterProp="district"
                  disabled
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {districts.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Car Type")}
                labelAlign="left"
                name="car_type_name_id"
                initialValue={carTypes[0].name_id}
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
                    <Select.Option key={index} value={item.name_id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {data?.serve != 2 ? (
                <Form.Item
                  label={t("Serve")}
                  labelAlign="left"
                  initialValue="1"
                  name="serve"
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select serve"
                    optionFilterProp="serve"
                    onChange={(e) => setServe(e)}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="1">{t("Yes")}</Select.Option>
                    <Select.Option value="0">{t("No")}</Select.Option>
                    {/* <Select.Option
                    value="2"
                    style={{ display: serve == 2 ? "hidden" : "initial" }}
                  >
                    {t("Undefined")}
                  </Select.Option> */}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  label={t("Serve")}
                  labelAlign="left"
                  initialValue="1"
                  name="serve"
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select serve"
                    optionFilterProp="serve"
                    onChange={(e) => setServe(e)}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="1">{t("Yes")}</Select.Option>
                    <Select.Option value="0">{t("No")}</Select.Option>
                    <Select.Option value="2">{t("Undefined")}</Select.Option>
                  </Select>
                </Form.Item>
              )}
              {serve == 1 ? (
                <Form.Item label={t("Price")} labelAlign="left" name="price">
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    type="number"
                    formatter={(value) => formatterNumber(value)}
                    parser={(value) => parserNumber(value)}
                    placeholder="Please input price (100 = 100.000VND)"
                  />
                </Form.Item>
              ) : (
                <></>
              )}
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
                  {t("Update Formula")}
                </Button>
                <Button
                  style={{ background: "rgb(190, 200, 200)", marginLeft: 4 }}
                  ghost
                  block
                  onClick={handleRemoveFormula}
                >
                  {t("Remove Formula")}
                </Button>
              </div>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(FormulaDetail);
