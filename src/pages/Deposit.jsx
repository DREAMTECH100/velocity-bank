import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function Deposit({ setLoading }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    account: "",
    method: "",
    amount: "",
    note: "",
  });

  const accounts = [
    {
      name: "Checking Account",
      masked: "•••• 4582",
      balance: 8420.55,
    },
    {
      name: "Savings Account",
      masked: "•••• 9031",
      balance: 15230.12,
    },
  ];

  const methods = [
    {
      name: "Bank Transfer",
      description: "1–2 business days processing",
    },
    {
      name: "Debit Card",
      description: "Instant deposit",
    },
    {
      name: "Wire Transfer",
      description: "Same day processing (fees may apply)",
    },
    {
      name: "Mobile Check Deposit",
      description: "Funds available within 1–3 days",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const selectedAccount = accounts.find(
    (acc) => `${acc.name} ${acc.masked}` === form.account
  );

  const selectedMethod = methods.find(
    (method) => method.name === form.method
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.account || !form.method || !form.amount) {
      alert("Please complete all required fields.");
      return;
    }

    if (Number(form.amount) <= 0) {
      alert("Deposit amount must be greater than $0.");
      return;
    }

    if (Number(form.amount) > 50000) {
      alert("Maximum deposit limit is $50,000 per transaction.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Navigate directly to Success page
      navigate("/success", {
        state: {
          type: "deposit",
          ...form,
          transactionId: "TXN" + Math.floor(Math.random() * 1000000000),
        },
      });
    }, 1200);
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-black mb-2">
          Deposit Funds
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Securely add funds to your selected account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Select Account */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Select Account *
            </label>
            <select
              name="account"
              value={form.account}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Choose account</option>
              {accounts.map((acc, index) => (
                <option
                  key={index}
                  value={`${acc.name} ${acc.masked}`}
                >
                  {acc.name} {acc.masked}
                </option>
              ))}
            </select>

            {selectedAccount && (
              <p className="text-xs text-gray-500 mt-2">
                Current Balance: $
                {selectedAccount.balance.toLocaleString()}
              </p>
            )}
          </div>

          {/* Deposit Method */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Deposit Method *
            </label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Choose method</option>
              {methods.map((method, index) => (
                <option
                  key={index}
                  value={method.name}
                >
                  {method.name}
                </option>
              ))}
            </select>

            {selectedMethod && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedMethod.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Deposit Amount (USD) *
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum $1 • Maximum $50,000 per transaction
            </p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Add a reference note"
              rows="3"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Complete Deposit
          </button>

        </form>

      </div>
    </PageWrapper>
  );
}