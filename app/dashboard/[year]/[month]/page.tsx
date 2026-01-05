import { getEntries } from "@/app/actions/entries";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EntryCard } from "./EntryCard";
import { CreateEntryButton } from "./CreateEntryButton";
import { ChevronLeftIcon, ChevronRightIcon, NoteIcon } from "@/app/components";

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

interface PageProps {
  params: Promise<{
    year: string;
    month: string;
  }>;
}

export default async function MonthPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    redirect("/dashboard");
  }

  const result = await getEntries(year, month);
  const entries = result.entries || [];

  // จัดเรียงตาม day (ถ้ามี) หรือ createdAt
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.day && b.day) return a.day - b.day;
    if (a.day) return -1;
    if (b.day) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  return (
    <div className="min-h-screen w-full bg-cream-300">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream-300/95 backdrop-blur-sm border-b border-tan-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-full hover:bg-cream-200 text-brown-700 transition-colors"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brown-800 font-caveat">
                  {MONTHS_EN[month - 1]} {year}
                </h1>
                {isCurrentMonth && (
                  <span className="text-xs text-tan-500">• เดือนนี้</span>
                )}
              </div>
            </div>

            <CreateEntryButton year={year} month={month} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <NoteIcon className="h-16 w-16 text-tan-400" />
            </div>
            <h2 className="text-xl font-semibold text-brown-700 mb-2">
              ยังไม่มีบันทึก
            </h2>
            <p className="text-tan-500 mb-6">
              เริ่มสร้างบันทึกแรกของเดือนนี้กันเถอะ!
            </p>
            <CreateEntryButton year={year} month={month} variant="large" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>

      {/* Month Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream-200/95 backdrop-blur-sm border-t border-tan-200 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link
            href={`/dashboard/${month === 1 ? year - 1 : year}/${
              month === 1 ? 12 : month - 1
            }`}
            className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="text-sm">
              {MONTHS_EN[month === 1 ? 11 : month - 2]}
            </span>
          </Link>

          <span className="text-tan-500 text-sm">{entries.length} บันทึก</span>

          <Link
            href={`/dashboard/${month === 12 ? year + 1 : year}/${
              month === 12 ? 1 : month + 1
            }`}
            className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors"
          >
            <span className="text-sm">
              {MONTHS_EN[month === 12 ? 0 : month]}
            </span>
            <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
