"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import {
  ChevronLeftIcon,
  TodoIcon,
  InProgressIcon,
  DoneIcon,
  DocumentIcon,
} from "@/app/components";

interface StatsContentProps {
  statusCounts: {
    todo: number;
    inProgress: number;
    done: number;
    cancelled: number;
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  percentage?: number;
  color: string;
}

function StatCard({ icon, label, count, percentage, color }: StatCardProps) {
  return (
    <div className={`p-6 rounded-2xl ${color}`} data-aos="fade-up">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="font-medium text-brown-700">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold text-brown-800">{count}</span>
        {percentage !== undefined && (
          <span className="text-lg font-medium text-brown-600">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function ProgressBar({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  return (
    <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function StatsContent({ statusCounts }: StatsContentProps) {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 100,
    });
  }, []);

  const total = statusCounts.todo + statusCounts.inProgress + statusCounts.done;
  const activeTotal = total;

  const todoPercent =
    activeTotal > 0 ? (statusCounts.todo / activeTotal) * 100 : 0;
  const inProgressPercent =
    activeTotal > 0 ? (statusCounts.inProgress / activeTotal) * 100 : 0;
  const donePercent =
    activeTotal > 0 ? (statusCounts.done / activeTotal) * 100 : 0;

  const overallProgress =
    activeTotal > 0 ? (statusCounts.done / activeTotal) * 100 : 0;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream-300/95 backdrop-blur-sm border-b border-tan-300">
        <div className="max-w-4xl mx-auto px-4 py-4" data-aos="fade-down">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-full hover:bg-cream-200 text-brown-700 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-800">
              สรุปภาพรวม
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Overall Progress */}
        <div
          className="bg-cream-100 rounded-2xl p-6 mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-brown-700">
              ความคืบหน้าโดยรวม
            </h2>
            <span className="text-3xl font-bold text-green-600">
              {overallProgress.toFixed(1)}%
            </span>
          </div>
          <ProgressBar percentage={overallProgress} color="bg-green-500" />
          <p className="text-sm text-tan-500 mt-3">
            สำเร็จ {statusCounts.done} จาก {activeTotal} รายการ
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<DocumentIcon className="h-6 w-6 text-brown-600" />}
            label="ทั้งหมด"
            count={activeTotal}
            color="bg-cream-100"
          />
          <StatCard
            icon={<InProgressIcon className="h-6 w-6 text-amber-600" />}
            label="กำลังทำ"
            count={statusCounts.inProgress}
            percentage={inProgressPercent}
            color="bg-amber-50"
          />
          <StatCard
            icon={<DoneIcon className="h-6 w-6 text-green-600" />}
            label="สำเร็จ"
            count={statusCounts.done}
            percentage={donePercent}
            color="bg-green-50"
          />
        </div>

        {/* Breakdown */}
        <div
          className="bg-cream-100 rounded-2xl p-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-xl font-semibold text-brown-700 mb-6">
            รายละเอียดสถานะ
          </h2>

          <div className="space-y-4">
            {/* To Do */}
            <div data-aos="fade-up" data-aos-delay="250">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TodoIcon className="h-5 w-5 text-brown-600" />
                  <span className="text-brown-700">รอดำเนินการ</span>
                </div>
                <span className="font-medium text-brown-800">
                  {statusCounts.todo} ({todoPercent.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar percentage={todoPercent} color="bg-brown-400" />
            </div>

            {/* In Progress */}
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <InProgressIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-brown-700">กำลังดำเนินการ</span>
                </div>
                <span className="font-medium text-brown-800">
                  {statusCounts.inProgress} ({inProgressPercent.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar
                percentage={inProgressPercent}
                color="bg-amber-500"
              />
            </div>

            {/* Done */}
            <div data-aos="fade-up" data-aos-delay="350">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DoneIcon className="h-5 w-5 text-green-600" />
                  <span className="text-brown-700">สำเร็จ</span>
                </div>
                <span className="font-medium text-brown-800">
                  {statusCounts.done} ({donePercent.toFixed(1)}%)
                </span>
              </div>
              <ProgressBar percentage={donePercent} color="bg-green-500" />
            </div>
          </div>

          {statusCounts.cancelled > 0 && (
            <p className="text-sm text-tan-400 mt-6">
              * ไม่นับรวม {statusCounts.cancelled} รายการที่ยกเลิก
            </p>
          )}
        </div>
      </main>
    </>
  );
}
