import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
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

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/parknwashbyhuwoma" />,
  },
  {
    path: "/parknwashbyhuwoma",
    element: withPublicSuspense(<PublicCarwashEntry />),
    errorElement: <Error />,
  },
  {
    path: "/parknwashbyhuwoma/status/:transactionId",
    element: withPublicSuspense(<PublicCarwashEntryStatus />),
    errorElement: <Error />,
  },
  {
    path: "/simracingbyhuwoma/startrace/:id",
    element: withPublicSuspense(<SimRacingClientStartRace />),
    errorElement: <Error />,
  },
  {
    path: "/simracingbyhuwoma/myrace",
    element: withPublicSuspense(<SimRacingClientMyRace />),
    errorElement: <Error />,
  },
  {
    path: "/garagebyhuwoma",
    element: withPublicSuspense(<PublicVehicleListings />),
    errorElement: <Error />,
  },
  {
    path: "/garagebyhuwoma/new-vehicle",
    element: withPublicSuspense(<PublicNewVehicleListing />),
    errorElement: <Error />,
  },
  {
    path: "/garagebyhuwoma/new-buyer-interest",
    element: withPublicSuspense(<PublicNewBuyerInterest />),
    errorElement: <Error />,
  },
  {
    path: "/garagebyhuwoma/:id",
    element: withPublicSuspense(<PublicVehicleDetails />),
    errorElement: <Error />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function PublicApp() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <Provider store={store}>
      <RouterProvider router={publicRouter} />
      <OfflineAlert />
    </Provider>
  );
}

export default PublicApp;
