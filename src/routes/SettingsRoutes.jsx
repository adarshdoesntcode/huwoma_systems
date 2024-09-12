import { Navigate } from "react-router-dom";

import Error from "@/components/error/Error";

import General from "@/features/settings/General";

const SettingsRoutes = [
  {
    index: true,
    element: <Navigate replace to="general" />,
    errorElement: <Error />,
  },
  {
    path: "general",
    element: <General />,
    errorElement: <Error />,
  },
];

export default SettingsRoutes;
