import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";

/* ------------------------------------------------------------------ *
 *  Velocity Bank — theme tokens
 *  Deep teal-black base, metallic gold as the trust accent, mint as
 *  the "money in motion" accent. Display type is Space Grotesk (the
 *  brand's geometric edge), body is Inter, and all data — phone
 *  numbers, codes, PINs, balances — sits in IBM Plex Mono so it reads
 *  like a ledger, not prose.
 * ------------------------------------------------------------------ */
const THEME = {
  "--vb-bg": "#0A1512",
  "--vb-bg-2": "#0E1D18",
  "--vb-surface": "#12211C",
  "--vb-surface-2": "#1A2E27",
  "--vb-border": "#23372F",
  "--vb-gold": "#C9A44C",
  "--vb-gold-soft": "#E4C878",
  "--vb-mint": "#3ECF8E",
  "--vb-text": "#F5F3EC",
  "--vb-text-dim": "#8FA39B",
  "--vb-danger": "#E8735A",
};

const FEATURES = [
  {
    title: "Instant transfers",
    body: "Money lands in seconds, any hour, any day — including weekends and holidays.",
    icon: (
      <path d="M4 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Bank-grade security",
    body: "256-bit encryption and real-time fraud monitoring watch every transaction as it happens.",
    icon: (
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "No hidden fees",
    body: "No monthly fee, no minimum balance, nothing tucked into the fine print of your statement.",
    icon: (
      <path
        d="M3 10h18M7 15h4M3 6h18v12H3V6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const STEP_LABELS = ["Phone", "Code", "PIN"];

export default function Login() {
  const navigate = useNavigate();

  const MASTER_PHONE = "2025550147";
  const MASTER_OTP = "911019";
  const MASTER_PIN = "5689";

  // 'home' | 'auth'
  const [view, setView] = useState("home");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [pinArray, setPinArray] = useState(["", "", "", ""]);

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(30);
  const [ticker, setTicker] = useState(4829137);

  const otpRefs = useRef([]);
  const pinRefs = useRef([]);

  /* Live "money moving" counter on the homepage — the page's signature
     detail. Purely cosmetic, gives the hero a pulse. */
  useEffect(() => {
    if (view !== "home") return;
    const id = setInterval(() => {
      setTicker((t) => t + Math.floor(Math.random() * 340) + 20);
    }, 1400);
    return () => clearInterval(id);
  }, [view]);

  /* Resend-code cooldown on the OTP step */
  useEffect(() => {
    if (view !== "auth" || step !== 2) return;
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [view, step, resendCooldown]);

  const goToLogin = () => {
    setError("");
    setStep(1);
    setView("auth");
  };

  const goHome = () => {
    setError("");
    setView("home");
  };

  const goBack = () => {
    setError("");
    if (step === 1) {
      goHome();
    } else {
      setStep((s) => s - 1);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const cleanedPhone = phone.replace(/\D/g, "");

    setTimeout(() => {
      if (cleanedPhone === MASTER_PHONE) {
        setError("");
        setOtpArray(["", "", "", "", "", ""]);
        setResendCooldown(30);
        setStep(2);
      } else {
        setError("We couldn't find an account associated with this number.");
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
        setPinArray(["", "", "", ""]);
        setStep(3);
      } else {
        setError("That code doesn't match. Check the digits and try again.");
        triggerShake();
      }
      setLoading(false);
    }, 600);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pinArray.join("");
    setLoading(true);

    setTimeout(() => {
      if (enteredPin === MASTER_PIN) {
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

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
  };

  /* Shared handler for both the 6-digit OTP and 4-digit PIN entry rows */
  const makeDigitHandlers = (array, setArray, refs, length) => ({
    onChange: (index) => (e) => {
      const value = e.target.value.replace(/[^0-9]/g, "").slice(-1);
      const next = [...array];
      next[index] = value;
      setArray(next);
      if (value && index < length - 1) refs.current[index + 1]?.focus();
    },
    onKeyDown: (index) => (e) => {
      if (e.key === "Backspace" && !array[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
  });

  const otpHandlers = makeDigitHandlers(otpArray, setOtpArray, otpRefs, 6);
  const pinHandlers = makeDigitHandlers(pinArray, setPinArray, pinRefs, 4);

  return (
    <PageWrapper>
      <div className="vb-theme" style={THEME}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');

          .vb-theme {
            background: radial-gradient(120% 140% at 15% 0%, var(--vb-bg-2) 0%, var(--vb-bg) 55%);
            color: var(--vb-text);
            font-family: 'Inter', sans-serif;
            min-height: 100%;
          }
          .vb-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
          .vb-mono { font-family: 'IBM Plex Mono', monospace; }

          @keyframes vb-shake {
            10%, 90% { transform: translateX(-1px); }
            20%, 80% { transform: translateX(2px); }
            30%, 50%, 70% { transform: translateX(-4px); }
            40%, 60% { transform: translateX(4px); }
          }
          .vb-shake { animation: vb-shake 0.4s; }

          @keyframes vb-fade-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .vb-fade-up { animation: vb-fade-up 0.5s ease both; }

          @keyframes vb-dash {
            to { stroke-dashoffset: -240; }
          }
          .vb-pulse-path {
            stroke-dasharray: 6 5;
            animation: vb-dash 3.2s linear infinite;
          }

          @keyframes vb-glow {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 1; }
          }
          .vb-glow-dot { animation: vb-glow 1.8s ease-in-out infinite; }

          .vb-digit {
            background: var(--vb-surface-2);
            border: 1px solid var(--vb-border);
            color: var(--vb-text);
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .vb-digit:focus {
            outline: none;
            border-color: var(--vb-gold);
            box-shadow: 0 0 0 3px rgba(201,164,76,0.18);
          }

          .vb-btn-primary {
            background: linear-gradient(135deg, var(--vb-gold-soft), var(--vb-gold));
            color: #14201A;
            font-weight: 600;
            transition: filter 0.15s, transform 0.1s;
          }
          .vb-btn-primary:hover:not(:disabled) { filter: brightness(1.06); }
          .vb-btn-primary:active:not(:disabled) { transform: scale(0.99); }
          .vb-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

          .vb-btn-ghost {
            background: transparent;
            border: 1px solid var(--vb-border);
            color: var(--vb-text);
            transition: border-color 0.15s, background 0.15s;
          }
          .vb-btn-ghost:hover { border-color: var(--vb-gold); background: rgba(201,164,76,0.06); }

          .vb-input {
            background: var(--vb-surface-2);
            border: 1px solid var(--vb-border);
            color: var(--vb-text);
          }
          .vb-input:focus {
            outline: none;
            border-color: var(--vb-gold);
            box-shadow: 0 0 0 3px rgba(201,164,76,0.18);
          }
          .vb-input::placeholder { color: var(--vb-text-dim); }
        `}</style>

        {view === "home" ? (
          <Home
            ticker={ticker}
            onLogin={goToLogin}
            onCreateAccount={goToLogin}
          />
        ) : (
          <AuthCard
            step={step}
            loading={loading}
            error={error}
            shake={shake}
            phone={phone}
            setPhone={setPhone}
            otpArray={otpArray}
            otpRefs={otpRefs}
            otpHandlers={otpHandlers}
            pinArray={pinArray}
            pinRefs={pinRefs}
            pinHandlers={pinHandlers}
            resendCooldown={resendCooldown}
            onResend={handleResend}
            onPhoneSubmit={handlePhoneSubmit}
            onOtpSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
            onPinSubmit={handlePinSubmit}
            onBack={goBack}
          />
        )}
      </div>
    </PageWrapper>
  );
}

/* ------------------------------------------------------------------ *
 *  Homepage
 * ------------------------------------------------------------------ */
function Home({ ticker, onLogin, onCreateAccount }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-14 md:py-20">
      {/* Nav */}
      <div className="flex items-center justify-between mb-16 md:mb-24">
        <span className="vb-display text-xl font-semibold tracking-tight">
          Velocity <span style={{ color: "var(--vb-gold)" }}>Bank</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="vb-btn-ghost px-4 py-2 rounded-lg text-sm font-medium"
          >
            Log in
          </button>
          <button
            onClick={onCreateAccount}
            className="vb-btn-primary px-4 py-2 rounded-lg text-sm"
          >
            Create account
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24 md:mb-32">
        <div className="vb-fade-up">
          <h1 className="vb-display text-4xl md:text-5xl font-semibold leading-[1.08] mb-5">
            Banking that moves
            <br />
            at your speed.
          </h1>
          <p
            className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
            style={{ color: "var(--vb-text-dim)" }}
          >
            Send, save, and spend without the drag of traditional banking.
            Velocity moves your money the instant you do.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onCreateAccount}
              className="vb-btn-primary px-6 py-3 rounded-xl text-sm"
            >
              Open an account
            </button>
            <button
              onClick={onLogin}
              className="vb-btn-ghost px-6 py-3 rounded-xl text-sm font-medium"
            >
              Log in to your account
            </button>
          </div>
        </div>

        {/* Signature: live pulse line + moving-money ticker */}
        <div
          className="rounded-3xl p-6 md:p-8 vb-fade-up"
          style={{
            background: "var(--vb-surface)",
            border: "1px solid var(--vb-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full vb-glow-dot"
              style={{ background: "var(--vb-mint)" }}
            />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--vb-text-dim)" }}
            >
              Moving right now
            </span>
          </div>
          <div className="vb-mono text-3xl md:text-4xl font-semibold mb-4">
            ${ticker.toLocaleString()}
          </div>
          <svg
            viewBox="0 0 400 70"
            className="w-full h-16"
            preserveAspectRatio="none"
          >
            <path
              d="M0,35 L60,35 L75,12 L92,58 L108,35 L160,35 L175,20 L190,50 L205,35 L400,35"
              fill="none"
              stroke="var(--vb-mint)"
              strokeWidth="2"
              className="vb-pulse-path"
            />
          </svg>
          <p
            className="text-xs mt-3"
            style={{ color: "var(--vb-text-dim)" }}
          >
            Transfers processed by Velocity customers today
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-6 mb-20">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl p-6"
            style={{
              background: "var(--vb-surface)",
              border: "1px solid var(--vb-border)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 mb-4"
              fill="none"
              stroke="var(--vb-gold)"
              strokeWidth="1.8"
            >
              {f.icon}
            </svg>
            <h3 className="vb-display text-base font-semibold mb-1.5">
              {f.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--vb-text-dim)" }}
            >
              {f.body}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="text-xs text-center pt-8"
        style={{ color: "var(--vb-text-dim)", borderTop: "1px solid var(--vb-border)" }}
      >
        Velocity Bank is a front-end interface simulation for demonstrating
        fintech UI/UX — not a real financial institution.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Auth card — phone → code → PIN
 * ------------------------------------------------------------------ */
function AuthCard({
  step,
  loading,
  error,
  shake,
  phone,
  setPhone,
  otpArray,
  otpRefs,
  otpHandlers,
  pinArray,
  pinRefs,
  pinHandlers,
  resendCooldown,
  onResend,
  onPhoneSubmit,
  onOtpSubmit,
  onPinSubmit,
  onBack,
}) {
  return (
    <div className="w-full flex justify-center px-6 py-14 md:py-20">
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl p-8 vb-fade-up ${
          shake ? "vb-shake" : ""
        }`}
        style={{
          background: "var(--vb-surface)",
          border: "1px solid var(--vb-border)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            aria-label="Go back"
            className="vb-btn-ghost w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <p className="vb-display text-lg font-semibold leading-none">
              Velocity Bank
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--vb-text-dim)" }}>
              Secure sign in
            </p>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-7">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={label} className="flex-1">
                <div
                  className="h-1 rounded-full mb-1.5"
                  style={{
                    background:
                      done || active ? "var(--vb-gold)" : "var(--vb-border)",
                    opacity: active ? 1 : done ? 0.7 : 1,
                  }}
                />
                <span
                  className="text-[11px]"
                  style={{
                    color: active ? "var(--vb-text)" : "var(--vb-text-dim)",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1 — phone */}
        {step === 1 && (
          <form onSubmit={onPhoneSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm" style={{ color: "var(--vb-text-dim)" }}>
                Registered phone number
              </label>
              <div className="flex w-full gap-2">
                <select
                  className="vb-input flex-shrink-0 w-20 p-3 rounded-xl text-sm"
                  defaultValue="+1"
                >
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input
                  className="vb-input vb-mono flex-1 min-w-0 p-3 rounded-xl text-sm"
                  type="tel"
                  placeholder="(555) 555-0147"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="vb-btn-primary w-full py-3 rounded-xl text-sm"
            >
              {loading ? "Sending code…" : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <form onSubmit={onOtpSubmit} className="space-y-6">
            <div>
              <p className="text-sm mb-1" style={{ color: "var(--vb-text)" }}>
                Enter the 6-digit code
              </p>
              <p className="text-xs" style={{ color: "var(--vb-text-dim)" }}>
                We sent it to the number ending in {phone.replace(/\D/g, "").slice(-4) || "0147"}.
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (otpRefs.current[index] = el)}
                  onChange={otpHandlers.onChange(index)}
                  onKeyDown={otpHandlers.onKeyDown(index)}
                  className="vb-digit vb-mono w-11 h-13 md:w-12 md:h-14 text-center text-lg rounded-xl"
                  required
                />
              ))}
            </div>

            <button
              disabled={loading}
              className="vb-btn-primary w-full py-3 rounded-xl text-sm"
            >
              {loading ? "Verifying…" : "Verify code"}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={resendCooldown > 0}
              className="w-full text-xs text-center"
              style={{
                color: resendCooldown > 0 ? "var(--vb-text-dim)" : "var(--vb-gold)",
              }}
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend code"}
            </button>
          </form>
        )}

        {/* STEP 3 — PIN */}
        {step === 3 && (
          <form onSubmit={onPinSubmit} className="space-y-6">
            <p className="text-sm" style={{ color: "var(--vb-text)" }}>
              Enter your 4-digit PIN
            </p>
            <div className="flex justify-center gap-3">
              {pinArray.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={pinHandlers.onChange(index)}
                  onKeyDown={pinHandlers.onKeyDown(index)}
                  className="vb-digit vb-mono w-14 h-14 text-center text-xl rounded-xl"
                  required
                />
              ))}
            </div>
            <button
              disabled={loading}
              className="vb-btn-primary w-full py-3 rounded-xl text-sm"
            >
              {loading ? "Signing in…" : "Access account"}
            </button>
          </form>
        )}

        {error && (
          <p
            className="text-sm text-center mt-4"
            style={{ color: "var(--vb-danger)" }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
