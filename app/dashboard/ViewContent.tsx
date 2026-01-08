"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronRightIcon, NoteIcon } from "@/app/components";

interface Entry {
  id: string;
  title: string;
  description?: string;
  month: number | null;
  day?: number;
  status?: string;
  createdAt?: string;
}

interface ViewContentProps {
  entries: Entry[];
  viewMode: "month" | "list";
  selectedYear: number;
  isCurrentYear: boolean;
  currentMonth: number;
}

const MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ViewContent({
  entries,
  viewMode,
  selectedYear,
  isCurrentYear,
  currentMonth,
}: ViewContentProps) {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, [viewMode]); // Re-init when view mode changes

  // Get entries for a specific month
  const getMonthEntries = useCallback(
    (monthIndex: number) => {
      return entries.filter((e) => e.month === monthIndex + 1);
    },
    [entries]
  );

  // Get all entries sorted by date
  const getAllEntriesSorted = useCallback(() => {
    return [...entries].sort((a, b) => {
      const monthDiff = (a.month || 0) - (b.month || 0);
      if (monthDiff !== 0) return monthDiff;
      return (a.day || 0) - (b.day || 0);
    });
  }, [entries]);

  return (
    <main className="max-w-6xl mx-auto px-4 pb-12">
      {viewMode === "month" ? (
        // MONTH VIEW
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MONTHS_TH.map((monthTh, index) => {
            const isCurrentMonthCard = isCurrentYear && index === currentMonth;
            const isPastMonth = isCurrentYear && index < currentMonth;
            const isFutureMonth = isCurrentYear && index > currentMonth;
            const isPastYear = selectedYear < new Date().getFullYear();
            const isFutureYear = selectedYear > new Date().getFullYear();
            const monthEntryCount = getMonthEntries(index).length;

            return (
              <Link
                key={index}
                href={`/dashboard/${selectedYear}/${index + 1}`}
                className={`
                  group relative overflow-hidden rounded-2xl p-5 sm:p-6
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl
                  ${
                    isCurrentMonthCard
                      ? "bg-brown-800 text-cream-100 shadow-lg shadow-brown-300/50 ring-4 ring-tan-400"
                      : isPastMonth || isPastYear
                      ? "bg-cream-200 text-brown-600 hover:bg-tan-100"
                      : isFutureMonth || isFutureYear
                      ? "bg-cream-100 text-brown-400 hover:bg-cream-200"
                      : "bg-cream-200 text-brown-700 hover:bg-tan-100"
                  }
                `}
                data-aos="fade-up"
                data-aos-delay={`${(index % 4) * 100}`}
              >
                {/* Entry count badge */}
                {monthEntryCount > 0 && (
                  <div
                    className={`
                    absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full
                    ${
                      isCurrentMonthCard
                        ? "bg-tan-400/30 text-cream-200"
                        : "bg-brown-700/10 text-brown-600"
                    }
                  `}
                  >
                    {monthEntryCount} รายการ
                  </div>
                )}

                {/* Current month indicator */}
                {isCurrentMonthCard && (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-tan-300"></span>
                    </span>
                  </div>
                )}

                {/* Month number */}
                <div
                  className={`
                  text-4xl sm:text-5xl font-bold font-caveat mb-2
                  ${
                    isCurrentMonthCard
                      ? "text-tan-300"
                      : "text-tan-400 group-hover:text-tan-500"
                  }
                `}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Month name English */}
                <h3
                  className={`
                  text-lg sm:text-xl font-semibold mb-1
                  ${isCurrentMonthCard ? "text-cream-100" : ""}
                `}
                >
                  {MONTHS_EN[index]}
                </h3>

                {/* Month name Thai */}
                <p
                  className={`
                  text-xs sm:text-sm
                  ${isCurrentMonthCard ? "text-cream-300" : "text-tan-500"}
                `}
                >
                  {monthTh}
                </p>

                {/* Hover arrow */}
                <div
                  className={`
                  absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                  transition-all duration-200 transform translate-x-2 group-hover:translate-x-0
                  ${isCurrentMonthCard ? "text-tan-300" : "text-tan-500"}
                `}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // LIST VIEW - All entries sorted by date
        <div className="space-y-3">
          {getAllEntriesSorted().length === 0 ? (
            <div className="text-center py-12 text-tan-500" data-aos="fade-up">
              <p className="text-lg">ไม่มีบันทึกในปีนี้</p>
            </div>
          ) : (
            getAllEntriesSorted().map((entry, idx) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                className="group block bg-cream-100 hover:bg-tan-50 rounded-xl p-4 transition-all hover:shadow-md border border-cream-200 hover:border-tan-300"
                data-aos="fade-up"
                data-aos-delay={`${(idx % 5) * 100}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-tan-600 bg-cream-200 px-2.5 py-1 rounded-full">
                        {String(entry.day).padStart(2, "0")}{" "}
                        {MONTHS_TH[(entry.month || 1) - 1]}
                      </span>
                      {entry.status && (
                        <span className="text-xs font-medium text-brown-600 bg-cream-200 px-2.5 py-1 rounded-full">
                          {entry.status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-brown-800 group-hover:text-brown-900 truncate">
                      {entry.title || "(ไม่มีหัวข้อ)"}
                    </h3>
                    {entry.description && (
                      <p className="text-sm text-tan-600 line-clamp-2 mt-1">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-brown-400 group-hover:text-brown-600 transition-colors">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
}
