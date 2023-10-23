import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Table,
  // Tag,
  Space,
  notification,
  Select,
  Input,
  Button,
  // Avatar
} from "antd";
// import { Notification, Roles, Status, Type } from 'src/configs';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import moment from 'moment';
// import { useSelector } from 'react-redux';
import { getListCustomers, searchCustomer } from "src/services/customer";
import { withNamespaces } from "react-i18next";
// import socket from 'src/socket';

const ListCustomers = ({ t }) => {
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
  });
  const [data, setData] = useState();
  const [type, setType] = useState(1);
  // const [provinceFilter, setProvinceFilter] = useState([]);
  // const [statusFilter, setStatusFilter] = useState([]);
  // const [statusFilterValue, setStatusFilterValue] = useState([0,1,2,3])
  // const provinces = useSelector(state => state.provinces);
  // const user = useSelector(state => state.user);
  const services = useSelector((state) => state.services);

  console.log(data);
  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      render: (name) => <>{name}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
      render: (phone) => <>{phone}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Type"),
      dataIndex: "type",
      render: (type) => <>{type}</>,
    },
    {
      title: t("Home"),
      dataIndex: "home_address",
      render: (home_address) => (
        <>{home_address === "" ? t("EMPTY") : home_address}</>
      ),
    },
    {
      title: t("OTP"),
      dataIndex: "otp",
      render: (otp) => <>{otp === "" ? t("EMPTY") : otp}</>,
    },
    {
      title: t("Action"),
      dataIndex: "_id",
      render: (_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/customers/${_id}`}>{t("Detail")}</Link>
            </Space>
          </>
        );
      },
    },
    {
      title: t("Create contract"),
      dataIndex: "_id",
      render: (_id) => {
        return (
          <>
            <Space
              direction="horizontal"
              size="middle"
              style={{
                display: "flex",
              }}
            >
              <Select
                placeholder={t("Contract type")}
                onChange={(value) => setType(value)}
                defaultValue={1}
              >
                {services.map((service) => (
                  <Select.Option value={service.name_id}>
                    {service.name}
                  </Select.Option>
                ))}
              </Select>
              <Button size="middle" type="primary">
                <Link
                  to={{
                    pathname: `/contracts/create`,
                    state: { customer_id: _id, type: type },
                  }}
                >
                  {t("Create contract")}
                </Link>
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListCustomers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        // let key = 1;
        res.data.customer_list.forEach((customer) => {
          customer.key = key++;
        });

        setData(res.data.customer_list);
        setPagination({ ...pagination, total: res.data.meta_data.total });
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
  };

  useEffect(() => {
    getListCustomers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.customer_list.forEach((customer) => {
          customer.key = key++;
        });
        setData(res.data.customer_list);
        setPagination({ ...pagination, total: res.data.meta_data.total });
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
  }, []);

  const handleSearchCustomer = (index) => {
    searchCustomer(index, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.customer_list.forEach((customer) => {
          customer.key = key++;
        });
        setData(res.data.customer_list);
        setPagination({ ...pagination, total: res.data.meta_data.total });
      } else if (res.status === 3) {
        setData([]);
        notification.error({
          message: t(`Notification`),
          description: `Data is not found. Please try again.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      } else {
        notification.error({
          message: t(`Notification`),
          description: `Search customer failed.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  };
  return (
    <CRow>
      <CCol xs="12" md="12" className="mb-4">
        <Input.Search
          size="large"
          placeholder={t("Search customer")}
          enterButton
          onSearch={handleSearchCustomer}
        />
        <CCard>
          <CCardHeader>{t("List Customer")}</CCardHeader>
          <CCardBody>
            <Table
              className="overflow-auto"
              columns={columns}
              dataSource={data}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(ListCustomers);
