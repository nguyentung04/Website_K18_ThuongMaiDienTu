import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import CitiesTable from "./component/cities";
import Editcities from "./component/edit"
import Addcities from "./component/add"

const CitiesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CitiesTable />} />
        <Route path="admin/cities/add" element={<Addcities />} />
        <Route path="admin/cities/edit/:id" element={<Editcities />} />
      </Route>
      <Route path="*" element={<Navigate to="/Cities" />} />
    </Routes>
  );
};

export default CitiesRoutes;
