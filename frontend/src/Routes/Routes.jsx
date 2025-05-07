import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Pages/MainLayout";
import Loader from "../Components/Loader/Loader";
import ProjectDetailsPage from "../Pages/ProjectManagement/ProjectDetailsPage ";
import EquipesManagement from "../Pages/EquipesManagement/EquipesManagement";
// Lazy-loaded components
const Dash = lazy(() => import("../Pages/Dashboard/Dash"));

const Reports = lazy(() => import("../Pages/Report/Reports"));
const ApprovedReports = lazy(() => import("../Pages/Report/ApprovedReports"));
const RejectedReports = lazy(() =>import("../Pages/Report/RejectedReports"));
const ToReviewReports = lazy(() => import("../Pages/Report/ToReviewReports"));
const Parameters = lazy(() => import("../Pages/Settings/Parameters"));
const RoleGroupConfig = lazy(() => import("../Pages/Role_GroupConfig/RoleGroupConfig"));
const SentDocument = lazy(() => import("../Pages/Report/SentDocument"));
const ConsultedReports = lazy(() => import("../Pages/Report/ConsultedReports"));
const ProjectManagement = lazy(() => import("../Pages/ProjectManagement/ProjectManagement"));
const PendingReports = lazy(() => import("../Pages/Report/PendingReports"));
const Page404 = lazy(() => import("../Pages/Page404/Page404"));

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
            <RejectedReports />
          </Suspense>
        ),
      },
      {
        path: "reports/sent",
        element: (
          <Suspense fallback={<Loader />}>
            <SentDocument />
          </Suspense>
        ),
      },
      {
        path: "reports/pending",
        element: (
          <Suspense fallback={<Loader />}>
            <PendingReports />
          </Suspense>
        ),
      },
      {
        path: "reports/consulted",
        element: (
          <Suspense fallback={<Loader />}>
            <ConsultedReports />
          </Suspense>
        ),
      },
      {
        path: "reports/to-review",
        element: (
          <Suspense fallback={<Loader />}>
            <ToReviewReports />
          </Suspense>
        ),
      },
      { path: "team", element: <EquipesManagement /> },
      {path: "gestion-projets", element: <ProjectManagement />},
      {path:"/project-pending/:workspaceId/:projectId", element: <ProjectDetailsPage />},
      { path: "role-assignment",
         element: (
          <Suspense fallback={<Loader />}>
            <RoleGroupConfig />
          </Suspense>
        ) },
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
