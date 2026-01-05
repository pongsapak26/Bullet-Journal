"use client";

import { verifyMagicLink } from "@/app/actions/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasVerified = useRef(false); // ป้องกันการ verify ซ้ำ
  const [state, setState] = useState<{
    loading: boolean;
    success?: boolean;
    error?: string;
  }>({ loading: true });

  useEffect(() => {
    const verify = async () => {
      // ป้องกัน double verify (React Strict Mode เรียก useEffect 2 ครั้ง)
      if (hasVerified.current) return;
      hasVerified.current = true;

      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setState({ loading: false, error: "Invalid verification link" });
        return;
      }

      try {
        const result = await verifyMagicLink(token, email);

        if (result.success) {
          setState({ loading: false, success: true });
          // Redirect ทันทีเพราะ session ถูกสร้างแล้ว
          setTimeout(() => router.push("/dashboard"), 1500);
        } else {
          setState({ loading: false, error: result.error });
        }
      } catch {
        setState({ loading: false, error: "Verification failed" });
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#e3ddc5" }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold" style={{ color: "#543f3f" }}>
            Verifying...
          </h1>
        </div>

        {state.loading && (
          <div className="flex justify-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: "#543f3f" }}
            />
          </div>
        )}

        {state.success && (
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: "#d4edda", color: "#155724" }}
          >
            <p className="font-medium text-lg">
              ✓ Email verified successfully!
            </p>
            <p className="text-sm mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        {state.error && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#f8d7da", color: "#721c24" }}
            >
              <p className="font-medium">✗ {state.error}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-200 text-white"
              style={{ backgroundColor: "#543f3f" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#3d2e2e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#543f3f";
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
