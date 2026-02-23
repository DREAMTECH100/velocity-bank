export default function PageWrapper({ children }) {
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

      {/* Page Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>

    </div>
  );
}