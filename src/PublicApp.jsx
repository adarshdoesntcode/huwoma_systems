import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Error from "./components/error/Error";
import NotFound from "./components/NotFound";
import { OfflineAlert } from "./components/OfflineAlert";

const SimRacingClientStartRace = lazy(
  () => import("./features/simracing/racerui/SimRacingClientStartRace"),
);
const SimRacingClientMyRace = lazy(
  () => import("./features/simracing/racerui/SimRacingClientMyRace"),
);
const PublicCarwashEntry = lazy(
  () => import("./features/carwash/public/PublicCarwashEntry"),
);
const PublicCarwashEntryStatus = lazy(
  () => import("./features/carwash/public/PublicCarwashEntryStatus"),
);
const PublicVehicleDetails = lazy(
  () => import("./features/garage/tabs/vehicle-list/PublicVehicleDetails"),
);
const PublicVehicleListings = lazy(
  () => import("./features/garage/public/PublicVehicleListings"),
);
const PublicNewVehicleListing = lazy(
  () => import("./features/garage/public/PublicNewVehicleListing"),
);
const PublicNewBuyerInterest = lazy(
  () => import("./features/garage/public/PublicNewBuyerInterest"),
);

function PublicRouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
        Loading...
      </div>
    </div>
  );
}

const withPublicSuspense = (node) => (
  <Suspense fallback={<PublicRouteFallback />}>{node}</Suspense>
);

function PublicRouteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <Outlet />;
}

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicRouteLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/parknwashbyhuwoma" />,
      },
      {
        path: "parknwashbyhuwoma",
        element: withPublicSuspense(<PublicCarwashEntry />),
      },
      {
        path: "parknwashbyhuwoma/status/:transactionId",
        element: withPublicSuspense(<PublicCarwashEntryStatus />),
      },
      {
        path: "simracingbyhuwoma/startrace/:id",
        element: withPublicSuspense(<SimRacingClientStartRace />),
      },
      {
        path: "simracingbyhuwoma/myrace",
        element: withPublicSuspense(<SimRacingClientMyRace />),
      },
      {
        path: "garagebyhuwoma",
        element: withPublicSuspense(<PublicVehicleListings />),
      },
      {
        path: "garagebyhuwoma/new-vehicle",
        element: withPublicSuspense(<PublicNewVehicleListing />),
      },
      {
        path: "garagebyhuwoma/new-buyer-interest",
        element: withPublicSuspense(<PublicNewBuyerInterest />),
      },
      {
        path: "garagebyhuwoma/:id",
        element: withPublicSuspense(<PublicVehicleDetails />),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function PublicApp() {
  return (
    <Provider store={store}>
      <RouterProvider router={publicRouter} />
      <OfflineAlert />
    </Provider>
  );
}

export default PublicApp;
