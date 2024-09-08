import { Navigate } from "react-router-dom";

import Error from "@/components/error/Error";

import Dashboard from "@/features/dashboard/Dashboard";
import SimRacing from "@/features/simracing/SimRacing";
import Carwash from "@/features/carwash/Carwash";
import Parking from "@/features/parking/Parking";
import Analytics from "@/features/analytics/Analytics";

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
];

export default PrivateRoutes;
