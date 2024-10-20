import { Navigate } from "react-router-dom";

import Error from "@/components/error/Error";

import GeneralSettings from "@/features/settings/GeneralSettings";
import CarwashSettings from "@/features/settings/carwash-settings/CarwashSettings";
import CarwashNewConfig from "@/features/settings/carwash-settings/CarwashNewConfig";
import CarwashEditConfig from "@/features/settings/carwash-settings/CarwashEditConfig";
import PaymentSettings from "@/features/settings/payments/PaymentSettings";

const SettingsRoutes = [
  {
    index: true,
    element: <Navigate replace to="general" />,
    errorElement: <Error />,
  },
  {
    path: "general",
    element: <GeneralSettings />,
    errorElement: <Error />,
  },
  {
    path: "c-wash",
    element: <CarwashSettings />,
    errorElement: <Error />,
  },
  {
    path: "c-wash/new",
    element: <CarwashNewConfig />,
    errorElement: <Error />,
  },
  {
    path: "c-wash/edit/:id",
    element: <CarwashEditConfig />,
    errorElement: <Error />,
  },
  {
    path: "payments",
    element: <PaymentSettings />,
    errorElement: <Error />,
  },
];

export default SettingsRoutes;
