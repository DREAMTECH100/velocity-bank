import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
export default function ConfirmTransfer({ setLoading }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No transfer data found.</p>
      </div>
    );
  }

  return (
    <PageWrapper>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[440px]">

        <h2 className="text-2xl font-bold mb-2 text-center">
          Confirm Transfer
        </h2>

        <p className="text-center text-sm text-gray-500 mb-8">
          Please review the details before proceeding
        </p>

        <div className="space-y-5 mb-10 text-sm">

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Recipient</span>
            <span className="font-semibold">{state.recipient}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Account</span>
            <span className="font-semibold">
              ****{state.accountNumber.slice(-4)}
            </span>
          </div>

          <div className="flex justify-between text-lg border-t pt-4">
            <span className="text-gray-700">Amount</span>
            <span className="font-bold">${state.amount}</span>
          </div>

        </div>

        <div className="flex gap-4">

          {/* Cancel */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigate("/transfer", { replace: true });
              }, 800);
            }}
            className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigate("/pin", { state });
              }, 1200);
            }}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
          >
            Confirm & Continue
          </button>

        </div>

      </div>

    </PageWrapper>
    
  );
}