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
  const [settingsOpen, setSettingsOpen] = useState(false);

  // --- Settings password gate ---
  // NOTE: This is a hardcoded, client-side check for demo/UI purposes only.
  // Anyone can read this value via the browser's dev tools or page source,
  // so it provides no real security against a determined user. It's fine
  // for gating a UI panel in a mock/demo app, but should never be treated
  // as an access-control mechanism for real account data — that has to be
  // enforced server-side (e.g. re-authentication, a backend-verified PIN).
  const SETTINGS_PASSWORD = "9102";
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const defaultUser = {
    firstName: "Arnett",
    middleName: "Heather",
    lastName: "",
    accountType: "Premium Account",
    avatar: "/client2.jpeg",
    // Editable copy of the Login page's Master OTP. Login.jsx falls back
    // to its own hardcoded default if this hasn't been set yet.
    masterOtp: "223549",
  };

  const loadStoredUser = () => {
    try {
      const stored = localStorage.getItem("userProfile");
      return stored ? { ...defaultUser, ...JSON.parse(stored) } : defaultUser;
    } catch {
      return defaultUser;
    }
  };

  // User is now state so it can be edited from the Settings panel.
  // Initialized from localStorage so saved edits survive a page refresh.
  const [user, setUser] = useState(loadStoredUser);

  // Draft state used inside the Settings form, so edits only apply on Save.
  const [draft, setDraft] = useState(user);

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

  // Settings button now opens the password prompt first, instead of
  // opening the Settings panel directly.
  const openSettings = () => {
    setPasswordInput("");
    setPasswordError("");
    setPasswordPromptOpen(true);
  };

  const closePasswordPrompt = () => {
    setPasswordPromptOpen(false);
    setPasswordInput("");
    setPasswordError("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === SETTINGS_PASSWORD) {
      setPasswordPromptOpen(false);
      setPasswordInput("");
      setPasswordError("");
      setDraft(user); // start the form from the current saved values
      setSettingsOpen(true);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const handleDraftChange = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Read as a base64 data URL (rather than a blob URL) so it can be
    // safely stored in localStorage and survive a page refresh.
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setUser(draft);
    try {
      localStorage.setItem("userProfile", JSON.stringify(draft));
    } catch {
      // Storage can fail (e.g. quota exceeded on a very large image) —
      // the in-memory state is still updated, it just won't persist.
    }
    // The native "storage" event only fires in *other* tabs/windows, never
    // in the tab that made the change — so a page like Account.jsx that's
    // already mounted in this same tab won't hear about the update that
    // way. Dispatch our own event so any listening page can refresh live.
    window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: draft }));
    setSettingsOpen(false);
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
            onClick={() => navigate("/account")}
            className="text-left hover:text-gray-600"
          >
            Accounts
          </button>

          <button
            onClick={openSettings}
            className="text-left hover:text-gray-600"
          >
            Settings
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

      {/* PASSWORD PROMPT MODAL (gates access to Settings) */}
      {passwordPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Restricted Access</h3>
              <button
                onClick={closePasswordPrompt}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close password prompt"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              For bank use only. Contact your bank officer for authorised access.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  autoFocus
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePasswordPrompt}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
                >
                  Unlock
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={closeSettings}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close settings"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">

              {/* Avatar preview + upload */}
              <div className="flex flex-col items-center gap-3">
                <img
                  src={draft.avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <label className="text-sm cursor-pointer text-gray-600 hover:text-black">
                  Change picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name fields */}
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={draft.firstName}
                  onChange={handleDraftChange("firstName")}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={draft.middleName}
                  onChange={handleDraftChange("middleName")}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={draft.lastName}
                  onChange={handleDraftChange("lastName")}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Master OTP (login verification code)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={draft.masterOtp}
                  onChange={(e) => {
                    // digits only, matching the 6 OTP boxes on the login page
                    const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
                    setDraft((prev) => ({ ...prev, masterOtp: digitsOnly }));
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This is the 6-digit code the login page will accept in place of the default demo code.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSettings}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
                >
                  Save
                </button>
              </div>

            </form>

          </div>
        </div>
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
