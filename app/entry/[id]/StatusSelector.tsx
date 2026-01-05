"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEntry, EntryStatus } from "@/app/actions/entries";
import {
  TodoIcon,
  InProgressIcon,
  DoneIcon,
  CancelledIcon,
} from "@/app/components";

interface StatusSelectorProps {
  entryId: string;
  currentStatus: string;
}

const statusConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    activeClass: string;
  }
> = {
  todo: {
    icon: TodoIcon,
    text: "To Do",
    activeClass: "bg-brown-100 text-brown-700 ring-brown-600",
  },
  inProgress: {
    icon: InProgressIcon,
    text: "In Progress",
    activeClass: "bg-amber-50 text-amber-700 ring-amber-600",
  },
  done: {
    icon: DoneIcon,
    text: "Done",
    activeClass: "bg-green-50 text-green-700 ring-green-600",
  },
  cancelled: {
    icon: CancelledIcon,
    text: "Cancelled",
    activeClass: "bg-tan-100 text-tan-600 ring-tan-500",
  },
};

const statusOrder: EntryStatus[] = ["todo", "inProgress", "done", "cancelled"];

export function StatusSelector({
  entryId,
  currentStatus,
}: StatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  async function handleStatusChange(newStatus: EntryStatus) {
    if (newStatus === status || updating) return;

    setUpdating(true);
    const oldStatus = status;
    setStatus(newStatus);

    const result = await updateEntry(entryId, { status: newStatus });

    if (!result.success) {
      setStatus(oldStatus);
      alert(result.error || "เกิดข้อผิดพลาด");
    }

    setUpdating(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statusOrder.map((s) => {
        const config = statusConfig[s];
        const Icon = config.icon;
        const isActive = status === s;

        return (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={updating}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? `${config.activeClass} ring-2 ring-offset-2`
                  : "bg-cream-100 text-brown-400 hover:bg-cream-200"
              }
              ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <Icon className="h-4 w-4" />
            <span>{config.text}</span>
          </button>
        );
      })}
    </div>
  );
}
