import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./index";
import CommentTable from "./component/comment";
import CommentDetal from "./component/comment_detail";


const CommentsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CommentTable />} />
        <Route path="admin/comments/:id" element={<CommentDetal />} />
      </Route>
      <Route path="*" element={<Navigate to="/comment" />} />
    </Routes>
  );
};

export default CommentsRoutes;