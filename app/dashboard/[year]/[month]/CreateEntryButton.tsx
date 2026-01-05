"use client";

import { useState } from "react";
import { createEntry, EntryStatus } from "@/app/actions/entries";
import { useRouter } from "next/navigation";
import { PlusIcon, CloseIcon } from "@/app/components";

interface CreateEntryButtonProps {
  year: number;
  month: number;
  variant?: "default" | "large";
}

export function CreateEntryButton({
  year,
  month,
  variant = "default",
}: CreateEntryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as EntryStatus;
    const day = formData.get("day") as string;
    const imageFile = formData.get("image") as File;

    let images: string[] = [];

    // Convert image to base64 if exists
    if (imageFile && imageFile.size > 0) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
      images = [base64];
    }

    const result = await createEntry({
      title,
      description,
      status,
      day: day ? parseInt(day) : undefined,
      month,
      year,
      images,
    });

    setLoading(false);

    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
    }
  }

  if (variant === "large") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brown-800 text-cream-100 rounded-full font-medium hover:bg-brown-900 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          สร้างบันทึกใหม่
        </button>
        {isOpen && (
          <CreateEntryModal
            year={year}
            month={month}
            loading={loading}
            onSubmit={handleSubmit}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-brown-800 text-cream-100 hover:bg-brown-900 transition-colors"
        title="สร้างบันทึกใหม่"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <CreateEntryModal
          year={year}
          month={month}
          loading={loading}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function CreateEntryModal({
  year,
  month,
  loading,
  onSubmit,
  onClose,
}: {
  year: number;
  month: number;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ขนาดไฟล์สูงสุด 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์
      if (file.size > MAX_FILE_SIZE) {
        alert("ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ที่เล็กกว่า");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Get max days for this month
  const maxDays = new Date(year, month, 0).getDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/50 backdrop-blur-sm h-screen">
      <div className="w-full max-w-md bg-cream-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brown-800 text-cream-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold font-caveat">สร้างบันทึกใหม่</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-brown-700 rounded-full transition-colors"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              หัวข้อ *
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
              placeholder="หัวข้อบันทึก"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              รายละเอียด
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800 resize-none"
              placeholder="รายละเอียดเพิ่มเติม..."
            />
          </div>

          {/* Day & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                วันที่
              </label>
              <input
                type="number"
                name="day"
                min="1"
                max={maxDays}
                className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
                placeholder="ไม่ระบุ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-1">
                สถานะ
              </label>
              <select
                name="status"
                defaultValue="todo"
                className="w-full px-4 py-2 border-2 border-tan-300 rounded-lg bg-white text-brown-800 focus:outline-none focus:border-brown-800"
              >
                <option value="todo">○ To Do</option>
                <option value="inProgress">◐ In Progress</option>
                <option value="done">● Done</option>
                <option value="cancelled">⊘ Cancelled</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">
              รูปภาพ (ไม่บังคับ)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-brown-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-tan-200 file:text-brown-700 hover:file:bg-tan-300"
            />
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 p-1 bg-brown-800/80 text-cream-100 rounded-full"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brown-800 text-cream-100 rounded-lg font-medium hover:bg-brown-900 transition-colors disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </form>
      </div>
    </div>
  );
}
