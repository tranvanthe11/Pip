import React from "react";
import { Roles } from "./configs";

const OrderAirportDetail = React.lazy(() =>
  import("./views/order-airport/OrderAirportDetail")
);
const ListOrderAirports = React.lazy(() =>
  import("./views/order-airport/ListOrderAirports")
);
const ListFormula = React.lazy(() => import("./views/formula/ListFormula"));
const AddFormula = React.lazy(() => import("./views/formula/AddFormula"));
const FormulaDetail = React.lazy(() => import("./views/formula/FormulaDetail"));
const ListFlights = React.lazy(() => import("./views/flights/ListFlights"));
const AddFlight = React.lazy(() => import("./views/flights/AddFlight"));
const FlightDetail = React.lazy(() => import("./views/flights/FlightDetail"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const ListOrders = React.lazy(() => import("./views/order/ListOrders"));
const ListRequests = React.lazy(() => import("./views/request/ListRequest"));
const CreateRequest = React.lazy(() => import("./views/request/CreateRequest"));
const RequestDetail = React.lazy(() => import("./views/request/RequestDetail"));
const ListContracts = React.lazy(() => import("./views/contract/ListContract"));
const ListContractOperator = React.lazy(() =>
  import("./views/contract-operator/ListContractOperator")
);
const ContractOperatorDetail = React.lazy(() =>
  import("./views/contract-operator/ContractOperatorDetail")
);
const ContractDetail = React.lazy(() =>
  import("./views/contract/ContractDetail")
);
const CreateContract = React.lazy(() =>
  import("./views/contract/CreateContract")
);
const OrderDetail = React.lazy(() =>
  import("./views/order/order_detail/OrderDetail")
);
// const ListCars = React.lazy(() => import('./views/hostCar/ListCar'));
const ListDrivers = React.lazy(() => import("./views/driver/ListDriver"));
const DriverDetail = React.lazy(() => import("./views/driver/DriverDetail"));
const AddDriver = React.lazy(() => import("./views/driver/AddDriver"));
const ListCustomers = React.lazy(() =>
  import("./views/customers/ListCustomers")
);
const CustomerDetail = React.lazy(() =>
  import("./views/customers/CustomerDetail")
);
const AddCustomer = React.lazy(() => import("./views/customers/AddCustomer"));
const Profile = React.lazy(() => import("./views/user/Profile"));
const ListSale = React.lazy(() => import("./views/sale/ListSale"));
const SaleDetail = React.lazy(() => import("./views/sale/SaleDetail"));
const AddSale = React.lazy(() => import("./views/sale/AddSale"));
const QuotationList = React.lazy(() => import("./views/analyst/QuotationList"));
const ListDebt = React.lazy(() => import("./views/debt/ListDebt"));
const AddNotification = React.lazy(() => import("./views/notification/AddNotification"));
const AddressLabel = React.lazy(() => import("./views/customers/AddressLabel"));
// const ListRequestTransaction = React.lazy(() => import('./views/transaction/ListRequestTransaction'));
// const ListDriverTransaction = React.lazy(() => import('./views/transaction/ListDriverTransaction'));

const routes = [
  { path: "/", exact: true, component: Dashboard, name: "Home" },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    permission: [Roles.ADMIN, Roles.SALES, Roles.OPERATOR, Roles.ANALYST],
  },
  // Request's route - next phase
  {
    path: "/requests",
    name: "Requests",
    component: ListRequests,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/requests/create",
    name: "Create Request",
    component: CreateRequest,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/requests/:id",
    name: "Request Detail",
    component: RequestDetail,
    permission: [Roles.ADMIN],
    exact: true,
  },
  // Contract's route
  {
    path: "/contracts",
    name: "List Contracts",
    component: ListContracts,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/contracts/create",
    name: "Add Contract",
    component: CreateContract,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/contracts/:id",
    name: "Contract Detail",
    component: ContractDetail,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/contracts/:id",
    name: "Contract Operator Detail",
    component: ContractOperatorDetail,
    permission: [Roles.OPERATOR],
    exact: true,
  },
  {
    path: "/contracts",
    name: "List Contracts Operator",
    component: ListContractOperator,
    permission: [Roles.OPERATOR],
    exact: true,
  },
  // SALE's services route
  {
    path: "/drivers",
    name: "Drivers",
    component: ListDrivers,
    permission: [Roles.SALES, Roles.OPERATOR],
    exact: true,
  },
  {
    path: "/drivers/create",
    name: "Add Driver",
    component: AddDriver,
    permission: [Roles.SALES, Roles.OPERATOR],
    exact: true,
  },
  {
    path: "/drivers/:id",
    name: "Driver Detail",
    component: DriverDetail,
    permission: [Roles.SALES, Roles.OPERATOR],
    exact: true,
  },
  {
    path: "/orders",
    name: "List Orders",
    component: ListOrders,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/orders/:id",
    name: "Order Detail",
    component: OrderDetail,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/order-airports",
    name: "List Order-Airports",
    component: ListOrderAirports,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/order-airports/:id",
    name: "Order-Airport Detail",
    component: OrderAirportDetail,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/customers",
    name: "Customers",
    component: ListCustomers,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/customers/create",
    name: "Add Customer",
    component: AddCustomer,
    permission: [Roles.SALES],
    exact: true,
  },
  {
    path: "/customers/:id",
    name: "Customer Detail",
    component: CustomerDetail,
    permission: [Roles.SALES],
    exact: true,
  },
  // User's route
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    permission: [Roles.SALES, Roles.ADMIN, Roles.OPERATOR, Roles.ANALYST],
    exact: true,
  },
  // ADMIN's Route
  {
    path: "/users",
    name: "List Users",
    component: ListSale,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/users/create",
    name: "Add User",
    component: AddSale,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/users/:id",
    name: "User Detail",
    component: SaleDetail,
    permission: [Roles.ADMIN],
    exact: true,
  },
  // Flight
  {
    path: "/flights",
    name: "List Flights",
    component: ListFlights,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/flights/create",
    name: "Add Flight",
    component: AddFlight,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/flights/:id",
    name: "Flight Detail",
    component: FlightDetail,
    permission: [Roles.ADMIN],
    exact: true,
  },
  // FORMULA
  {
    path: "/formulas",
    name: "List Formulas",
    component: ListFormula,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/formulas/create",
    name: "Add Formula",
    component: AddFormula,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/formulas/:id",
    name: "Formula Detail",
    component: FormulaDetail,
    permission: [Roles.ADMIN],
    exact: true,
  },
  //ANALYST
  {
    path: "/quotations",
    name: "Quotation List",
    component: QuotationList,
    permission: [Roles.ANALYST],
    exact: true,
  },
  {
    path: "/debt",
    name: "Debt Information",
    component: ListDebt,
    permission: [Roles.ACCOUNTANT],
    exact: true,
  },
  {
    path: "/notification",
    name: "Add notification",
    component: AddNotification,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: "/customers/address-label/:id",
    name: "Address label",
    component: AddressLabel,
    permission: [Roles.SALES],
    exact: true,
  },
];

export default routes;
