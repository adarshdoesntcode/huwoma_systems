import { Navigate } from "react-router-dom";

import Error from "@/components/error/Error";

import Dashboard from "@/features/dashboard/Dashboard";
import SimRacing from "@/features/simracing/SimRacing";
import Carwash from "@/features/carwash/Carwash";
import Parking from "@/features/parking/Parking";

import SettingsLayout from "@/components/layout/SettingsLayout";
import SettingsRoutes from "./SettingsRoutes";
import CarwashNewRecord from "@/features/carwash/CarwashNewRecord";
import CarwashInspection from "@/features/carwash/CarwashInspection";
import CarwashCheckout from "@/features/carwash/CarwashCheckout";
import CarwashNewBooking from "@/features/carwash/CarwashNewBooking";
import CarwashCustomers from "@/features/carwash/carwash_customers/CarwashCustomers";
import CarwashTransactions from "@/features/carwash/carwash_tranasactions/CarwashTransactions";
import CarwashCustomerDetails from "@/features/carwash/carwash_customers/CarwashCustomerDetails";
import Analytics from "@/features/analytics/Analytics";
import SimRacingNewRace from "@/features/simracing/SimRacingNewRace";

const PrivateRoutes = [
  {
    index: true,
    element: <Navigate replace to="dashboard" />,
    errorElement: <Error />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <Error />,
  },
  {
    path: "carwash",
    element: <Carwash />,
    errorElement: <Error />,
  },
  {
    path: "carwash/new",
    element: <CarwashNewRecord />,
    errorElement: <Error />,
  },
  {
    path: "carwash/booking",
    element: <CarwashNewBooking />,
    errorElement: <Error />,
  },
  {
    path: "carwash/inspection/:id",
    element: <CarwashInspection />,
    errorElement: <Error />,
  },
  {
    path: "carwash/checkout",
    element: <CarwashCheckout />,
    errorElement: <Error />,
  },
  {
    path: "carwash/transactions",
    element: <CarwashTransactions />,
    errorElement: <Error />,
  },
  {
    path: "carwash/customers",
    element: <CarwashCustomers />,
    errorElement: <Error />,
  },
  {
    path: "carwash/customers/:id",
    element: <CarwashCustomerDetails />,
    errorElement: <Error />,
  },
  {
    path: "simracing",
    element: <SimRacing />,
    errorElement: <Error />,
  },
  {
    path: "simracing/new",
    element: <SimRacingNewRace />,
    errorElement: <Error />,
  },
  {
    path: "simracing/booking",
    element: <SimRacing />,
    errorElement: <Error />,
  },
  {
    path: "simracing/customers",
    element: <SimRacing />,
    errorElement: <Error />,
  },
  {
    path: "simracing/transactions",
    element: <SimRacing />,
    errorElement: <Error />,
  },
  {
    path: "parking",
    element: <Parking />,
    errorElement: <Error />,
  },
  {
    path: "analytics",
    element: <Analytics />,
    errorElement: <Error />,
  },
  {
    path: "/settings",
    element: <SettingsLayout />,
    children: SettingsRoutes,
  },
];

export default PrivateRoutes;
