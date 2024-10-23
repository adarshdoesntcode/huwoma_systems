import { Navigate } from "react-router-dom";

import Error from "@/components/error/Error";

import Dashboard from "@/features/dashboard/Dashboard";
import SimRacing from "@/features/simracing/SimRacing";
import Carwash from "@/features/carwash/Carwash";
import Parking from "@/features/parking/Parking";
import Analytics from "@/features/analytics/Analytics";
import SettingsLayout from "@/components/layout/SettingsLayout";
import SettingsRoutes from "./SettingsRoutes";
import CarwashNewRecord from "@/features/carwash/CarwashNewRecord";

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
    path: "simracing",
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
