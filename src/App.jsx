import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store";
import Login from "./features/AdminLogin";

import ProtectedRoute from "./features/auth/ProtectedRoute";
import { ROLES_LIST } from "./lib/config";
import AdminLayout from "./components/layout/AdminLayout";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import PrivateRoutes from "./routes/PrivateRoutes";

import SimRacingClientStartRace from "./features/simracing/racerui/SimRacingClientStartRace";
import Error from "./components/error/Error";
import SimRacingClientMyRace from "./features/simracing/racerui/SimRacingClientMyRace";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          ROLES_LIST.ADMIN,
          ROLES_LIST.SUPERADMIN,
          ROLES_LIST.STAFF,
        ]}
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

  {
    path: "/simracingbyhuwoma/startrace/:id",
    element: <SimRacingClientStartRace />,
    errorElement: <Error />,
  },
  {
    path: "/simracingbyhuwoma/myrace",
    element: <SimRacingClientMyRace />,
    errorElement: <Error />,
  },

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
