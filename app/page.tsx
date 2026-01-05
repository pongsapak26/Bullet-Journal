"use client";

import { sendMagicLink } from "./actions/auth";
import { useState } from "react";
import { Header } from "./components/Header";
import { EmailInput } from "./components/EmailInput";
import { SubmitButton } from "./components/SubmitButton";
import {
  SuccessMessage,
  ErrorMessage,
  DebugLink,
} from "./components/MessageBox";

export default function Home() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{
    loading?: boolean;
    success?: boolean;
    error?: string;
    debugLink?: string;
  }>({});

  async function handleSubmit(formData: FormData) {
    setState({ loading: true });
    const result = await sendMagicLink(formData);
    setState({
      loading: false,
      success: result.success,
      error: result.error,
      debugLink: result.debugLink,
    });
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-cream-300">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 bg-brown-800"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 bg-tan-500"></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10 px-4 sm:px-6">
        {/* Header Section */}
        <Header />

        {/* Form Container */}
        <div className="space-y-6 sm:space-y-8">
          <form action={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Input */}
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit Button */}
            <SubmitButton isLoading={state.loading} isDisabled={!email} />
          </form>

          {/* Messages */}
          {state.success && <SuccessMessage />}
          {state.error && <ErrorMessage message={state.error} />}
          {state.debugLink && <DebugLink debugLink={state.debugLink} />}
        </div>

        {/* Footer Info */}
        <div className="mt-10 sm:mt-14 text-center space-y-3">
          <p className="text-xs sm:text-sm font-medium text-tan-500">
            💌 No password needed
          </p>
          <p className="text-xs text-tan-400">Your data is safe and secure</p>
        </div>
      </div>
    </div>
  );
}
