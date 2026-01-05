import { ChangeEvent } from "react";

interface EmailInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

export function EmailInput({
  value,
  onChange,
  placeholder = "your@email.com",
  label = "Email Address",
}: EmailInputProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-brown-800"
      >
        {label}
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="email"
        className="w-full px-5 py-5 text-base sm:text-lg rounded-2xl border-2 border-tan-400 bg-white text-brown-800 transition-all duration-200 focus:outline-none focus:border-brown-800 focus:ring-4 focus:ring-brown-100 placeholder:text-tan-400"
      />
    </div>
  );
}
