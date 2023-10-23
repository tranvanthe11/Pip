import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Table,
  Tag,
  Space,
  notification,
  // Avatar
} from "antd";
import { Notification, Roles, Status, Type } from "src/configs";
import { Link } from "react-router-dom";
// import moment from 'moment';
// import { useSelector } from 'react-redux';
import { getListUsers } from "src/services/user";
import { numberWithCommas } from "src/services/money";
import { withNamespaces } from "react-i18next";
import { pagination as pag } from "src/configs/Pagination";
import { getListFlights } from "src/services/flight";
import { getListFormulas } from "src/services/formula";
import { useSelector } from "react-redux";
// import socket from 'src/socket';

const ListFormula = ({ t }) => {
  const [pagination, setPagination] = useState(pag);
  const [data, setData] = useState();
  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Service"),
      dataIndex: "service_name",
    },
    {
      title: t("Airport"),
      dataIndex: "airport_name",
      //render: (phone) => <>{phone}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Province"),
      dataIndex: "province_name",
      //render: (role) => <>{role}</>,
    },
    {
      title: t("District"),
      dataIndex: "district_name",
      //render: (role) => <>{role}</>,
    },
    {
      title: t("Car Type"),
      dataIndex: "car_type_name",
      // render: (price) => <>{price + "000VND"}</>,
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (price) => <>{numberWithCommas(price) + " VND"}</>,
    },
    {
      title: t("Serve"),
      dataIndex: "serve",
      render: (serve) => (
        <>
          {serve == 1 ? (
            <Tag color="green">{t("Yes")}</Tag>
          ) : serve == 0 ? (
            <Tag color="red">{t("No")}</Tag>
          ) : (
            <Tag color="orange">{t("Undefined")}</Tag>
          )}
        </>
      ),
    },
    {
      title: t("Action"),
      dataIndex: "first_protocol_id",
      render: (first_protocol_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/formulas/${first_protocol_id}`}>{t("Detail")}</Link>
            </Space>
          </>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListFormulas(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        // let key = 1;
        res.data.first_protocol_list.forEach((protocol) => {
          protocol.key = key++;
        });

        setData(res.data.first_protocol_list);
        setPagination({...pagination, total: res.data.meta_data.total})

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
    }, []);
  };

  useEffect(() => {
    getListFormulas(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.first_protocol_list.forEach((flight) => {
          flight.key = key++;
        });
        setData(res.data.first_protocol_list);
        console.log(res)
        setPagination({ ...pagination, total: res.meta_data.total });
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
  return (
    <CRow className="position-relative">
      <CCol xs="12" md="12" className="mb-4 position-absolute">
        <CCard>
          <CCardHeader>{t("List Formulas")}</CCardHeader>
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

export default withNamespaces()(ListFormula);
