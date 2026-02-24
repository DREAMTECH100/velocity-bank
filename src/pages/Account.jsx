import PageWrapper from "../components/PageWrapper";
import { useState } from "react";

export default function Account() {
  const [copied, setCopied] = useState("");

  const accountData = {
    firstName: "Michael",
    middleName: "J",
    lastName: "Young",
    accountType: "Premium Checking Account",
    accountNumber: "2025 5501 8821",
    routingNumber: "021000021",
    swift: "VLBKUS33",
    iban: "US29VLBK55014789202501",
    currency: "USD",
    memberSince: "January 2022",
    customerId: "VL-5589201",
  };

const [showNotice, setShowNotice] = useState(false);

const handleBranchNotice = () => {
  setShowNotice(true);

  setTimeout(() => {
    setShowNotice(false);
  }, 3000);
};

  const handleCopy = (value, label) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const currentDate = new Date().toLocaleString();

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto text-white">

        <h1 className="text-3xl font-bold mb-8">Account Overview</h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Profile Summary */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/logo.png"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {accountData.firstName} {accountData.middleName} {accountData.lastName}
                </h2>
                <p className="text-sm text-green-400">
                  {accountData.accountType} • Verified
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <p>Customer ID: {accountData.customerId}</p>
              <p>Member Since: {accountData.memberSince}</p>
              <p>Last Login: {currentDate}</p>
              <p>Status: <span className="text-green-400">Active</span></p>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>

            <div className="space-y-3 text-sm">

              {[
                { label: "Account Number", value: accountData.accountNumber },
                { label: "Routing Number", value: accountData.routingNumber },
                { label: "SWIFT Code", value: accountData.swift },
                { label: "IBAN", value: accountData.iban },
                { label: "Currency", value: accountData.currency },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span>{item.value}</span>
                    <button
                      onClick={() => handleCopy(item.value, item.label)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}

            </div>

            {copied && (
              <p className="text-green-400 text-xs mt-3">
                {copied} copied successfully
              </p>
            )}
          </div>

          {/* Security Settings */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Security</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p>Transaction PIN: Enabled</p>
              <p>Two-Factor Authentication: Enabled</p>
              <p>Biometric Login: Disabled</p>
              <p>Last Password Change: 30 Days Ago</p>
              <p>Recent Device: Chrome on Windows</p>
            </div>
          </div>

          {/* Limits & Services */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Limits & Services</h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p>Daily Transfer Limit: $40,000</p>
              <p>ATM Withdrawal Limit: $2,500</p>
              <p>International Transfers: Enabled</p>
              <p>Virtual Card: Inactive (•••• 4589)</p>
              <p>Physical Debit Card: Active</p>
            </div>
          </div>

        </div>

        {/* Documents */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mt-6">
          <h3 className="text-lg font-semibold mb-4">Documents & Statements</h3>

          <div className="flex flex-wrap gap-4 text-sm">
           <button
  onClick={handleBranchNotice}
  className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
>
  Download Statement
</button>

<button
  onClick={handleBranchNotice}
  className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
>
  Tax Summary
</button>
            <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
              KYC Status: Verified
            </button>
          </div>
        </div>

      </div>
      {showNotice && (
  <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-xl animate-fade">
    Kindly visit the nearest branch for this information.
  </div>
)}
    </PageWrapper>
  );
}