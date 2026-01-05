"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMultipleImagesToEntry, deleteImage } from "@/app/actions/entries";
import { PlusIcon, SpinnerIcon, CloseIcon, TrashIcon } from "@/app/components";

interface Image {
  id: string;
  imageBase64: string;
  filename: string | null;
}

interface ImageGalleryProps {
  images: Image[];
  entryId: string;
}

export function ImageGallery({ images, entryId }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<
    { base64: string; filename: string }[]
  >([]);
  const router = useRouter();

  // ขนาดไฟล์สูงสุด 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // จัดการเลือกหลายรูป
  async function handleFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // แปลงไฟล์เป็น base64 แล้วเก็บ preview
    const newPreviews: { base64: string; filename: string }[] = [];
    const oversizedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // ตรวจสอบขนาดไฟล์
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        continue;
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPreviews.push({ base64, filename: file.name });
    }

    // แจ้งเตือนถ้ามีไฟล์ที่ใหญ่เกิน
    if (oversizedFiles.length > 0) {
      alert(`ไฟล์ต่อไปนี้มีขนาดเกิน 5MB:\n${oversizedFiles.join("\n")}`);
    }

    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  }

  // ลบ preview
  function removePreview(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // อัปโหลดทั้งหมด
  async function handleUploadAll() {
    if (previews.length === 0) return;

    setUploading(true);
    const result = await addMultipleImagesToEntry(entryId, previews);
    setUploading(false);

    if (result.success) {
      setPreviews([]);
      router.refresh();
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm("ต้องการลบรูปนี้หรือไม่?")) return;

    const result = await deleteImage(imageId);

    if (result.success) {
      setSelectedImage(null);
      router.refresh();
    } else {
      alert(result.error || "เกิดข้อผิดพลาด");
    }
  }

  return (
    <>
      {/* Preview zone - แสดงรูปที่เลือกก่อนอัปโหลด */}
      {previews.length > 0 && (
        <div className="mb-4 p-4 bg-cream-200 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-brown-700">
              รูปที่เลือก ({previews.length} รูป)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviews([])}
                className="text-sm text-tan-500 hover:text-brown-700"
              >
                ล้างทั้งหมด
              </button>
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="px-4 py-1.5 bg-brown-800 text-cream-100 rounded-full text-sm font-medium hover:bg-brown-900 disabled:opacity-50"
              >
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลดทั้งหมด"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview.base64}
                  alt={preview.filename}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <button
              onClick={() => setSelectedImage(image)}
              className="aspect-square w-full rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
            >
              <img
                src={image.imageBase64}
                alt={image.filename || "Image"}
                className="w-full h-full object-cover"
              />
            </button>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image.id);
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              title="ลบรูป"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Upload button - รองรับหลายรูป */}
        <label className="aspect-square rounded-xl border-2 border-dashed border-tan-300 flex flex-col items-center justify-center cursor-pointer hover:border-brown-700 hover:bg-cream-200 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelect}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <div className="text-tan-500">
              <SpinnerIcon className="h-8 w-8" />
            </div>
          ) : (
            <>
              <PlusIcon className="h-8 w-8 text-tan-400" />
              <span className="text-sm text-tan-500 mt-2">เพิ่มรูป</span>
              <span className="text-xs text-tan-400">(เลือกหลายรูปได้)</span>
            </>
          )}
        </label>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/90"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageBase64}
              alt={selectedImage.filename || "Image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleDelete(selectedImage.id)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                title="ลบรูป"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-cream-100 text-brown-800 rounded-full hover:bg-cream-200 transition-colors"
                title="ปิด"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Filename */}
            {selectedImage.filename && (
              <p className="absolute bottom-2 left-2 text-cream-200 text-sm bg-brown-900/50 px-3 py-1 rounded-full">
                {selectedImage.filename}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
