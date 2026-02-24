export default function NavBar() {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
      
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Velocity Bank Logo"
          className="h-10 w-auto object-contain"
        />
        <span className="text-white font-semibold text-lg tracking-wide">
          Velocity Bank
        </span>
      </div>

    </div>
  );
}