const Type = {
  TO_AIRPORT: 0,
  FROM_AIRPORT: 1,
  TRANSFER_MONEY: {
    id: 1,
    name: "Transfer money",
  },
  PAY_IN_CASH: {
    id: 0,
    name: "Pay in Cash",
  },
  PICKUP_LOCATION: 1,
  DROP_OFF_LOCATION: 2,
  DRIVER_RECHARGE: 4,
  DRIVER_WITHDRAW: 5,
  PREPAY: {
    id: 1,
    name: "Pre pay 100%",
  },
  POSTPAID: {
    id: 2,
    name: "Post paid 100%",
  },
  INSTALMENT_PAYMENT: {
    id: 3,
    name: "Instalment payment",
  },
  PAYMENT_PENDING: {
    id: 0,
    name: "Unpaid",
  },
  PAYMENT_SUCCESS: {
    id: 1,
    name: "Paid",
  },
  MAIN_CUSTOMER: {
    id: 1,
    name: "Main customer",
  },
  SUB_CUSTOMER: {
    id: 0,
    name: "Sub customer",
  },
};

export default Type;
