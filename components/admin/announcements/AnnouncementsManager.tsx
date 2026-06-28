"use client";

import { useState } from "react";
import { saveAnnouncement, deleteAnnouncement } from "@/actions/announcement.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Megaphone } from "lucide-react";

interface AnnouncementsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialAnnouncements: any[];
}

export function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (ann?: any) => {
    if (ann) {
      setEditingId(ann._id);
      setTitle(ann.title);
      setMessage(ann.message);
      setLink(ann.link || "");
      setBackgroundColor(ann.backgroundColor || "#000000");
      setTextColor(ann.textColor || "#ffffff");
      setStartDate(ann.startDate ? new Date(ann.startDate).toISOString().split('T')[0] : "");
      setEndDate(ann.endDate ? new Date(ann.endDate).toISOString().split('T')[0] : "");
      setActive(ann.active !== false);
    } else {
      setEditingId(null);
      setTitle("");
      setMessage("");
      setLink("");
      setBackgroundColor("#000000");
      setTextColor("#ffffff");
      setStartDate("");
      setEndDate("");
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      title,
      message,
      link,
      backgroundColor,
      textColor,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      active
    };

    const res = await saveAnnouncement(editingId, payload);
    
    if (res.success) {
      toast.success("Announcement saved!");
      window.location.reload(); 
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete "${titleStr}"?`)) return;
    const res = await deleteAnnouncement(id);
    if (res.success) {
      toast.success("Deleted successfully");
      setAnnouncements(announcements.filter(a => a._id !== id));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Announcements</h1>
          <p className="text-sm text-muted-foreground">Manage global banners displayed across the storefront.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3">Title & Preview</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">No announcements found.</td>
              </tr>
            ) : (
              announcements.map(ann => (
                <tr key={ann._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium mb-1">{ann.title}</div>
                    <div 
                      className="px-3 py-1 rounded text-xs inline-flex items-center"
                      style={{ backgroundColor: ann.backgroundColor || "#000", color: ann.textColor || "#fff" }}
                    >
                      <Megaphone className="w-3 h-3 mr-2" />
                      {ann.message}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ann.active ? (
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs border bg-muted text-muted-foreground">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {ann.startDate ? new Date(ann.startDate).toLocaleDateString() : "Now"} - <br />
                    {ann.endDate ? new Date(ann.endDate).toLocaleDateString() : "Forever"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(ann)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(ann._id, ann.title)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Create'} Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Internal Title (Admin Only)</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Summer Sale Banner" />
            </div>
            
            <div className="space-y-2">
              <Label>Display Message</Label>
              <Textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Free Shipping on orders over EGP 1000!" />
            </div>

            <div className="space-y-2">
              <Label>Call to Action Link (Optional)</Label>
              <Input value={link} onChange={e => setLink(e.target.value)} placeholder="/shop/summer-collection" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 p-1 h-10" value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
                  <Input value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-12 p-1 h-10" value={textColor} onChange={e => setTextColor(e.target.value)} />
                  <Input value={textColor} onChange={e => setTextColor(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date (Optional)</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="activeAnnounce" checked={active} onCheckedChange={(c) => setActive(!!c)} />
              <Label htmlFor="activeAnnounce">Publish Banner to Storefront</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
