"use client";

export function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cream-300">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 bg-brown-800"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 bg-tan-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-6 text-center">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-brown-800 font-caveat">
            Bullet Journal
          </h1>
          <p className="text-tan-600">กำลังโหลด...</p>
        </div>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brown-800 border-r-brown-800 animate-spin"></div>

            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-tan-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-sm text-tan-500">
          <p>Please wait...</p>
        </div>
      </div>
    </div>
  );
}
