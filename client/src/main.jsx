import React from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import BoardListPage from "./pages/BoardListPage.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import ProtectedRoutes from "./routes/protectedRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/boards" element={<BoardListPage />}></Route>
        <Route path="/boards/:id" element={<BoardPage />}></Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);
