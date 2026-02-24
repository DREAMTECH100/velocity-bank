import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import ConfirmTransfer from "./pages/ConfirmTransfer";
import Pin from "./pages/Pin";
import Verify from "./pages/Verify";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Deposit from "./pages/Deposit";
import Account from "./pages/Account";
import { useState } from "react";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <PageLoader />}

      <Routes>

        <Route path="/" element={<Login setLoading={setLoading} />} />
        <Route path="/login" element={<Login setLoading={setLoading} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirm-transfer"
          element={
            <ProtectedRoute>
              <ConfirmTransfer setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pin"
          element={
            <ProtectedRoute>
              <Pin setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <Verify setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success setLoading={setLoading} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}