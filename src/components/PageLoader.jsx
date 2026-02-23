export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center w-80">

        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

        <h2 className="text-xl font-semibold mb-2">
          Processing Secure Request
        </h2>

        <p className="text-sm text-gray-500">
          Please wait while we complete your request...
        </p>

      </div>

    </div>
  );
}