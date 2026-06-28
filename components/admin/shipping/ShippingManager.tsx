"use client";

import { useState } from "react";
import { saveShippingZone, deleteShippingZone } from "@/actions/shipping.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface ShippingManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialZones: any[];
}

export function ShippingManager({ initialZones }: ShippingManagerProps) {
  const [zones, setZones] = useState(initialZones);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [governorate, setGovernorate] = useState("");
  const [cost, setCost] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState("");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const filteredZones = zones.filter(z => z.governorate.toLowerCase().includes(search.toLowerCase()));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (zone?: any) => {
    if (zone) {
      setEditingId(zone._id);
      setGovernorate(zone.governorate);
      setCost(zone.cost || 0);
      setEstimatedDays(zone.estimatedDays || "");
      setActive(zone.active !== false);
    } else {
      setEditingId(null);
      setGovernorate("");
      setCost(0);
      setEstimatedDays("2-4 Business Days");
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      governorate,
      cost: Number(cost),
      estimatedDays,
      active
    };

    const res = await saveShippingZone(editingId, payload);
    
    if (res.success) {
      toast.success("Shipping zone saved!");
      window.location.reload(); 
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, gov: string) => {
    if (!confirm(`Are you sure you want to delete ${gov}?`)) return;
    const res = await deleteShippingZone(id);
    if (res.success) {
      toast.success("Deleted successfully");
      setZones(zones.filter(z => z._id !== id));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Shipping Configuration</h1>
          <p className="text-sm text-muted-foreground">Manage delivery fees and times per governorate.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Governorate
        </Button>
      </div>

      <div className="bg-background p-4 border border-border rounded-lg shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search governorates..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3">Governorate</th>
              <th className="px-4 py-3">Shipping Cost</th>
              <th className="px-4 py-3">Estimated Time</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No records found.</td>
              </tr>
            ) : (
              filteredZones.map(zone => (
                <tr key={zone._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{zone.governorate}</td>
                  <td className="px-4 py-3">EGP {zone.cost}</td>
                  <td className="px-4 py-3 text-muted-foreground">{zone.estimatedDays || "Not specified"}</td>
                  <td className="px-4 py-3 text-center">
                    {zone.active ? (
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs border bg-muted text-muted-foreground">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(zone)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(zone._id, zone.governorate)}>
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
            <DialogTitle>{editingId ? 'Edit' : 'Add'} Governorate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Governorate Name</Label>
              <Input required value={governorate} onChange={e => setGovernorate(e.target.value)} placeholder="e.g. Cairo" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shipping Cost (EGP)</Label>
                <Input type="number" required min={0} value={cost} onChange={e => setCost(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Estimated Delivery</Label>
                <Input required value={estimatedDays} onChange={e => setEstimatedDays(e.target.value)} placeholder="2-4 Business Days" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="activeShipping" checked={active} onCheckedChange={(c) => setActive(!!c)} />
              <Label htmlFor="activeShipping">Active (Available at checkout)</Label>
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
