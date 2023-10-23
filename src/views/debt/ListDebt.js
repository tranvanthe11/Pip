import React, { useEffect, useState } from "react";
import { CCol, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";

import { Table, Space, Button, Tag, Divider, Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withNamespaces } from "react-i18next";
import { Status } from "src/configs";
import { getListDebt, payDebt } from "src/services/debt";
import { Validate } from "src/configs";

const debtInfo = [
  {
    key: 1,
    contract_id: 16072022116,
    created_at: "09:00 17/07/2022",
    unpaid_amount: 250000,
    status: Status.DEBT_NEW.id
  },
  {
    key: 2,
    contract_id: 16072022116,
    created_at: "09:00 17/07/2022",
    unpaid_amount: 250000,
    status: Status.DEBT_NEW.id
  },
  {
    key: 3,
    contract_id: 16072022116,
    created_at: "09:00 17/07/2022",
    unpaid_amount: 250000,
    status: Status.DEBT_NEW.id
  },
  {
    key: 4,
    contract_id: 16072022116,
    created_at: "09:00 17/07/2022",
    unpaid_amount: 250000,
    status: Status.DEBT_NEW.id
  },
  {
    key: 5,
    contract_id: 16072022116,
    created_at: "09:00 17/07/2022",
    unpaid_amount: 250000,
    status: Status.DEBT_NEW.id
  },
]

const ListDebt = ({ t }) => {

  const [data, setData] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [statusFilterValue, setStatusFilterValue] = useState([0])
  const [contractIdList, setContractIdList] = useState({})

  const [sumUnpaidAmount, setSumUnpaidAmount] = useState(0)
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    current: 1,
    pageSize: 100,
  })

  const Validator = (v) => {
    /*const regex_time = new RegExp(Validate.TIME_REGEX)
    const regex_date = new RegExp(Validate.DATE_REGEX)
    const target = v.split(" ")
    const input = {
        time: target[0],
        date: target[1]
    }
    const checkTime = regex_time.test(input.time) 
    const checkDate = regex_time.test(input.date)
    const checkPickupTime = (checkTime && checkDate) ? true : false
    return checkPickupTime;*/
    const target = v.split(" ")
                const input = {
                    time: target[0],
                    date: target[1]
                }
                const checkTime = Validate.TIME_REGEX.test(input.time)
                const checkDate = Validate.DATE_REGEX.test(input.date)
                const checkPickupTime = (checkTime && checkDate) ? true : false
                return checkPickupTime;
  }

  
  const columns = [
    {
      title: t("ID"),
      dataIndex: "key",
    },
    {
      title: t("Contract ID"),
      dataIndex: "customer_order_code",
      render: (contract) => <>{contract}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Created at"),
      dataIndex: "created_at",
      render: (date) => <>{date}</>,
      // filters: provinceFilter,
    },
    {
      title: t("Unpaid mount"),
      dataIndex: "unpaid_amount",
      render: (value) => <>{`${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}</>,
    },
    /*{
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        let color;
        let name;
        if (status === Status.DEBT_NEW.id) {
          color = "green";
          name = Status.DEBT_NEW.name;
        } else if (status === Status.DEBT_PAID.id) {
          color = "volcano";
          name = Status.DEBT_PAID.name;
        }
        return (
          <>
            <Tag color={color} key={name}>
              {name}
            </Tag>
          </>
        );
      },
      filters: statusFilter,
      filteredValue: statusFilterValue,
    }*/
  ]

  useEffect(() => {
    /*let filterStr = "filter[]=0&filter[]=1";
    setStatusFilter([
      { 
        text: Status.DEBT_NEW.name, 
        value: Status.DEBT_NEW.id 
      },
      {
        text: Status.DEBT_PAID.name,
        value: Status.DEBT_PAID.id,
      },
    ]);*/
    getListDebt({}, {}, {}, (res) => {
      if (res.status === 1) {
        console.log(res)
        let key = 1;
        let idList = []
        res.data.contracts.forEach((debt) => {
          debt.key = key++;
          idList.push(debt.contract_id)
        });
        setSumUnpaidAmount(res.data.sum_unpaid_amount)
        setData(res.data.contracts);
        setContractIdList({contracts_id: idList})
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
  const handleTableChange = (pagination, filters, sorter) => {
    let key = pagination.pageSize * (pagination.current - 1) + 1;
    const { contract_status } = filters;
    if (contract_status === null) {
      
      
    } else {
      
    }
  };

  const handleDebtPayment = () => {
    Modal.confirm({
      title: t(`Debt Payment`),
      icon: <ExclamationCircleOutlined />,
      content: t(
        `You are going to pay all debt? Are you sure you want to do this? You can't reverse this`
      ),
      onOk() {
        payDebt(contractIdList, (res) => {
          if (res.status === 1) {
            notification.success({
              message: t(`Notification`),
              description: `Pay all debt successful.`,
              placement: `bottomRight`,
              duration: 1.5,
            });
            setData([])
          } else {
            notification.error({
              message: t(`Notification`),
              description: res.message,
              placement: `bottomRight`,
              duration: 1.5,
            });
          }
        });
      },
      onCancel() {
        notification.info({
          message: t(`Notification`),
          description: t(`Stop debt payment contract`),
          placement: `bottomRight`,
          duration: 1.5,
        });
      },
      centered: true,
    });
  }

  return (
    <CRow>
      <CCol xs="12" md="8" className="mb-4">
        <CCard>
          <CCardHeader>{t("Debt Information")}</CCardHeader>
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
      <CCol xs="12" md="4" className="mb-4">
        <CCard>
          <CCardHeader>
            <b>Tổng công nợ</b>
            <Divider type="vertical" />
            <span>{`${sumUnpaidAmount} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}</span>
          </CCardHeader>
          <CCardBody>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: 'flex',
              }}
            >
              <Button 
                type="primary" 
                block htmlType="button"
                onClick={handleDebtPayment}
              >
                Thanh toán công nợ 
              </Button>
            </Space>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withNamespaces()(ListDebt);
