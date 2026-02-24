import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Login() {
  const navigate = useNavigate();

 
  const MASTER_PHONE = "2025550147";
  const MASTER_OTP = "234356";
  const MASTER_PIN = "5689";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const inputsRef = useRef([]);

 
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedPhone = phone.replace(/\D/g, "");

    setTimeout(() => {
      if (cleanedPhone === MASTER_PHONE) {
        setError("");
        setOtpArray(["", "", "", "", "", ""]);
        setStep(2);
      } else {
        setError("We couldn’t find an account associated with this number.");
        triggerShake();
      }

      setLoading(false);
    }, 800);
  };

 
  const verifyOtp = () => {
    const enteredOtp = otpArray.join("");
    setLoading(true);

    setTimeout(() => {
      if (enteredOtp === MASTER_OTP) {
        setError("");
        setStep(3);
      } else {
        setError("The verification code entered is incorrect.");
        triggerShake();
      }

      setLoading(false);
    }, 600);
  };

  
  const handlePinSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (pin === MASTER_PIN) {
        setError("");
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Incorrect PIN. Please try again.");
        triggerShake();
      }

      setLoading(false);
    }, 800);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <PageWrapper>
      <div
        className={`w-full max-w-md mx-auto 
        bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900
        backdrop-blur-lg border border-gray-700
        p-8 rounded-3xl shadow-2xl transition-all
        ${shake ? "animate-shake" : ""}`}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Velocity Bank
          </h1>
          <p className="text-[11px] text-gray-800 mt-1">
            Demo Banking Simulation – Not a real financial institution
          </p>
        </div>

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Registered Phone Number
              </label>

              {/* FIXED MOBILE OVERFLOW */}
              <div className="flex w-full gap-2">
                <select
                  className="flex-shrink-0 w-24 p-3 rounded-xl bg-white text-black"
                  defaultValue="+1"
                >
                  <option value="+1">🇺🇸 +1</option>
                </select>

                <input
                  className="flex-1 min-w-0 p-3 rounded-xl bg-white text-black"
                  type="tel"
                  placeholder="Enter registered numbere here"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Sending Code..." : "Continue"}
            </button>
          </form>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
            className="space-y-6"
          >
            <div className="flex justify-between gap-2">
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const newOtp = [...otpArray];
                    newOtp[index] = value;
                    setOtpArray(newOtp);

                    if (value && index < 5) {
                      inputsRef.current[index + 1].focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otpArray[index] &&
                      index > 0
                    ) {
                      inputsRef.current[index - 1].focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-xl rounded-xl bg-white text-black"
                  required
                />
              ))}
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <input
              className="w-full p-3 rounded-xl bg-white text-black text-center tracking-widest text-lg"
              type="password"
              maxLength="4"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Access Account"}
            </button>
          </form>
        )}

       
        {error && (
          <p className="text-red-400 text-sm text-center mt-4">
            {error}
          </p>
        )}
      </div>
    </PageWrapper>
  );
}