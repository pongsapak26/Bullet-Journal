import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsContent } from "./StatsContent";

export default async function StatsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  // ดึงสถิติ entries ทั้งหมด
  const stats = await prisma.entry.groupBy({
    by: ["status"],
    where: {
      userId: session.userId,
      deletedAt: null,
    },
    _count: {
      status: true,
    },
  });

  // คำนวณจำนวน
  const statusCounts = {
    todo: 0,
    inProgress: 0,
    done: 0,
    cancelled: 0,
  };

  stats.forEach((stat) => {
    statusCounts[stat.status as keyof typeof statusCounts] = stat._count.status;
  });

  return (
    <div className="min-h-screen w-full bg-cream-300">
      <StatsContent statusCounts={statusCounts} />
    </div>
  );
}
