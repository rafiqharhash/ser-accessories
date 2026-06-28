import { getActiveAnnouncements } from "@/actions/announcement.actions";
import Link from "next/link";

export async function GlobalBanner() {
  const announcements = await getActiveAnnouncements();
  
  if (!announcements || announcements.length === 0) return null;

  // Render the first active announcement
  const banner = announcements[0];

  const content = (
    <div 
      className="w-full text-center py-2 px-4 text-sm font-medium tracking-wide"
      style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}
    >
      {banner.message}
    </div>
  );

  if (banner.link) {
    return (
      <Link href={banner.link} className="block w-full hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
