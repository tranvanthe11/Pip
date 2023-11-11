import React from "react";
import CIcon from "@coreui/icons-react";
import { Roles } from "src/configs";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: "info",
      text: "NEW",
    },
  },
  // Host's Services
  {
    _tag: "CSidebarNavTitle",
    _children: ["Resources"],
    permission: [Roles.SALE,  Roles.MARKETERS],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Customers",
    icon: "cil-user",
    permission: [Roles.SALES],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Customers",
        to: "/customers",
        permission: [Roles.SALES],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Customer",
        to: "/customers/create",
        permission: [Roles.SALES],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Drivers",
    icon: "cil-car-alt",
    permission: [Roles.SALES, Roles.OPERATOR],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Drivers",
        to: "/drivers",
        permission: [Roles.SALES, Roles.OPERATOR],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Driver",
        to: "/drivers/create",
        permission: [Roles.SALES, Roles.OPERATOR],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Vouchers",
    icon: "cil-car-alt",
    permission: [Roles.MARKETER],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Vouchers",
        to: "/vouchers",
        permission: [Roles.MARKETER ],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Voucher",
        to: "/vouchers/create",
        permission: [ Roles.MARKETER],
      },
    ],
  },
  //Next phase
  {
    _tag: "CSidebarNavTitle",
    _children: ["Services"],
    permission: [Roles.SALES],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Contracts",
    icon: "cil-cash",
    permission: [Roles.SALES, Roles.OPERATOR],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Contracts",
        to: "/contracts",
        permission: [Roles.SALES, Roles.OPERATOR],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Contract",
        to: "/contracts/create",
        permission: [Roles.SALES],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Orders",
    icon: "cil-cash",
    permission: [Roles.SALES],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Orders",
        to: "/orders",
        permission: [Roles.SALES],
      },
      {
        _tag: "CSidebarNavItem",
        name: "List Order-Airports",
        to: "/order-airports",
        permission: [Roles.SALES],
      },
    ],
  },
  {
    _tag: "CSidebarNavTitle",
    _children: ["Services"],
    permission: [Roles.ADMIN],
  },
  // Admin Services
  {
    _tag: "CSidebarNavDropdown",
    name: "Users",
    icon: "cil-cash",
    permission: [Roles.ADMIN],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Users",
        to: "/users",
        permission: [Roles.ADMIN],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add User",
        to: "/users/create",
        permission: [Roles.ADMIN],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "FLIGHT",
    icon: "cil-cash",
    permission: [Roles.ADMIN],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Flights",
        to: "/flights",
        permission: [Roles.ADMIN],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Flight",
        to: "/flights/create",
        permission: [Roles.ADMIN],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "FORMULA",
    icon: "cil-cash",
    permission: [Roles.ADMIN],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Formulas",
        to: "/formulas",
        permission: [Roles.ADMIN],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Add Formula",
        to: "/formulas/create",
        permission: [Roles.ADMIN],
      },
    ],
  },
  // Operator section
  // Analyst section
  {
    _tag: "CSidebarNavDropdown",
    name: "Quotation",
    icon: "cil-cash",
    permission: [Roles.ANALYST],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Quotations",
        to: "/quotations",
        permission: [Roles.ANALYST],
      },
    ],
  },
  //Accountant section
  {
    _tag: "CSidebarNavDropdown",
    name: "Debt Information",
    icon: "cil-cash",
    permission: [Roles.ACCOUNTANT],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "List Quotations",
        to: "/debt",
        permission: [Roles.ACCOUNTANT],
      },
    ],
  },
  {
    _tag: "CSidebarNavDropdown",
    name: "Notification",
    icon: "cil-cash",
    permission: [Roles.ADMIN],
    _children: [
      {
        _tag: "CSidebarNavItem",
        name: "Add notification",
        to: "/notification",
        permission: [Roles.ADMIN],
      },
    ],
  },
];

export default _nav;
