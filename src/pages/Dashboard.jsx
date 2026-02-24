import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", spending: 4000 },
  { name: "Feb", spending: 3000 },
  { name: "Mar", spending: 5000 },
  { name: "Apr", spending: 2780 },
  { name: "May", spending: 1890 },
  { name: "Jun", spending: 2390 },
  { name: "Jul", spending: 3490 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [navigate]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      navigate("/login", { replace: true });
    }, 1200);
  };

  const user = {
    firstName: "Michael",
    middleName: "J",
    lastName: "Young",
    accountType: "Premium Account",
    avatar: "/client.jpeg",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="text-lg tracking-wide">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
<div
  className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-6 transform 
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  transition-transform duration-300 ease-in-out
  md:translate-x-0 md:static z-40`}
>

  {/* Profile Section */}
  <div className="flex flex-col items-center mb-10">

    <img
      src={user.avatar}
      alt="User Avatar"
      className="w-20 h-20 rounded-full object-cover shadow-md"
    />

    <h2 className="mt-4 font-semibold text-center">
      {user.firstName} {user.middleName} {user.lastName}
    </h2>

    <p className="text-sm text-gray-500">
      {user.accountType}
    </p>

  </div>

  {/* Navigation */}
  <div className="flex flex-col gap-6">

    <button
      onClick={() => navigate("/dashboard")}
      className="text-left hover:text-gray-600"
    >
      Dashboard
    </button>

    <button
      onClick={() => navigate("/transfer")}
      className="text-left hover:text-gray-600"
    >
      Transfer
    </button>

    <button
      onClick={() => navigate("/deposit")}
      className="text-left hover:text-gray-600"
    >
      Deposit
    </button>

    <button
      onClick={() => navigate("/accounts")}
      className="text-left hover:text-gray-600"
    >
      Accounts
    </button>

    <button
      onClick={handleLogout}
      className="text-left text-red-500 mt-10 hover:opacity-70"
    >
      Logout
    </button>

  </div>

</div>
      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 space-y-10">

        {/* Mobile Top Bar (Only Hamburger) */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <button onClick={() => setSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="font-bold">Dashboard</h1>
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">

          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user.firstName} {user.middleName} {user.lastName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Here’s your financial overview
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/deposit")}
              className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Deposit
            </button>

            <button
              onClick={() => navigate("/transfer")}
              className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              Transfer
            </button>
          </div>

        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8 rounded-2xl shadow-xl">
          <p className="opacity-70 text-sm">Total Balance</p>
          <h3 className="text-3xl md:text-4xl font-bold mt-2">
            $1,752,210.53
          </h3>
          <p className="mt-4 text-sm opacity-70">
            Routing: 021000021 • Account: ****8821
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-6">
            Spending Overview
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="spending"
                stroke="#000000"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-6">
            Recent Transactions
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium">Apple Store</p>
                <p className="text-sm text-gray-500">Apr 18, 2023</p>
              </div>
              <p className="text-red-500 font-semibold">- $2,499</p>
            </div>

            <div className="flex justify-between border-b pb-3">
              <div>
                <p className="font-medium">Salary Deposit</p>
                <p className="text-sm text-gray-500">Jun 15, 2023</p>
              </div>
              <p className="text-green-500 font-semibold">+ $45,000</p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-medium">Wire Transfer</p>
                <p className="text-sm text-gray-500">Jul 10, 2023</p>
              </div>
              <p className="text-red-500 font-semibold">- $12,000</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}