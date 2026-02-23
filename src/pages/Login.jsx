import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Login() {
  const navigate = useNavigate();

  // 🔐 CHANGE THIS ANYTIME
  const MASTER_OTP = "123456";
  const MASTER_PIN = "1234";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [shake, setShake] = useState(false);

  // STEP 1 — PHONE
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setOtpArray(["", "", "", "", "", ""]);
      setStep(2);
      setLoading(false);
    }, 800);
  };

  // STEP 2 — VERIFY OTP
  const verifyOtp = () => {
    const enteredOtp = otpArray.join("");

    setLoading(true);

    setTimeout(() => {
      if (enteredOtp === MASTER_OTP) {
        setStep(3);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
      setLoading(false);
    }, 600);
  };

  // STEP 3 — VERIFY PIN
  const handlePinSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (pin === MASTER_PIN) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard", { replace: true });
      } else {
        alert("Invalid PIN");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-md bg-card backdrop-blur-xl p-8 rounded-3xl shadow-xl">

        <h1 className="text-3xl text-white font-bold">Velocity Bank</h1>
        <p className="text-gray-400 text-sm mb-6">
          Demo Banking Simulation – Not a real financial institution
        </p>

        {/* STEP 1 — PHONE */}
        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">

            <div className="flex gap-2">
              <select
                className="p-3 rounded-xl bg-white w-28"
                defaultValue="+1"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+234">🇳🇬 +234</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
              </select>

              <input
                className="flex-1 p-3 rounded-xl bg-white"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-70"
            >
              {loading ? "Sending Code..." : "Continue"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Use any number for demo access
            </p>

          </form>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
            className={`space-y-6 ${shake ? "animate-shake" : ""}`}
          >

            <div className="flex justify-center gap-3">
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

                    if (newOtp.join("").length === 6) {
                      verifyOtp();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
                      inputsRef.current[index - 1].focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-xl rounded-xl bg-white"
                  required
                />
              ))}
            </div>

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

          </form>
        )}

        {/* STEP 3 — PIN */}
        {step === 3 && (
          <form onSubmit={handlePinSubmit} className="space-y-4">

            <input
              className="w-full p-3 rounded-xl bg-white text-center tracking-widest text-lg"
              type="password"
              maxLength="4"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Access Account"}
            </button>

          </form>
        )}

      </div>
    </PageWrapper>
  );
}