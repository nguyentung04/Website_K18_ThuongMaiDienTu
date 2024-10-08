import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import AuthorsTable from "../user/component/Users";
import AddUser from "./component/AddUser";
import EditUser from "./component/EditUser";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AuthorsTable />} />
        <Route path="user/add" element={<AddUser />} />
        <Route path="user/edit/:id" element={<EditUser />} />
      </Route>
      <Route path="/*" element={<Navigate to="/users" />} />
    </Routes>
  );
};

export default UserRoutes;
