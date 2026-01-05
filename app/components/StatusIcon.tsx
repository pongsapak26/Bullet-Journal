"use client";

import { TodoIcon, InProgressIcon, DoneIcon, CancelledIcon } from "./Icons";

interface StatusIconProps {
  status: string;
  className?: string;
  showLabel?: boolean;
}

const STATUS_CONFIG = {
  todo: {
    icon: TodoIcon,
    label: "To Do",
    className: "text-brown-600",
  },
  inProgress: {
    icon: InProgressIcon,
    label: "In Progress",
    className: "text-amber-600",
  },
  done: {
    icon: DoneIcon,
    label: "Done",
    className: "text-green-600",
  },
  cancelled: {
    icon: CancelledIcon,
    label: "Cancelled",
    className: "text-tan-500",
  },
};

export function StatusIcon({
  status,
  className = "h-5 w-5",
  showLabel = false,
}: StatusIconProps) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;
  const Icon = config.icon;

  if (showLabel) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.className}`}>
        <Icon className={className} />
        <span className="text-sm">{config.label}</span>
      </span>
    );
  }

  return <Icon className={`${className} ${config.className}`} />;
}

// สำหรับใช้ใน select dropdown
export function StatusOption({ status }: { status: string }) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 ${config.className}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
