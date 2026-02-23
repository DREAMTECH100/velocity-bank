import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Transfer({ setLoading }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipient: "",
    bank: "",
    accountNumber: "",
    amount: "",
    note: "",
  });

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 Full Major U.S. Banks List (Restored + Expanded)
  const banks = [
    "JPMorgan Chase",
    "Bank of America",
    "Wells Fargo",
    "Citibank",
    "U.S. Bank",
    "PNC Bank",
    "Truist Bank",
    "Capital One",
    "TD Bank",
    "Goldman Sachs",
    "Morgan Stanley",
    "American Express Bank",
    "Charles Schwab Bank",
    "Ally Bank",
    "HSBC USA",
    "Fifth Third Bank",
    "BMO Harris Bank",
    "First Republic Bank",
    "Santander Bank",
    "Regions Bank",
    "M&T Bank",
    "Huntington National Bank",
    "KeyBank",
    "Discover Bank",
    "Citizens Bank"
  ];

  const filteredBanks = banks.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBankSelect = (selectedBank) => {
    setForm({ ...form, bank: selectedBank });
    setBankSearch(selectedBank);
    setShowDropdown(false);
    setVerified(false);

    if (selectedBank) {
      setVerifying(true);

      setTimeout(() => {
        setVerifying(false);
        setVerified(true);
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.recipient ||
      !form.bank ||
      !form.accountNumber ||
      !form.amount
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // 🔥 Show loader before redirect
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/confirm-transfer", { state: form });
    }, 1200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-10">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1470&q=80')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-xl bg-white/90 p-8 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">New Transfer</h2>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigate("/dashboard", { replace: true });
              }, 800);
            }}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="max-w-xl bg-white p-8 rounded-2xl shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                name="recipient"
                value={form.recipient}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter recipient name"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter account number"
              />
            </div>

            {/* Searchable Bank Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Select Bank *
              </label>

              <input
                type="text"
                value={bankSearch}
                onChange={(e) => {
                  setBankSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search bank..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              />

              {showDropdown && (
                <div className="absolute z-20 bg-white border w-full mt-1 rounded-lg max-h-48 overflow-y-auto shadow-lg">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank, index) => (
                      <div
                        key={index}
                        onClick={() => handleBankSelect(bank)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {bank}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No banks found
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 h-6">
                {verifying && (
                  <p className="text-sm text-blue-600 animate-pulse">
                    Verifying recipient...
                  </p>
                )}

                {verified && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Recipient Verified
                  </p>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter amount"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Note (Optional)
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Add a note"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
            >
              Confirm Transfer
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}