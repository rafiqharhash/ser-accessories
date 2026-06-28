import { getAuditLogs } from "@/actions/audit.actions";
import { AuditClient } from "@/components/admin/audit/AuditClient";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: { page?: string; action?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const data = await getAuditLogs(page, 50, searchParams.action);
  
  return (
    <div className="p-8">
      <AuditClient data={data} />
    </div>
  );
}
