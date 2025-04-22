import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Pages/MainLayout";
import Page404 from "../Pages/Page404/Page404";
import Dash from "../Pages/Dashboard/Dash";
import Loader from "../Components/Loader/Loader";
// Lazy-loaded components
const Reports = lazy(() => import("../Pages/Report/Reports"));
const ApprovedReports = lazy(() => import("../Pages/Report/ApprovedReports"));
const NotApprovedReports = lazy(() =>
  import("../Pages/Report/NotApprovedReports")
);
const Parameters = lazy(() => import("../Pages/Settings/Parameters"));

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Page404 />,
    children: [
      { index: true, element: <Dash /> },
      { path: "dash", element: <Dash /> },
      { path: "budget", element: <div>Budget Page</div> },
      {
        path: "reports",
        element: (
          <Suspense fallback={<Loader/>}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: "reports/approved",
        element: (
          <Suspense fallback={<Loader />}>
            <ApprovedReports />
          </Suspense>
        ),
      },
      {
        path: "reports/rejected",
        element: (
          <Suspense fallback={<Loader />}>
            <NotApprovedReports />
          </Suspense>
        ),
      },
      {
        path: "reports/sent",
        element: (
          <Suspense fallback={<Loader />}>
            <Loader />
          </Suspense>
        ),
      },
      {
        path: "reports/pending",
        element: (
          <Suspense fallback={<Loader />}>
            <Loader />
          </Suspense>
        ),
      },
      {
        path: "reports/consulted",
        element: (
          <Suspense fallback={<Loader />}>
            <Loader />
          </Suspense>
        ),
      },
      {
        path: "reports/revised",
        element: (
          <Suspense fallback={<Loader />}>
            <Loader />
          </Suspense>
        ),
      },
      { path: "team", element: <div>Teams Page</div> },
      { path: "role-assignment", element: <Loader /> },
      {
        path: "account-management",
        element: (
          <Suspense fallback={<Loader/>}>
            <Parameters />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/error",
    element: <Page404 />,
  },
]);

export default Routes;
