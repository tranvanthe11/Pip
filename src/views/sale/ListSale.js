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
// import socket from 'src/socket';

const ListCustomers = ({ t }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
  });
  const [data, setData] = useState();
  // const [provinceFilter, setProvinceFilter] = useState([]);
  // const [statusFilter, setStatusFilter] = useState([]);
  // const [statusFilterValue, setStatusFilterValue] = useState([0,1,2,3])
  // const provinces = useSelector(state => state.provinces);
  // const user = useSelector(state => state.user);

  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    // {
    //     title: t('Name'),
    //     dataIndex: 'name',
    //     render: name => <>{name}</>,
    //     // filters: provinceFilter,
    // },
    {
      title: t("Phone"),
      dataIndex: "phone",
      render: (phone) => <>{phone}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Type"),
      dataIndex: "role",
      render: (role) => <>{role}</>,
    },
    // {
    //     title: t('Avatar'),
    //     dataIndex: 'avatar',
    //     render: avatar => <Avatar src={avatar} />,
    // },
    // {
    //     title: t('Province'),
    //     dataIndex: 'province',
    //     render: province => <>{province.name}</>,
    //     filters: provinceFilter,
    // },
    // {
    //     title: t('Home'),
    //     dataIndex: 'home_address',
    //     render: home_address => <>{(home_address === '') ? t('EMPTY') : home_address}</>
    // },
    // {
    //     title: t('Office'),
    //     dataIndex: 'office_address',
    //     render: office_address => <>{(office_address === '') ? t('EMPTY') : office_address}</>
    // },
    // {
    //     title: t('Other'),
    //     dataIndex: 'other_address',
    //     render: other_address => <>{(other_address === '') ? t('EMPTY') : other_address}</>
    // },
    // {
    //     title: t('Price'),
    //     dataIndex: 'request',
    //     render: request => {
    //         let displayPrice;
    //         if (user.data.role === Roles.AGENCY) {
    //             if (request.discount) {
    //                 displayPrice = request.price - (request.price / 100 * request.discount)
    //                 displayPrice = Math.round(displayPrice / 1000) * 1000;
    //             } else {
    //                 displayPrice = request.price
    //             }

    //         } else if (user.data.role === Roles.HOST) {
    //             displayPrice = request.base_price
    //         }
    //         return (
    //             <>
    //                 {displayPrice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
    //             </>
    //         )
    //     }
    // },
    // {
    //     title: t('Driver\'s Name'),
    //     dataIndex: 'contract_driver',
    //     render: contract_driver => <>{contract_driver.name}</>
    // },
    // {
    //     title: t('Driver\'s Phone'),
    //     dataIndex: 'contract_driver',
    //     render: contract_driver => <>{contract_driver.phone}</>
    // },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        let color;
        let name;
        if (status === Status.ACTIVE.id) {
          color = "green";
          name = Status.ACTIVE.name;
        } else if (status === Status.INACTIVE.id) {
          color = "yellow";
          name = Status.INACTIVE.name;
        } else if (status === Status.BLOCK.id) {
          color = "volcano";
          name = Status.BLOCK.name;
        }

        return (
          <>
            <Tag color={color} key={name}>
              {name.toUpperCase()}
            </Tag>
          </>
        );
      },
      // filters: statusFilter,
      // filteredValue: statusFilterValue
    },
    {
      title: t("Action"),
      dataIndex: "_id",
      render: (_id) => {
        return (
          <>
            <Space size="middle">
              <Link to={`/users/${_id}`}>{t("Detail")}</Link>
            </Space>
          </>
        );
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    getListUsers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        // let key = 1;
        res.data.user_list.forEach((user) => {
          user.key = key++;
        });

        setData(res.data.user_list);
        setPagination({ ...pagination, total: res.metadata.total });
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
    // const { contract_status } = filters
    // console.log(contract_status);
    // if (contract_status === null) {
    //     setStatusFilterValue([])
    //     getListDrivers(pagination, {}, {}, (res => {
    //         if (res.status === 1) {
    //             // let key = 1;
    //             res.data.contract_list.forEach(contract => {
    //                 contract.key = key++;
    //             });

    //             setData(res.data.contract_list);
    //             setPagination({ ...pagination, total: res.metadata.total });
    //         } else if (res.status === 403) {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `${res.message + " " + res.expiredAt}`,
    //                 placement: `bottomRight`,
    //                 duration: 10,
    //             });
    //         } else {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `${res.message}`,
    //                 placement: `bottomRight`,
    //                 duration: 1.5,
    //             });
    //         }
    //     }));
    // } else {
    //     let filterStr = ''
    //     for (let i = 0; i < contract_status.length; i++) {
    //         if (i === (contract_status.length - 1)) {
    //             filterStr += `filter[]=${contract_status[i]}`
    //         } else {
    //             filterStr += `filter[]=${contract_status[i]}&`
    //         }
    //     }
    //     setStatusFilterValue(contract_status)
    //     getListDrivers(pagination, { filterStr }, {}, (res => {
    //         if (res.status === 1) {
    //             // let key = 1;
    //             res.data.contract_list.forEach(contract => {
    //                 contract.key = key++;
    //             });

    //             setData(res.data.contract_list);
    //             setPagination({ ...pagination, total: res.metadata.total });
    //         } else if (res.status === 403) {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `${res.message + " " + res.expiredAt}`,
    //                 placement: `bottomRight`,
    //                 duration: 10,
    //             });
    //         } else {
    //             notification.error({
    //                 message: t(`Notification`),
    //                 description: `${res.message}`,
    //                 placement: `bottomRight`,
    //                 duration: 1.5,
    //             });
    //         }
    //     }));
    // }
  };

  useEffect(() => {
    // if (user.data.role === Roles.SALES) {
    //     socket.getInstance(user.data._id, user.data.role).on("notification", (data) => {
    //         if (data.type === Notification.CONTRACT) {
    //             getListContracts(pagination, {}, {}, (res => {
    //                 if (res.status === 1) {
    //                     let key = 1;
    //                     res.data.contract_list.forEach(contract => {
    //                         contract.key = key++;
    //                     });

    //                     setData(res.data.contract_list);
    //                     setPagination({ ...pagination, total: res.metadata.total });
    //                 } else {
    //                     notification.error({
    //                         message: t(`Notification`),
    //                         description: `${res.message}`,
    //                         placement: `bottomRight`,
    //                         duration: 1.5,
    //                     });
    //                 }
    //             }));
    //         }
    //     })
    // }

    // provinces.forEach(province => {
    //     setProvinceFilter(provinceFilter => [...provinceFilter, { text: province.name, value: province._id }]);
    // });
    // let filterStr = 'filter[]=0&filter[]=1&filter[]=2&filter[]=3'
    // setStatusFilter([
    //     { text: Status.CONTRACT_NEW.name, value: Status.CONTRACT_NEW.id },
    //     { text: Status.CONTRACT_DRIVER_START.name, value: Status.CONTRACT_DRIVER_START.id },
    //     { text: Status.CONTRACT_DRIVER_GOING.name, value: Status.CONTRACT_DRIVER_GOING.id },
    //     { text: Status.CONTRACT_DRIVER_FINISH.name, value: Status.CONTRACT_DRIVER_FINISH.id },
    //     { text: Status.CONTRACT_DONE.name, value: Status.CONTRACT_DONE.id },
    //     { text: Status.CONTRACT_CANCELED.name, value: Status.CONTRACT_CANCELED.id },
    // ]);

    getListUsers(pagination, {}, {}, (res) => {
      if (res.status === 1) {
        let key = 1;
        res.data.user_list.forEach((user) => {
          user.key = key++;
        });

        setData(res.data.user_list);
        setPagination({ ...pagination, total: res.metadata.total });
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
          <CCardHeader>{t("List Users")}</CCardHeader>
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
