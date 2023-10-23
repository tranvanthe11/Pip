import React, { useEffect, useState } from "react";
import { Card, Tag, Space, notification, Avatar, Spin, Row, Input } from "antd";
import { Domain } from "src/configs";
import { Link } from "react-router-dom";
import { getListDrivers, searchDriver } from "src/services/driver";
import { withNamespaces } from "react-i18next";
// import { getListOrders } from "src/services/order";
import { getListOrderAirports } from "src/services/orderAirport";
import { OrderStatus } from "src/configs/OrderStatus";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const ListOrderAirports = ({ t }) => {
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const [data, setData] = useState([]);
  const listNotifications = useSelector((state) => state.notification).data
    ?.orderAirport;
  const [statusFilter, setStatusFilter] = useState([]);
  const [statusFilterValue, setStatusFilterValue] = useState([0]);
  const [hasMore, setHasMore] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const filterStr = "filter[]=0";
    setStatusFilter(OrderStatus());
    getListDrivers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        setData((prev) => {
          return [...prev, ...res.data.supplier_list];
        });

        setPagination((prev) => {
          return {
            ...prev,
            total: res.data.meta_data.total,
            current: prev.current + 1,
          };
        });
      } else if (res.status === 403) {
        setData([]);
        notification.error({
          message: t(`Notification`),
          description: `${res.message + " " + res.expiredAt}`,
          placement: `bottomRight`,
          duration: 10,
        });
      } else {
        setData([]);
        notification.error({
          message: t(`Notification`),
          description: `${res.message}`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  }, [listNotifications]);

  const list =
    data &&
    data.map((driver) => {
      return (
        <Card
          style={{
            "border-radius": "8px",
            margin: "0 0 10px 0",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/drivers/${driver._id}`);
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              style={{
                height: 100,
                width: 100,
              }}
              src={Domain.BASE_DOMAIN + "/" + driver.avatar}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <b>{`${driver.name} - xe ${driver.car_type}`}</b>
              <span>{driver.phone}</span>
              <span>{driver?.car_name}</span>
              <span>{driver?.car_number}</span>
            </div>
          </div>
        </Card>
      );
    });

  const fetchMoreData = () => {
    if (data.length >= pagination.total) {
      setHasMore(false);
      return;
    }

    getListDrivers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        setData((prev) => {
          return [...prev, ...res.data.supplier_list];
        });
        setPagination((prev) => {
          return {
            ...prev,
            total: res.data.meta_data.total,
            current: prev.current + 1,
          };
        });
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

  const handleSearchDriver = (index) => {
    searchDriver(index, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.supplier_list.forEach((customer) => {
          customer.key = key++;
        });
        setData(res.data.supplier_list);
        setPagination({ ...pagination, total: res.data.supplier_list.length });
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
          description: `Search driver failed.`,
          placement: `bottomRight`,
          duration: 1.5,
        });
      }
    });
  };

  return (
    <div>
      <Input.Search
        size="large"
        placeholder={t("Search driver")}
        enterButton
        onSearch={handleSearchDriver}
        style={{
          marginBottom: "10px",
        }}
      />
      <InfiniteScroll
        dataLength={data?.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Row
            justify="center"
            align="middle"
            style={{
              height: "40px",
            }}
          >
            <Spin />
          </Row>
        }
      >
        {list}
      </InfiniteScroll>
    </div>
  );
};

export default withNamespaces()(ListOrderAirports);
