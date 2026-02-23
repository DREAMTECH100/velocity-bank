import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
export default function Success() {
  const navigate = useNavigate();

  return (
    <PageWrapper>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[450px] text-center">

        <div className="text-red-600 text-5xl mb-4">⚠️</div>

        <h2 className="text-2xl font-bold mb-3">
          Transaction Restricted
        </h2>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Your account has been temporarily restricted from sending or 
          receiving funds.
          <br /><br />
          Please visit the nearest branch of Velocity Bank to rectify 
          this issue and restore full access to your account.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          Return to Dashboard
        </button>

      </div>
</PageWrapper>
    
  );
}