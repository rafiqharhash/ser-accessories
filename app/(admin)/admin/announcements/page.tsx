import { getAdminAnnouncements } from "@/actions/announcement.actions";
import { AnnouncementsManager } from "@/components/admin/announcements/AnnouncementsManager";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAdminAnnouncements();
  
  return (
    <div className="p-8">
      <AnnouncementsManager initialAnnouncements={announcements} />
    </div>
  );
}
