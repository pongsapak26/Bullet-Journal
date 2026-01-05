import { getEntry } from "@/app/actions/entries";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EntryActions } from "./EntryActions";
import { ImageGallery } from "./ImageGallery";
import { StatusSelector } from "./StatusSelector";
import { ChevronLeftIcon, ImageIcon, CalendarIcon } from "@/app/components";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EntryPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { id } = await params;
  const result = await getEntry(id);

  if (result.error || !result.entry) {
    redirect("/dashboard");
  }

  const entry = result.entry;

  return (
    <div className="min-h-screen w-full bg-cream-300">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream-300/95 backdrop-blur-sm border-b border-tan-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/${entry.year}/${entry.month}`}
              className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
              <span>กลับ</span>
            </Link>

            <EntryActions entry={entry} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Selector - กดเปลี่ยนได้ทันที */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-brown-600 mb-2">
            สถานะ
          </label>
          <StatusSelector entryId={entry.id} currentStatus={entry.status} />
        </div>

        {/* Date */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-tan-500 text-sm inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            {entry.day && `${entry.day} `}
            {entry.month && `เดือน ${entry.month} `}
            {entry.year && `ปี ${entry.year}`}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-brown-800 font-caveat mb-4">
          {entry.title}
        </h1>

        {/* Description */}
        {entry.description && (
          <div className="bg-cream-100 rounded-2xl p-6 mb-8">
            <p className="text-brown-700 whitespace-pre-wrap leading-relaxed">
              {entry.description}
            </p>
          </div>
        )}

        {/* Images - แสดงตลอดเพื่อให้เพิ่มรูปได้ */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brown-700 mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            รูปภาพ {entry.images.length > 0 && `(${entry.images.length})`}
          </h2>
          <ImageGallery images={entry.images} entryId={entry.id} />
        </div>

        {/* Metadata */}
        <div className="border-t border-tan-200 pt-6 text-sm text-tan-500">
          <p>สร้างเมื่อ: {new Date(entry.createdAt).toLocaleString("th-TH")}</p>
          <p>
            แก้ไขล่าสุด: {new Date(entry.updatedAt).toLocaleString("th-TH")}
          </p>
        </div>
      </main>
    </div>
  );
}
