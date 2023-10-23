import React, { useEffect, useState } from "react";
import { Tag, notification, Card, Spin, Row } from "antd";
import { withNamespaces } from "react-i18next";
// import { getListOrders } from "src/services/order";
import { getListOrderAirports } from "src/services/orderAirport";
import { OrderStatus } from "src/configs/OrderStatus";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const ListOrderAirports = ({ t }) => {
  const { CheckableTag } = Tag;
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
  const [selectedTags, setSelectedTags] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const filterStr = "filter[]=0";
    setStatusFilter(OrderStatus());
    getListOrderAirports(pagination, { filterStr }, {}, (res) => {
      if (res.status === 1) {
        setData((prev) => {
          return [...prev, ...res.data.order_airport_list];
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
  }, []);

  const list =
    data &&
    data.map((order) => {
      return (
        <Card
          style={{
            "border-radius": "8px",
            margin: "0 0 10px 0",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/order-airports/${order.order_airport_id}`);
          }}
        >
          <p>{`${order?.car_type_name ? `Xe ${order.car_type_name}, ` : ""}${
            order.pickup_time
          }, Đón khách tại: ${
            order.service_name === "Đón tại sân bay"
              ? order.airport_name
              : order.address
          } => Đến: ${
            order.service_name === "Đón tại sân bay"
              ? order.address
              : order.airport_name
          }, ${order.name} - ${order.phone}`}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "210px",
              }}
            >
              <Tag color={"default"}>{order.service_name}</Tag>
              <Tag
                color={statusFilter[order.order_airport_status].color}
                key={statusFilter[order.order_airport_status].text}
              >
                {statusFilter[order.order_airport_status].text}
              </Tag>
              <a href={`/order-airports/${order.order_airport_id}`}>Chi tiết</a>
            </div>
          </div>
        </Card>
      );
    });

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags((prev) => (prev = nextSelectedTags));

    if (nextSelectedTags === null) {
      setStatusFilterValue([]);
      getListOrderAirports({}, {}, {}, (res) => {
        if (res.status === 1) {
          setData(res.data.order_airport_list);
          setPagination((prev) => {
            return { ...prev, total: res.data.meta_data.total };
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
    } else {
      let filterStr = "";
      for (let i = 0; i < nextSelectedTags.length; i++) {
        if (i === nextSelectedTags.length - 1) {
          filterStr += `filter[]=${nextSelectedTags[i].value}`;
        } else {
          filterStr += `filter[]=${nextSelectedTags[i].value}&`;
        }
      }
      setStatusFilterValue(nextSelectedTags);
      getListOrderAirports({}, { filterStr }, {}, (res) => {
        // console.log(res);
        if (res.status === 1) {
          setData(res.data.order_airport_list);
          setPagination((prev) => {
            return { ...prev, total: res.data.meta_data.total };
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
    }
  };

  const fetchMoreData = () => {
    if (data.length >= pagination.total) {
      setHasMore(false);
      return;
    }

    getListOrderAirports(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        setData((prev) => {
          return [...prev, ...res.data.order_airport_list];
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

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          maxWidth: "100%",
          width: "180px",
          justifyContent: "space-between",
        }}
      >
        {statusFilter.map((tag, index) => (
          <div>
            <CheckableTag
              color={tag.color}
              key={index}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={(checked) => handleChange(tag, checked)}
            >
              {selectedTags.indexOf(tag) > -1 ? (
                <div
                  style={{
                    border: "1px solid #3c4b64",
                    padding: "0 7px 0 7px",
                  }}
                >
                  {tag.text}
                </div>
              ) : (
                <Tag color={tag.color}>{tag.text}</Tag>
              )}
            </CheckableTag>
          </div>
        ))}
      </div>
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
