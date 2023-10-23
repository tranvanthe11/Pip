import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CCol, CRow } from "@coreui/react";
import {
  // Button,
  Descriptions,
  notification,
} from "antd";
import {
  getProfile,
  // generateCode
} from "src/services/user";
import { useSelector } from "react-redux";
import { withNamespaces } from "react-i18next";
import { Status } from "src/configs";
import moment from "moment";

const Profile = ({ t }) => {
  const [userData, setUserData] = useState();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    getProfile(user.data._id, (res) => {
      if (res.status === 1) {
        setUserData(res.data.info);
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

  console.log('user',user)
  // const createCode = () => {
  //     generateCode(res => {
  //         if (res.promo_code) {
  //             notification.success({
  //                 message: t(`Notification`),
  //                 description: `${res.message}`,
  //                 placement: `bottomRight`,
  //                 duration: 1.5,
  //             });

  //             getProfile(user.data._id, res => {
  //                 if (res.user) {
  //                     setUserData(res.user)
  //                 } else {
  //                     notification.error({
  //                         message: t(`Notification`),
  //                         description: `${res.message}`,
  //                         placement: `bottomRight`,
  //                         duration: 1.5,
  //                     });
  //                 }
  //             })
  //         } else {
  //             notification.error({
  //                 message: t(`Notification`),
  //                 description: `${res.message}`,
  //                 placement: `bottomRight`,
  //                 duration: 1.5,
  //             });
  //         }
  //     })
  // }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol xs="12" sm="6">
          <CCard>
            <CCardBody>
              {userData ? (
                <Descriptions title={t("User's Info")} bordered>
                  {/* <Descriptions.Item label={t("Username")} span={3}>
                    {userData.username ? userData.username : ""}
                  </Descriptions.Item> */}
                  <Descriptions.Item label={t("Phone")} span={3}>
                    {userData.phone}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label={t("E-mail")} span={3}>
                    {userData.label ? userData.label : ""}
                  </Descriptions.Item> */}
                  <Descriptions.Item label={t("Role")} span={3}>
                    {userData.role}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("Created At")} span={3}>
                    {moment(userData.created_at).format("HH:mm DD-MM-YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("Updated At")} span={3}>
                    {moment(userData.updated_at).format("HH:mm DD-MM-YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("Status")} span={3}>
                    {userData.status === Status.ACTIVE.id
                      ? t(Status.ACTIVE.name)
                      : userData.status === Status.INACTIVE.id
                      ? t(Status.INACTIVE.name)
                      : t(Status.BLOCK.name)}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label={t("Promo Code")} span={3}>
                                        {userData.promo_code ?
                                            `${process.env.REACT_APP_PROMO_URL}${userData.promo_code}`
                                            : <Button onClick={() => createCode()}>
                                                {t("Generate Code")}
                                            </Button>}
                                    </Descriptions.Item> */}
                </Descriptions>
              ) : null}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default withNamespaces()(Profile);
