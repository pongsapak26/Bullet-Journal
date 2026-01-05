"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry, updateEntry, EntryStatus } from "@/app/actions/entries";
import { EditIcon, TrashIcon, CloseIcon } from "@/app/components";

interface Entry {
  id: string;
  title: string;
  description: string;
  status: string;
  day: number | null;
  month: number | null;
  year: number;
}

interface EntryActionsProps {
  entry: Entry;
}

export function EntryActions({ entry }: EntryActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("ต้องการลบบันทึกนี้หรือไม่?")) return;

    setLoading(true);
    const result = await deleteEntry(entry.id);

    if (result.success) {
      router.push(`/dashboard/${entry.year}/${entry.month}`);
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateEntry(entry.id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as EntryStatus,
      day: formData.get("day") ? parseInt(formData.get("day") as string) : null,
    });

    setLoading(false);

    if (result.success) {
      setIsEditing(false);
      router.refresh();
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-full hover:bg-cream-200 text-brown-700 transition-colors"
          title="แก้ไข"
        >
          <EditIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
          title="ลบ"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/50 backdrop-blur-sm h-screen">
          <div className="w-full max-w-md bg-cream-100 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-brown-800 text-cream-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold font-caveat">แก้ไขบันทึก</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 hover:bg-brown-700 rounded-full transition-colors"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">
                  หัวข้อ *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={entry.title}
                  className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-700 mb-1">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={entry.description}
                  className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    วันที่
                  </label>
                  <input
                    type="number"
                    name="day"
                    min="1"
                    max="31"
                    defaultValue={entry.day || ""}
                    className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    สถานะ
                  </label>
                  <select
                    name="status"
                    defaultValue={entry.status}
                    className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
                  >
                    <option value="todo">○ To Do</option>
                    <option value="inProgress">◐ In Progress</option>
                    <option value="done">● Done</option>
                    <option value="cancelled">⊘ Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 border-2 border-tan-300 text-brown-700 rounded-lg font-medium hover:bg-cream-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-brown-800 text-cream-100 rounded-lg font-medium hover:bg-brown-900 transition-colors disabled:opacity-50"
                >
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
