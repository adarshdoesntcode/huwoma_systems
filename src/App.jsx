import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./features/AdminLogin";
import Loader from "./components/Loader";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { ROLES_LIST } from "./lib/config";
import AdminLayout from "./components/layout/AdminLayout";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import PrivateRoutes from "./routes/PrivateRoutes";
import SettingsLayout from "./components/layout/SettingsLayout";
import SettingsRoutes from "./routes/SettingsRoutes";
import useLogout from "./hooks/useLogout";
import { useState } from "react";
import { toast } from "./hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: (
      <ProtectedRoute
        allowedRoles={[ROLES_LIST.ADMIN, ROLES_LIST.SUPERADMIN]}
      />
    ),
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: PrivateRoutes,
      },
    ],
  },

  // {
  //   element: <ProtectedRoute allowedRole={ROLES_LIST.admin} />,
  //   children: [
  //     {
  //       path: `${ROLES_LIST.admin}`,
  //       element: <AdminLayout />,
  //       children: AdminRoutes,
  //     },
  //   ],
  // },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
