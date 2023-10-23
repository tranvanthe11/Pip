import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  // Roles,
  // Status,
  // Type,
  Domain,
  Validate,
} from "src/configs";
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
} from "antd";
import { useSelector } from "react-redux";
import {
  getDriverDetails,
  updateAvatar,
  updateDriver,
} from "src/services/driver";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router";
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

const ListHostDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [supplier, setData] = useState();
  const [avatarURL, setAvatarURL] = useState();
  const [selectDefaultVal, setSelectDefaultVal] = useState(null);
  // const [avatarUpload, setAvatarUpload] = useState()
  const car_types = useSelector((state) => state.carTypes);
  const handleUploadAvatar = (e) => {
    const formData = new FormData();
    formData.append("supplier_avatar", e.file, e.file.name);
    updateAvatar(match.params.id, formData, (res) => {
      if (res.status === 1) {
        setAvatarURL(res.data.path);
        notification.success({
          message: t(`Notification`),
          description: `Avatar upload successful!`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Avatar upload failed!`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  };

  const beforeUpload = (file) => {
    const isJPG = file.type === "image/jpg";
    const isJPEG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isJPG && !isPNG && !isJPEG) {
      notification.warning({
        message: t(`Notification`),
        description: `You can only upload JPG or PNG file!`,
        placement: `bottomRight`,
        duration: 3.5,
      });
    }
    if (!isLt5M) {
      notification.warning({
        message: t(`Notification`),
        description: `Image must smaller than 5MB!`,
        placement: `bottomRight`,
        duration: 3.5,
      });
    }
    return (isJPG || isPNG || isJPEG) && isLt5M;
  };
  useEffect(() => {
    getDriverDetails(match.params.id, (res) => {
      // console.log(res.data);
      if (res.status === 1) {
        setData(res.data.supplier);
        setAvatarURL(res.data.supplier.avatar);
        const car_default_value = car_types.filter((car_type) => {
          return car_type.name == res.data.supplier.car_type;
        });
        form.setFieldsValue({
          name: res.data.supplier.name,
          phone: res.data.supplier.phone,
          avatar: res.data.supplier.avatar,
          car_type: car_default_value[0].name_id,
          car_number: res.data.supplier.car_number,
          car_name: res.data.supplier.car_name,
        });
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Get Driver failed.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, []);
  const onFinish = (values) => {
    const supplier_id = match.params.id;
    var submitData = {
      name: values.name,
      car_type: values.car_type,
      car_number: values.car_number,
      car_name: values.car_name,
      avatar: avatarURL,
    };
    // console.log(submitData);
    Modal.confirm({
      title: t(`Update Supplier`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update this supplier? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateDriver(supplier_id, submitData, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update supplier successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/drivers");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update supplier failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update supplier`),
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
            {t("Driver Detail")}
            <Upload
              showUploadList={false}
              customRequest={handleUploadAvatar}
              beforeUpload={beforeUpload}
            >
              {avatarURL ? (
                <Avatar
                  src={`${process.env.REACT_APP_BASE_DOMAIN}/${avatarURL}`}
                  alt=""
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                />
              ) : (
                <Avatar
                  src={window.location.origin + "/avatars/default-avatar.png"}
                  alt=""
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                />
              )}
            </Upload>
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={onFinish} >
              <Form.Item
                label={t("Supplier Name")}
                labelAlign="left"
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please input supplier name!"),
                  },
                ]}
              >
                <Input placeholder={t("Please input supplier name")} />
              </Form.Item>
              <Form.Item label={t("Phone")} labelAlign="left" name="phone">
                {supplier ? (
                  <span>{supplier.phone}</span>
                ) : (
                  <span>{t("EMPTY")}</span>
                )}
              </Form.Item>

              <Form.Item
                label={t("Car type")}
                labelAlign="left"
                name="car_type"
                rules={[
                  {
                    required: true,
                    message: t("Please select car type!"),
                  },
                ]}
              >
                <Select
                  value={selectDefaultVal}
                  placeholder={t("Please select car type")}
                  onChange={(e) => setSelectDefaultVal(e)}
                  style={{
                    width: "100%"
                  }}
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
              <Form.Item
                label={t("Car Number")}
                labelAlign="left"
                name="car_number"
                rules={[
                  {
                    required: true,
                    message: t("Please input car number!"),
                  },
                ]}
              >
                <Input placeholder={t("Please input car number")} />
              </Form.Item>
              <Form.Item
                label={t("Car Name")}
                labelAlign="left"
                name="car_name"
                rules={[
                  {
                    required: true,
                    message: t("Please input car name!"),
                  },
                ]}
              >
                <Input placeholder={t("Please input car name")} />
              </Form.Item>
              <Button type="primary" block htmlType="submit">
                {t("Update")}
              </Button>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(ListHostDetail);
