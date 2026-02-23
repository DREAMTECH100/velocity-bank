import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";

export default function Verify() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96 text-center">

        <h2 className="text-2xl font-bold mb-2">
          Verification Required
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit code sent to your device
        </p>

        <form onSubmit={handleVerify} className="space-y-6">

          <input
            maxLength="6"
            required
            className="w-full text-center text-2xl tracking-widest border rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="••••••"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Verify & Complete
          </button>

        </form>

      </div>

    </div>
  );
}