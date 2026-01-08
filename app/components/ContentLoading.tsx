"use client";

export function ContentLoading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-brown-800 border-r-brown-800 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-tan-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-tan-600 font-medium">กำลังโหลด...</p>
      </div>
    </div>
  );
}
