import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import MainEditorPage from "./pages/MainEditorPage";
import MyCodesPage from "./pages/MyCodesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col">
      {token && <Navbar />}
      <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AppLayout>
              <Register />
            </AppLayout>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MainEditorPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-codes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyCodesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;