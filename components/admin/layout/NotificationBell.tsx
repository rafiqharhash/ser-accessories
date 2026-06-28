"use client";

import { useState, useEffect } from "react";
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/actions/notification.actions";
import { Bell, Check, Info, AlertTriangle, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const data = await getAdminNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic update
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, readAt: new Date() } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    // Optimistic
    setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date() })));
    setUnreadCount(0);
    await markAllNotificationsAsRead();
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XOctagon className="w-5 h-5 text-destructive" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications ({unreadCount})</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs">
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => {
                const Wrapper = notif.link ? Link : "div";
                return (
                  <Wrapper 
                    key={notif._id}
                    href={notif.link || "#"}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-start gap-4 p-4 border-b transition-colors hover:bg-muted/50 relative",
                      !notif.readAt ? "bg-muted/20" : "opacity-75"
                    )}
                  >
                    {!notif.readAt && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(notif.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !notif.readAt && "font-medium text-foreground")}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notif.readAt && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full flex-shrink-0"
                        onClick={(e) => handleMarkAsRead(notif._id, e)}
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
