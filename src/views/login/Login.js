import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
  CCardImg,
} from "@coreui/react";
import {
  Form,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
  Checkbox,
  message,
  Radio,
  notification,
} from "antd";
import car_image from "src/assets/car_image.svg";
import classes from "./Login.module.css";
import { Roles, Validate } from "src/configs";
import { useDispatch, useSelector } from "react-redux";
import { login } from "src/actions/user";
import { storeUserData } from "src/services/auth";
import i18n from "src/services/i18n";
import { withNamespaces } from "react-i18next";
import { loginUser } from "src/services/user";
import NavbarLogin from "./navbar/NavbarLogin";

var _ = require("lodash");

const Login = ({ t }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    loginUser(values, (res) => {
      dispatch(login(res));
      if (res.status === 0) {
        notification.error({
          message: t(`Notification`),
          description: t(`${res.message}`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  };
  // console.log(user)
  useEffect(() => {
    setLoading(false);
    if (Object.keys(user).length !== 0 && Object.keys(user.data).length !== 0) {
      if (user.status && user.status !== 1) {
        notification.error({
          message: t(`Notification`),
          description: `${user.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      } else {
        if (!_.isEmpty(user.data)) {
          i18n.changeLanguage("vi");
          storeUserData(user.data);
          if (user.data.role === Roles.ADMIN) {
            history.push("/users");
          } else if (user.data.role === Roles.SALES) {
            history.push("/contracts");
          } else if (user.data.role === Roles.OPERATOR) {
            history.push("/contracts");
          } else if (user.data.role === Roles.ANALYST) {
            history.push("/quotations")
          } else if (user.data.role === Roles.ACCOUNTANT) {
            history.push("/debt")
          } else {
            message.error("Permission is empty.");
          }
        } else {
          message.error("User data is empty.");
        }
      }
    } else {
      notification.info({
        message: t(`Notification`),
        description: t(`Welcome back User`),
        placement: `bottomRight`,
        duration: 2.5,
      });
    }
  }, [user.data]);

  return (
    <div
      className={classes.login}
      style={{ height: "100%", minHeight: "100%" }}
    >
      <NavbarLogin></NavbarLogin>
      <Row span={24} className={classes["login-container"]}>
        <Col lg={12} className={classes["left-side"]}>
          <h2>{t("Login")}</h2>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            className="position-relative"
          >
            <label htmlFor="phone">{t("Phone")}</label>
            <Form.Item
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
              <input 
                placeholder={t("Phone")} 
                className="login-input"
                type="number" 
                pattern="\d*"
              />
            </Form.Item>
            <label htmlFor="password">{t("Password")}</label>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: t("Please input your Password!"),
                },
              ]}
            >
              <Input
                type="password"
                className="login-input"
                placeholder={t("Password")}
              />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{t("Remember me")}</Checkbox>
            </Form.Item>
            {/* <Form.ErrorList errors/> */}
            <button htmltype="submit" className={classes["box-1"]}>
              {t("Login")}
            </button>
          </Form>
        </Col>
        <Col lg={12} className={classes["right-side"]}>
          <img src={car_image} alt="car" />
        </Col>
      </Row>
      <div className={classes.footer}>Pippip version 1.1</div>
    </div>
  );
};

export default withNamespaces()(Login);
