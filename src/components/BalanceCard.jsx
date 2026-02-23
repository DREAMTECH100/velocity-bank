export default function BalanceCard() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg">
      <p className="text-blue-100 text-sm">Total Available Balance</p>
      <h2 className="text-4xl font-bold mt-2">$1,700,000.00</h2>
      <p className="mt-2 text-blue-200 text-sm">
        Routing: 021000021 • Account: ****8821
      </p>
    </div>
  );
}