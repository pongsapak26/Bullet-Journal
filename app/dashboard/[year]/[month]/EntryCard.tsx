"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  TodoIcon,
  InProgressIcon,
  DoneIcon,
  CancelledIcon,
} from "@/app/components";

interface EntryCardProps {
  entry: {
    id: string;
    title: string;
    description: string;
    status: string;
    day: number | null;
    images: {
      id: string;
      imageBase64: string;
      filename: string | null;
    }[];
  };
}

const statusColors: Record<string, string> = {
  todo: "bg-tan-100",
  inProgress: "bg-amber-50",
  done: "bg-green-50",
  cancelled: "bg-tan-50",
};

const StatusIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  todo: TodoIcon,
  inProgress: InProgressIcon,
  done: DoneIcon,
  cancelled: CancelledIcon,
};

export function EntryCard({ entry }: EntryCardProps) {
  const hasImage = entry.images.length > 0;
  const hasMultipleImages = entry.images.length > 1;
  const StatusIcon = StatusIconMap[entry.status] || TodoIcon;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 50,
    });
  }, []);

  // Auto-rotate images when hovering
  useEffect(() => {
    if (isHovering && hasMultipleImages) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % entry.images.length);
      }, 1500); // เปลี่ยนทุก 1.5 วินาที
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentImageIndex(0);
    };
  }, [isHovering, hasMultipleImages, entry.images.length]);

  return (
    <Link
      href={`/entry/${entry.id}`}
      className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-aos="fade-up"
    >
      {/* Background */}
      {hasImage ? (
        <div className="absolute inset-0">
          {entry.images.map((img, idx) => (
            <img
              key={img.id}
              src={img.imageBase64}
              alt={entry.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                idx === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      ) : (
        <div
          className={`absolute inset-0 ${
            statusColors[entry.status] || "bg-cream-300"
          }`}
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-brown-900/20 to-transparent" />

      {/* Status badge */}
      <div className="absolute top-2 right-2 p-1.5 bg-cream-100/90 rounded-full">
        <StatusIcon className="h-4 w-4" />
      </div>

      {/* Day badge (if exists) */}
      {entry.day && (
        <div className="absolute top-2 left-2 bg-cream-100/90 text-brown-800 text-xs font-bold px-2 py-1 rounded-full">
          {entry.day}
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
          {entry.title}
        </h3>

        {/* Image indicators */}
        {hasMultipleImages && (
          <div className="flex items-center gap-1.5 mt-2">
            {entry.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
