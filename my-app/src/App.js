import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import ClientRoutes from './routes/ClientRoutes';
import SignIn from './pages/Auth/Signin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/admin/*" element={<AdminRoutes />} /> {/* Đảm bảo rằng AdminRoutes được điều hướng */}
        <Route path="/*" element={<ClientRoutes />} /> {/* ClientRoutes cho các trang khác */}
      </Routes>
    </Router>
  );
};

export default App;
