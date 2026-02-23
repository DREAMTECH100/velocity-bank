import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
export default function Pin({ setLoading }) {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        navigate("/success", { replace: true });
      }, 1800); // realistic bank processing delay
    }
  };

  return (
    <PageWrapper>
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[350px] text-center">

        <h2 className="text-2xl font-bold mb-2">
          Enter Transaction PIN
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Use the keypad below to enter your 4-digit PIN
        </p>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-12 h-12 border rounded-lg flex items-center justify-center text-xl"
            >
              {pin[i] ? "•" : ""}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {[1,2,3,4,5,6,7,8,9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-gray-200 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              {num}
            </button>
          ))}

          <button
            onClick={handleDelete}
            className="bg-red-200 py-4 rounded-lg font-semibold hover:bg-red-300 transition"
          >
            ⌫
          </button>

          <button
            onClick={() => handleNumberClick(0)}
            className="bg-gray-200 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          >
            0
          </button>

          <button
            onClick={handleSubmit}
            className="bg-black text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
          >
            OK
          </button>

        </div>

      </div>
</PageWrapper>
    
  );
}