import React, { useEffect, useState, useMemo } from "react";
import { Tag, notification, Card, Spin, Row } from "antd";
import { Status } from "src/configs";
import { getListContracts } from "src/services/contract";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
// import socket from 'src/socket';

const ListContract = ({ t }) => {
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const { CheckableTag } = Tag;
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [statusFilterValue, setStatusFilterValue] = useState([0, 1, 2]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const history = useHistory();

  const car_types = useSelector((state) => state.carTypes);

  const getContractStatus = (status) => {
    let color;
    let name;
    if (status === Status.CONTRACT_NEW.id) {
      color = "green";
      name = Status.CONTRACT_NEW.name;
    } else if (status === Status.CONTRACT_DRIVER_START.id) {
      color = "yellow";
      name = Status.CONTRACT_DRIVER_START.name;
    } else if (status === Status.CONTRACT_DRIVER_GOING.id) {
      color = "orange";
      name = Status.CONTRACT_DRIVER_GOING.name;
    } else if (status === Status.CONTRACT_DRIVER_FINISH.id) {
      color = "gold";
      name = Status.CONTRACT_DRIVER_FINISH.name;
    } else if (status === Status.CONTRACT_DONE.id) {
      color = "blue";
      name = Status.CONTRACT_DONE.name;
    } else if (status === Status.CONTRACT_CANCELED.id) {
      color = "volcano";
      name = Status.CONTRACT_CANCELED.name;
    } else if (status === Status.CONTRACT_PAYMENT_DONE.id) {
      color = "purple";
      name = Status.CONTRACT_PAYMENT_DONE.name;
    }
    return {
      color: color,
      name: name,
    };
  };

  useEffect(() => {
    if (
      pagination.total > (pagination.current - 1) * pagination.pageSize ||
      pagination.current == 1
    ) {
      let filterStr = "filter[]=0&filter[]=1&filter[]=2";
      setStatusFilter([
        {
          text: Status.CONTRACT_NEW.name,
          value: Status.CONTRACT_NEW.id,
        },
        {
          text: Status.CONTRACT_DRIVER_START.name,
          value: Status.CONTRACT_DRIVER_START.id,
        },
        {
          text: Status.CONTRACT_DRIVER_GOING.name,
          value: Status.CONTRACT_DRIVER_GOING.id,
        },
        {
          text: Status.CONTRACT_DRIVER_FINISH.name,
          value: Status.CONTRACT_DRIVER_FINISH.id,
        },
        { text: Status.CONTRACT_DONE.name, value: Status.CONTRACT_DONE.id },
        {
          text: Status.CONTRACT_CANCELED.name,
          value: Status.CONTRACT_CANCELED.id,
        },
        {
          text: Status.CONTRACT_PAYMENT_DONE.name,
          value: Status.CONTRACT_PAYMENT_DONE.id,
        },
      ]);

      getListContracts(pagination, { filterStr }, {}, (res) => {
        // console.log(pagination, filterStr);
        if (res.status === 1) {
          setData((prev) => {
            return [...prev, ...res.data.contract_list];
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
    }
  }, []);

  const list =
    data &&
    data.map((contract) => {
      const contract_status = getContractStatus(contract.contract_status);
      return (
        <Card
          style={{
            "border-radius": "8px",
            margin: "0 0 10px 0",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            history.push(`/contracts/${contract._id}`);
          }}
        >
          <p>{`${
            contract?.car_type
              ? `Xe ${car_types[contract.car_type - 1].name}, `
              : ""
          }${contract.pickup_time}, Đón khách tại: ${
            contract.pick_up
          } => Đến: ${contract.drop_off}, ${contract.customer_name} - ${
            contract.customer_phone
          }`}</p>
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
                width: "180px",
              }}
            >
              <Tag color={"default"}>
                {contract.supplier_id ? t("Has Supplier") : t("No Supplier")}
              </Tag>
              <Tag color={contract_status.color} key={contract_status.name}>
                {contract_status.name}
              </Tag>
              <a href={`/contracts/${contract._id}`}>Chi tiết</a>
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
    setHasMore(true);
    setData([]);
    setPagination((prev) => {
      return {
        ...prev,
        total: 0,
        current: 1,
      };
    });
    if (nextSelectedTags === null) {
      setStatusFilterValue([]);
      getListContracts({}, {}, {}, (res) => {
        if (res.status === 1) {
          setData(res.data.contract_list);
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
      getListContracts({}, { filterStr }, {}, (res) => {
        // console.log(res);
        if (res.status === 1) {
          setData(res.data.contract_list);
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
    }
  };

  const fetchMoreData = () => {
    let filterStr = "";
    for (let i = 0; i < selectedTags.length; i++) {
      if (i === selectedTags.length - 1) {
        filterStr += `filter[]=${selectedTags[i].value}`;
      } else {
        filterStr += `filter[]=${selectedTags[i].value}&`;
      }
    }
    // console.log({
    //   data: data.length,
    //   pagination: pagination.total,
    // });
    if (data.length >= pagination.total) {
      setHasMore(false);
      return;
    }
    getListContracts(pagination, { filterStr }, {}, (res) => {
      if (res.status === 1) {
        setData((prev) => {
          return [...prev, ...res.data.contract_list];
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
          width: "370px",
          justifyContent: "space-between",
        }}
      >
        {statusFilter.map((tag, index) => (
          <div>
            <CheckableTag
              color={getContractStatus(tag.value).color}
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
                <Tag color={getContractStatus(tag.value).color}>{tag.text}</Tag>
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

export default withNamespaces()(ListContract);
