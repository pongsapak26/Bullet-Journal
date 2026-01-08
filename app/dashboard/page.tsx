"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  PageContainer,
  PageHeader,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutButton,
  NoteIcon,
  ContentLoading,
} from "@/app/components";
import { getEntries } from "@/app/actions/entries";
import { ViewContent } from "./ViewContent";

interface Entry {
  id: string;
  title: string;
  description?: string;
  month: number | null;
  day?: number;
  status?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "list">("month"); // 2 modes

  const isCurrentYear = selectedYear === currentYear;

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Fetch entries when year changes
  useEffect(() => {
    async function fetchEntries() {
      const result = await getEntries(selectedYear);
      if (result.entries) {
        setEntries(
          result.entries.map((e) => ({
            id: e.id,
            title: e.title,
            month: e.month,
            day: e.day || undefined,
            description: e.description || undefined,
            status: e.status || undefined,
            createdAt: e.createdAt?.toString(),
          }))
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

  return (
    <PageContainer>
      {/* Header with Mode Toggle */}
      <PageHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-brown-800 font-caveat">
            <NoteIcon className="h-8 w-8 inline-block mr-2" />
            Bullet Journal
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mode Toggle */}

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
            data-aos="fade-up"
          >
            <ChevronLeftIcon />
          </button>

          <div className="text-center" data-aos="fade-up">
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
            data-aos="fade-up"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <div className="flex gap-2 bg-cream-200 rounded-full p-1">
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === "month"
                ? "bg-brown-800 text-cream-100"
                : "text-brown-600 hover:text-brown-800"
            }`}
          >
            เดือน
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-brown-800 text-cream-100"
                : "text-brown-600 hover:text-brown-800"
            }`}
          >
            รายการ
          </button>
        </div>
        {/* Quick jump to current year */}
        {!isCurrentYear && (
          <div className="text-center mt-4" data-aos="fade-up">
            <button
              onClick={() => setSelectedYear(currentYear)}
              className="text-sm text-tan-500 hover:text-brown-700 underline transition-colors"
            >
              กลับไปปีปัจจุบัน ({currentYear + 543})
            </button>
          </div>
        )}
      </div>

      {/* Main Content with Loading State */}
      <Suspense fallback={<ContentLoading />}>
        <ViewContent
          entries={entries}
          viewMode={viewMode}
          selectedYear={selectedYear}
          isCurrentYear={isCurrentYear}
          currentMonth={currentMonth}
        />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-tan-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-tan-500 text-sm inline-flex items-center justify-center gap-1.5">
            <NoteIcon className="h-4 w-4" />
            {viewMode === "month"
              ? "เลือกเดือนเพื่อดูหรือเพิ่มบันทึก"
              : "คลิกเพื่อแก้ไขหรือดูรายละเอียด"}
          </p>
        </div>
      </footer>
    </PageContainer>
  );
}
