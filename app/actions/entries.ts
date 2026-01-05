"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// สถานะที่ใช้ได้
export type EntryStatus = "todo" | "inProgress" | "done" | "cancelled";

interface CreateEntryData {
  title: string;
  description: string;
  status: EntryStatus;
  day?: number;
  month?: number;
  year?: number;
  images?: string[]; // base64 strings
}

interface UpdateEntryData {
  title?: string;
  description?: string;
  status?: EntryStatus;
  day?: number | null;
  month?: number | null;
  year?: number;
}

// ดึง entries ของ user ตาม year และ month (optional)
export async function getEntries(year?: number, month?: number) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const where: {
      userId: string;
      deletedAt: null;
      year?: number;
      month?: number;
    } = {
      userId: session.userId,
      deletedAt: null,
    };

    if (year) where.year = year;
    if (month) where.month = month;

    const entries = await prisma.entry.findMany({
      where,
      include: {
        images: {
          where: { deletedAt: null },
          select: {
            id: true,
            imageBase64: true,
            filename: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { createdAt: "desc" }],
    });

    return { entries };
  } catch (error) {
    console.error("Error fetching entries:", error);
    return { error: "Failed to fetch entries" };
  }
}

// ดึง entry เดียว
export async function getEntry(id: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        id,
        userId: session.userId,
        deletedAt: null,
      },
      include: {
        images: {
          where: { deletedAt: null },
        },
      },
    });

    if (!entry) {
      return { error: "Entry not found" };
    }

    return { entry };
  } catch (error) {
    console.error("Error fetching entry:", error);
    return { error: "Failed to fetch entry" };
  }
}

// สร้าง entry ใหม่
export async function createEntry(data: CreateEntryData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        userId: session.userId,
        title: data.title,
        description: data.description,
        status: data.status,
        day: data.day,
        month: data.month,
        year: data.year || new Date().getFullYear(),
        images: data.images?.length
          ? {
              create: data.images.map((imageBase64) => ({
                imageBase64,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/dashboard");
    if (data.year && data.month) {
      revalidatePath(`/dashboard/${data.year}/${data.month}`);
    }

    return { success: true, entry };
  } catch (error) {
    console.error("Error creating entry:", error);
    return { error: "Failed to create entry" };
  }
}

// อัปเดต entry
export async function updateEntry(id: string, data: UpdateEntryData) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // เช็คว่าเป็นเจ้าของ
    const existing = await prisma.entry.findFirst({
      where: { id, userId: session.userId, deletedAt: null },
    });

    if (!existing) {
      return { error: "Entry not found" };
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        day: data.day,
        month: data.month,
        year: data.year,
      },
      include: {
        images: {
          where: { deletedAt: null },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${entry.year}/${entry.month}`);

    return { success: true, entry };
  } catch (error) {
    console.error("Error updating entry:", error);
    return { error: "Failed to update entry" };
  }
}

// ลบ entry (soft delete)
export async function deleteEntry(id: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // เช็คว่าเป็นเจ้าของ
    const existing = await prisma.entry.findFirst({
      where: { id, userId: session.userId, deletedAt: null },
    });

    if (!existing) {
      return { error: "Entry not found" };
    }

    await prisma.entry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${existing.year}/${existing.month}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting entry:", error);
    return { error: "Failed to delete entry" };
  }
}

// เพิ่มรูปภาพให้ entry
export async function addImageToEntry(
  entryId: string,
  imageBase64: string,
  filename?: string
) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // เช็คว่าเป็นเจ้าของ entry
    const entry = await prisma.entry.findFirst({
      where: { id: entryId, userId: session.userId, deletedAt: null },
    });

    if (!entry) {
      return { error: "Entry not found" };
    }

    const image = await prisma.image.create({
      data: {
        entryId,
        imageBase64,
        filename,
      },
    });

    revalidatePath(`/dashboard/${entry.year}/${entry.month}`);

    return { success: true, image };
  } catch (error) {
    console.error("Error adding image:", error);
    return { error: "Failed to add image" };
  }
}

// เพิ่มหลายรูปภาพไปยัง entry
export async function addMultipleImagesToEntry(
  entryId: string,
  images: { base64: string; filename: string }[]
) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // เช็คว่าเป็นเจ้าของ entry
    const entry = await prisma.entry.findFirst({
      where: { id: entryId, userId: session.userId, deletedAt: null },
    });

    if (!entry) {
      return { error: "Entry not found" };
    }

    // สร้างหลายรูปพร้อมกัน
    const createdImages = await prisma.image.createMany({
      data: images.map((img) => ({
        entryId,
        imageBase64: img.base64,
        filename: img.filename,
      })),
    });

    revalidatePath(`/dashboard/${entry.year}/${entry.month}`);
    revalidatePath(`/entry/${entryId}`);

    return { success: true, count: createdImages.count };
  } catch (error) {
    console.error("Error adding images:", error);
    return { error: "Failed to add images" };
  }
}

// ลบรูปภาพ
export async function deleteImage(imageId: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    // เช็คว่าเป็นเจ้าของ
    const image = await prisma.image.findFirst({
      where: { id: imageId, deletedAt: null },
      include: {
        entry: {
          select: { userId: true, year: true, month: true },
        },
      },
    });

    if (!image || image.entry.userId !== session.userId) {
      return { error: "Image not found" };
    }

    await prisma.image.update({
      where: { id: imageId },
      data: { deletedAt: new Date() },
    });

    revalidatePath(`/dashboard/${image.entry.year}/${image.entry.month}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: "Failed to delete image" };
  }
}
