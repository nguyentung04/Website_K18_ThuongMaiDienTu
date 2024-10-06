import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import DistrictsTable from "./component/districts";
import Editdistricts from "./component/edit"
import Adddistricts from "./component/add"

const DistrictsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DistrictsTable />} />
        <Route path="admin/districts/add" element={<Adddistricts />} />
        <Route path="admin/districts/edit/:id" element={<Editdistricts />} />
      </Route>
      <Route path="*" element={<Navigate to="/districts" />} />
    </Routes>
  );
};

export default DistrictsRoutes;
