import React, { lazy } from "react";
import ProtectedRoute from "../component/common/ProtectedRoute.jsx";

const List = lazy(() => import("../component/transaction/List.jsx"));
const MyList = lazy(() => import("../component/transaction/MyList.jsx"));

const serviceProductRouter = () => {
  return [
    // {
    //     path: "read/:id",
    //     element: <Read/>
    // },
    {
      path: "list",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <List />
          </ProtectedRoute>
      ),
    },
    {
      path: "my",
      element: (
          <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
            <MyList />
          </ProtectedRoute>
      ),
    },
    // {
    //     path: "save",
    //     element: <Save/>
    // },
    // {
    //     path: "modify/:id",
    //     element: <Modify/>
    // },
  ];
};

export default serviceProductRouter;
