import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  // Roles,
  // Status,
  // Type,
  Domain,
  Validate,
} from "src/configs";
import { AxiosConfig } from "src/configs";
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
  createHostDetail,
  deleteHostDetail,
  getDriverDetails,
  addAvatar,
  createDriver,
} from "src/services/driver";
import {
  ExclamationCircleOutlined,
  UploadOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
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

const AddDriver = ({ t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  // const [supplier, setData] = useState();
  const [avatarURL, setAvatarURL] = useState();
  // const [avatarUpload, setAvatarUpload] = useState()
  const car_types = useSelector((state) => state.carTypes);

  const handleUploadAvatar = (e) => {
    const formData = new FormData();
    formData.append("supplier_avatar", e.file, e.file.name);
    addAvatar(formData, (res) => {
      // console.log(res);
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
  const onFinish = (values) => {
    if (avatarURL) {
      // console.log(values);
      var submitData = {
        name: values.name,
        phone: values.phone,
        car_type: values.car_type,
        car_number: values.car_number,
        car_name: values.car_name,
        avatar: avatarURL,
      };
      // console.log(submitData);
      Modal.confirm({
        title: t(`Create Supplier`),
        icon: <ExclamationCircleOutlined />,
        content: t(
          `You are going to create this supplier? Are you sure you want to do this? You can't reverse this`
        ),
        onOk() {
          createDriver(submitData, (res) => {
            if (res.status === 1) {
              notification.success({
                message: t(`Notification`),
                description: `Create supplier successful.`,
                placement: `bottomRight`,
                duration: 1.5,
              });
              // setIsFinalUpdate(true)
              history.push("/drivers");
            } else {
              notification.error({
                message: t(`Notification`),
                description: t(`${res.message}`),
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
        description: `Please upload supplier avatar.`,
        placement: `bottomRight`,
        duration: 1.5,
      });
    }
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
                  src={`${Domain.BASE_DOMAIN}/${avatarURL}`}
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
            <Form form={form} {...formItemLayout} onFinish={onFinish}>
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
                          return Promise.reject(
                            new Error(t("Please enter a valid phone number!"))
                          );
                        }
                      } else {
                        return Promise.reject(
                          new Error(t("Please input a phone number!"))
                        );
                      }
                    },
                  },
                ]}
              >
                {/* {
                                    (supplier) ? (
                                        <span>{supplier.phone}</span>
                                    ) : (
                                        <span>{t("EMPTY")}</span>
                                    )
                                } */}
                <Input placeholder={t("Please input supplier phone")} />
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
                <Select placeholder={t("Please select car type")}>
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
                {t("Create")}
              </Button>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(AddDriver);
