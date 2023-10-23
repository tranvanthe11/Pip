import React, { useEffect, useState } from 'react';
import { getListQuotation } from 'src/services/quotation';

import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { Table, Tag, Space, notification } from "antd";

import { withNamespaces } from "react-i18next";
const QuotationList = ({ t }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
  });

  const [data, setData] = useState();
  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Flight Number"),
      dataIndex: "flight_number",
      render: (flight_number) => <>{flight_number}</>,
    },
    {
      title: t("Service"),
      dataIndex: "service_id",
      render: (service_id) => <>{service_id === 1 ? "Đi lên sân bay" : "Đón tại sân bay"}</>,
    },
    {
      title: t("Car Type"),
      dataIndex: "car_type_name_id",
      render: (car_type_name_id) => {
        let car_type = ""
        if (car_type_name_id === 1) {
          car_type = "Xe 5 chỗ"
        } else if(car_type_name_id === 2) {
          car_type = "Xe 7 chỗ"
        } else if(car_type_name_id === 3) {
          car_type = "Xe 16 chỗ"
        } else if(car_type_name_id === 4) {
          car_type = "Xe 29 chỗ thân dài"
        } else if(car_type_name_id === 5) {
          car_type = "Xe 35 chỗ"
        } else if(car_type_name_id === 6) {
          car_type = "Xe 45 chỗ"
        } else {
          car_type = "Chưa phục vụ"
        }

        return (
          <>
            {car_type}
          </>
        );
      },
    },
    {
      title: t("Pickup Location"),
      dataIndex: "pick_up",
      render: (pick_up, data) => {
        let pickup_location = ""
        if (data.service_id === 1) {
          pickup_location = data.address
        } else {
          pickup_location = "Sân bay Nội Bài"
        }
        return (
          <>{pickup_location}</>
        )
      },
    },
    {
      title: t("Drop Off Location"),
      dataIndex: "drop_off",
      render: (drop_off, data) => {
        let dropoff_location = ""
        if (data.service_id === 1) {
          dropoff_location = "Sân bay Nội Bài"
        } else {
          dropoff_location = data.address
        }
        return (
          <>{dropoff_location}</>
        )
      },
    },
    {
      title: t("Pickup Time"),
      dataIndex: "pickup_time",
      render: (pickup_time) => <>{pickup_time}</>,
    },
    {
      title: t("Price"),
      dataIndex: "price",
      render: (price) => <>{`${price} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>,
    },
  ]

  useEffect(() => {
    getListQuotation(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.quotation_list.forEach((quotation) => {
          quotation.key = key++;
        });
        setData(res.data.quotation_list)
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
    },[])
  },[])

  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListQuotation(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        // let key = 1;
        res.data.quotation_list.forEach((quotation) => {
          quotation.key = key++;
        });

        setData(res.data.quotation_list);
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
  return (
    <CRow>
      <CCol xs="12" md="12" className="mb-4">
        <CCard>
          <CCardHeader>{t("List Quotations")}</CCardHeader>
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
  )
}

export default withNamespaces()(QuotationList);