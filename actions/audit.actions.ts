"use server";

import { connectToDatabase } from "@/lib/db";
import { AuditLog } from "@/models/audit-log.model";

export async function getAuditLogs(page: number = 1, limit: number = 50, actionFilter?: string) {
  await connectToDatabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};
  if (actionFilter && actionFilter !== "all") {
    query.action = actionFilter;
  }

  const logs = await AuditLog.find(query)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await AuditLog.countDocuments(query);
  
  return {
    logs: JSON.parse(JSON.stringify(logs)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}
