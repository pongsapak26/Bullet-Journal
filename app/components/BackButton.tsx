import Link from "next/link";
import { ChevronLeftIcon } from "./Icons";

interface BackButtonProps {
  href: string;
  label?: string;
}

export function BackButton({ href, label = "กลับ" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors"
    >
      <ChevronLeftIcon className="h-6 w-6" />
      <span>{label}</span>
    </Link>
  );
}

interface BackButtonIconProps {
  href: string;
}

export function BackButtonIcon({ href }: BackButtonIconProps) {
  return (
    <Link
      href={href}
      className="p-2 rounded-full hover:bg-cream-200 text-brown-700 transition-colors"
    >
      <ChevronLeftIcon className="h-6 w-6" /> 
    </Link>
  );
}
