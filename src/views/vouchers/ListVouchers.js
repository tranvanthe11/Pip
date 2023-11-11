import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Table,
  Space,
  notification,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getListVouchers, searchVoucher } from "src/services/voucher";
import { withNamespaces } from "react-i18next";
import moment from "moment";


const ListVouchers = ({ t }) => {
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
  });
  const [data, setData] = useState();

  const services = useSelector((state) => state.services);

  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Voucher Name"),
      dataIndex: "voucher_name",
      render: (voucher_name) => <>{voucher_name}</>,
    },
    {
      title: t("Date of application"),
      dataIndex: "start_at",
      render: (start_at) => <>{moment(start_at).format("DD-MM-YYYY")}</>,
    },
    {
      title: t("End date"),
      dataIndex: "end_at",
      render: (end_at) => <>{moment(end_at).format("DD-MM-YYYY")}</>,
    },
    {
        title: t("Amount"),
        dataIndex: "amount",
        render: (amount) => <>{amount}</>,
      },
    {
      title: t("Action"),
      dataIndex: "_id",
      render: (_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/vouchers/${_id}`}>{t("Detail")}</Link>

            </Space>
          </>
        );
      },
    },
    
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListVouchers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        // let key = 1;
        res.data.voucher_list.forEach((voucher) => {
          voucher.key = key++;
        });

        setData(res.data.voucher_list);
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
    getListVouchers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        console.log('res.data',res.data)
        res.data.voucher_list.forEach((customer) => {
          customer.key = key++;
        });
        setData(res.data.voucher_list);
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

  const handleSearchVoucher = (voucher_name) => {
    searchVoucher(voucher_name, (res) => {
      if (res.status === 1) {
        console.log('hello',res.data)
        let key = 1;
        res.data.forEach((voucher) => {
          voucher.key = key++;
        });
        setData(res.data);
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
          description: `Search voucher failed.`,
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
          placeholder={t("Search voucher")}
          enterButton
          onSearch={handleSearchVoucher}
        />
        <CCard>
          <CCardHeader>{t("List Vouchers")}</CCardHeader>
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

export default withNamespaces()(ListVouchers);
