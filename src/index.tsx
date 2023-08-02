import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./pages/App.js";
import reportWebVitals from "./reportWebVitals.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import SignIn from "./pages/signin.tsx";
import SignUp from "./pages/signup.tsx";
import TableC from "./pages/table.tsx";
import ErrorPage from "./pages/error-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/table",
    element: <TableC />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
