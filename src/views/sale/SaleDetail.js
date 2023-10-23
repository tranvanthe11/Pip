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
  Select,
  notification,
  Upload,
  Avatar,
  Radio,
  Divider,
} from "antd";
// import { useSelector } from 'react-redux';
import {
  blockUser,
  updateUserPassword,
  getUserDetails,
} from "src/services/user";
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

const CustomerDetail = ({ match, t }) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [sale, setData] = useState();
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
  const handleBlockUser = () => {
    const user_id = match.params.id;
    Modal.confirm({
      title: t(`Block Sale`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to block this sale? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        blockUser(user_id, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Block sale successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/users");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Block sale failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop block sale`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
  const changeUserPassword = (values) => {
    const user_id = match.params.id;
    const submitData = {
      new_password: values.new_password,
    };
    console.log(submitData);
    Modal.confirm({
      title: t(`Update Password Sale`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to update password this sale? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        updateUserPassword(user_id, submitData, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Update password successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            // setIsFinalUpdate(true)
            history.push("/users");
          } else {
            notification.error({
              message: t(`Notification`),
              description: `Update password failed.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop update password`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  };
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
  useEffect(() => {
    getUserDetails(match.params.id, (res) => {
      if (res.status === 1) {
        setData(res.data.user_info);
        // setAvatarURL(res.data.customer.avatar)
        // form.setFieldsValue({
        //     status: res.data.user_info.status,
        //     phone: res.data.user_info.phone,
        //     role: res.data.user_info.role
        //     // home_address: res.data.user_info.home_address,
        //     // office_address: res.data.user_info.office_address,
        //     // other_address: res.data.user_info.other_address,
        //     // was_agency: res.data.user_info.was_agency
        // })
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

  // const onFinish = (values) => {
  //     const user_id = match.params.id
  //     // console.log(values);
  //     var submitData = {
  //         name: values.name,
  //         home_address: values.home_address,
  //         office_address: (values.office_address === null) ? '' : values.office_address,
  //         other_address: (values.other_address === null) ? '' : values.other_address,
  //         is_agency: values.was_agency
  //     }
  //     console.log(submitData);
  //     Modal.confirm({
  //         title: t(`Update Sale`),
  //         icon: <ExclamationCircleOutlined />,
  //         content: t(`You are going to update this sale? Are you sure you want to do this? You can't reverse this`),
  //         onOk() {
  //             updateUser(user_id, submitData, (res) => {
  //                 if (res.status === 1) {
  //                     notification.success({
  //                         message: t(`Notification`),
  //                         description: `Update sale successful.`,
  //                         placement: `bottomRight`,
  //                         duration: 1.5,
  //                     });
  //                     // setIsFinalUpdate(true)
  //                     history.push('/sales');
  //                 } else {
  //                     notification.error({
  //                         message: t(`Notification`),
  //                         description: `Update sale failed.`,
  //                         placement: `bottomRight`,
  //                         duration: 1.5,
  //                     });
  //                 }
  //             })
  //         },
  //         onCancel() {
  //             notification.info({
  //                 message: t(`Notification`),
  //                 description: t(`Stop update sale`),
  //                 placement: `bottomRight`,
  //                 duration: 1.5,
  //             });
  //         },
  //         centered: true,
  //     });
  // };

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
            {t("User Detail")}
          </CCardHeader>
          <CCardBody>
            <Form form={form} {...formItemLayout} onFinish={changeUserPassword}>
              <Form.Item
                label={t("Phone")}
                labelAlign="left"
                // name="phone"
              >
                {sale ? <span>{sale.phone}</span> : <span>{t("EMPTY")}</span>}
              </Form.Item>
              <Form.Item
                label={t("Type")}
                labelAlign="left"
                // name="role"
              >
                {sale ? <span>{sale.role}</span> : <span>{t("EMPTY")}</span>}
              </Form.Item>
              <Form.Item
                label={t("Status")}
                labelAlign="left"
                // name="role"
              >
                {sale ? (
                  <>
                    {sale.status === Status.ACTIVE.id ? (
                      <span>{Status.ACTIVE.name}</span>
                    ) : sale.status === Status.INACTIVE.id ? (
                      <span>{Status.INACTIVE.name}</span>
                    ) : sale.status === Status.BLOCK.id ? (
                      <span>{Status.BLOCK.name}</span>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <span>{t("EMPTY")}</span>
                )}
              </Form.Item>
              <Divider />
              {/* <Form.Item
                                label={t("Old Password")}
                                labelAlign="left"
                                name="old_password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input old password!',
                                    },
                                ]}

                            >
                                <Input.Password placeholder="Please input the old password to change passord" />
                            </Form.Item> */}
              <Form.Item
                label={t("New Password")}
                labelAlign="left"
                name="new_password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input new password!",
                  },
                ]}
              >
                <Input.Password placeholder="Please input the new password" />
              </Form.Item>
              <Form.Item
                label={t("Confirm Password")}
                labelAlign="left"
                name="confirm"
                dependencies={["new_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("new_password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Please confirm the new password" />
              </Form.Item>
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
                  {t("Change Password")}
                </Button>
                <Button
                  style={{ background: "rgb(190, 200, 200)", marginLeft: 4 }}
                  ghost
                  block
                  onClick={handleBlockUser}
                >
                  {t("Block User")}
                </Button>
              </div>
            </Form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(CustomerDetail);
