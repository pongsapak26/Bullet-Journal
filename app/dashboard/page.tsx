"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  PageContainer,
  PageHeader,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutButton,
  NoteIcon,
} from "@/app/components";
import { getEntries } from "@/app/actions/entries";

interface Entry {
  id: string;
  title: string;
  month: number;
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

export default function Dashboard() {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [displayTitle, setDisplayTitle] = useState<string>("");
  const titleIndexRef = useRef(0);

  const isCurrentYear = selectedYear === currentYear;

  // Fetch entries when year changes
  useEffect(() => {
    async function fetchEntries() {
      const result = await getEntries(selectedYear);
      if (result.entries) {
        setEntries(
          result.entries.map(
            (e: { id: string; title: string; month: number }) => ({
              id: e.id,
              title: e.title,
              month: e.month,
            })
          )
        );
      }
    }
    fetchEntries();
  }, [selectedYear]);

  // Get entries for a specific month
  const getMonthEntries = useCallback(
    (monthIndex: number) => {
      return entries.filter((e) => e.month === monthIndex + 1);
    },
    [entries]
  );

  // Rotate title every 5 seconds when hovering
  useEffect(() => {
    if (hoveredMonth === null) return;

    const monthEntries = getMonthEntries(hoveredMonth);
    if (monthEntries.length === 0) return;

    // Set initial random index
    titleIndexRef.current = Math.floor(Math.random() * monthEntries.length);
    setDisplayTitle(monthEntries[titleIndexRef.current].title);

    // Rotate every 5 seconds
    const interval = setInterval(() => {
      titleIndexRef.current = (titleIndexRef.current + 1) % monthEntries.length;
      setDisplayTitle(monthEntries[titleIndexRef.current].title);
    }, 5000);

    return () => {
      clearInterval(interval);
      setDisplayTitle("");
    };
  }, [hoveredMonth, getMonthEntries]);

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-brown-800 font-caveat">
            <NoteIcon className="h-8 w-8 inline-block mr-2" />
            Bullet Journal
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/stats"
              className="p-2 rounded-full hover:bg-cream-200 text-brown-700 transition-colors"
              title="สถิติ"
            >
              <label className="text-tan-600 hover:text-brown-800 transition-colors text-sm">
                สรุปภาพรวม
              </label>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </PageHeader>

      {/* Year Selector */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            className="p-2 sm:p-3 rounded-full bg-cream-200 hover:bg-tan-200 text-brown-700 transition-all duration-200 hover:scale-110"
            aria-label="ปีก่อนหน้า"
          >
            <ChevronLeftIcon />
          </button>

          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-brown-800 font-caveat">
              {selectedYear + 543}
            </h2>
            <p className="text-tan-600 text-sm mt-1">
              ({selectedYear})
              {isCurrentYear && (
                <span className="ml-2 text-tan-500 font-medium">• ปีนี้</span>
              )}
            </p>
          </div>

          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            className="p-2 sm:p-3 rounded-full bg-cream-200 hover:bg-tan-200 text-brown-700 transition-all duration-200 hover:scale-110"
            aria-label="ปีถัดไป"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Quick jump to current year */}
        {!isCurrentYear && (
          <div className="text-center mt-4">
            <button
              onClick={() => setSelectedYear(currentYear)}
              className="text-sm text-tan-500 hover:text-brown-700 underline transition-colors"
            >
              กลับไปปีปัจจุบัน ({currentYear + 543})
            </button>
          </div>
        )}
      </div>

      {/* Months Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MONTHS_TH.map((monthTh, index) => {
            const isCurrentMonth = isCurrentYear && index === currentMonth;
            const isPastMonth = isCurrentYear && index < currentMonth;
            const isFutureMonth = isCurrentYear && index > currentMonth;
            const isPastYear = selectedYear < currentYear;
            const isFutureYear = selectedYear > currentYear;
            const monthEntryCount = getMonthEntries(index).length;
            const isHovered = hoveredMonth === index;

            return (
              <Link
                key={index}
                href={`/dashboard/${selectedYear}/${index + 1}`}
                className={`
                  group relative overflow-hidden rounded-2xl p-5 sm:p-6
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl
                  ${
                    isCurrentMonth
                      ? "bg-brown-800 text-cream-100 shadow-lg shadow-brown-300/50 ring-4 ring-tan-400"
                      : isPastMonth || isPastYear
                      ? "bg-cream-200 text-brown-600 hover:bg-tan-100"
                      : isFutureMonth || isFutureYear
                      ? "bg-cream-100 text-brown-400 hover:bg-cream-200"
                      : "bg-cream-200 text-brown-700 hover:bg-tan-100"
                  }
                `}
                onMouseEnter={() => setHoveredMonth(index)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Hover title display */}
                {isHovered && displayTitle && (
                  <div
                    className={`
                    absolute inset-x-3 top-2 text-xs truncate px-2 py-1 rounded-full text-center
                    transition-all duration-300 animate-fade-in
                    ${
                      isCurrentMonth
                        ? "bg-tan-400/30 text-cream-200"
                        : "bg-brown-700/10 text-brown-600"
                    }
                  `}
                  >
                    {displayTitle}
                  </div>
                )}

                {/* Entry count badge */}
                {monthEntryCount > 0 && !isHovered && (
                  <div
                    className={`
                    absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full
                    ${
                      isCurrentMonth
                        ? "bg-tan-400/30 text-cream-200"
                        : "bg-brown-700/10 text-brown-600"
                    }
                  `}
                  >
                    {monthEntryCount} รายการ
                  </div>
                )}

                {/* Current month indicator */}
                {isCurrentMonth && (
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
                    isCurrentMonth
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
                  ${isCurrentMonth ? "text-cream-100" : ""}
                `}
                >
                  {MONTHS_EN[index]}
                </h3>

                {/* Month name Thai */}
                <p
                  className={`
                  text-xs sm:text-sm
                  ${isCurrentMonth ? "text-cream-300" : "text-tan-500"}
                `}
                >
                  {monthTh}
                </p>

                {/* Hover arrow */}
                <div
                  className={`
                  absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                  transition-all duration-200 transform translate-x-2 group-hover:translate-x-0
                  ${isCurrentMonth ? "text-tan-300" : "text-tan-500"}
                `}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-tan-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-tan-500 text-sm inline-flex items-center justify-center gap-1.5">
            <NoteIcon className="h-4 w-4" /> เลือกเดือนเพื่อดูหรือเพิ่มบันทึก
          </p>
        </div>
      </footer>
    </PageContainer>
  );
}
