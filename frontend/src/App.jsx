import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./Routes/Routes";
import useSaveUserData from "./hooks/useSaveUserData";
function App() {
  useSaveUserData();

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
