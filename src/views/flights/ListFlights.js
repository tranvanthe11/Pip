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
import { withNamespaces } from "react-i18next";
import { pagination as pag } from "src/configs/Pagination";
import { getListFlights } from "src/services/flight";
// import socket from 'src/socket';

const ListFlights = ({ t }) => {
  const [pagination, setPagination] = useState(pag);
  const [data, setData] = useState();

  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Flight Number"),
      dataIndex: "flight_number",
    },
    {
      title: t("Departure Time"),
      dataIndex: "departure",
      //render: (phone) => <>{phone}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Arrival Time"),
      dataIndex: "arrival",
      //render: (role) => <>{role}</>,
    },
    {
      title: t("Action"),
      dataIndex: "flight_number_id",
      render: (flight_number_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/flights/${flight_number_id}`}>{t("Detail")}</Link>
            </Space>
          </>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListFlights(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.flight_number_list.forEach((flight) => {
          flight.key = key++;
          flight.departure = `${
            flight.departure_hour < 10
              ? "0" + flight.departure_hour
              : flight.departure_hour
          }h${
            flight.departure_mins < 10
              ? "0" + flight.departure_mins
              : flight.departure_mins
          }`;
          flight.arrival = `${
            flight.arrival_hour < 10
              ? "0" + flight.arrival_hour
              : flight.arrival_hour
          }h${
            flight.arrival_mins < 10
              ? "0" + flight.arrival_mins
              : flight.arrival_mins
          }`;
        });
        setData(res.data.flight_number_list);
        //setPagination({ ...pagination, total: res.metadata.total });
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
    getListFlights(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.flight_number_list.forEach((flight) => {
          flight.key = key++;
          flight.departure = `${
            flight.departure_hour < 10
              ? "0" + flight.departure_hour
              : flight.departure_hour
          }h${
            flight.departure_mins < 10
              ? "0" + flight.departure_mins
              : flight.departure_mins
          }`;
          flight.arrival = `${
            flight.arrival_hour < 10
              ? "0" + flight.arrival_hour
              : flight.arrival_hour
          }h${
            flight.arrival_mins < 10
              ? "0" + flight.arrival_mins
              : flight.arrival_mins
          }`;
        });
        setData(res.data.flight_number_list);
        //setPagination({ ...pagination, total: res.metadata.total });
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
    <CRow>
      <CCol xs="12" md="12" className="mb-4">
        <CCard>
          <CCardHeader>{t("List Flights")}</CCardHeader>
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

export default withNamespaces()(ListFlights);
