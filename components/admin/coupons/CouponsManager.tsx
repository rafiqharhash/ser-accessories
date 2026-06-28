"use client";

import { useState } from "react";
import { saveCoupon, deleteCoupons } from "@/actions/coupon.actions";
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

interface CouponsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialCoupons: any[];
}

export function CouponsManager({ initialCoupons }: CouponsManagerProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [minimumPurchase, setMinimumPurchase] = useState(0);
  const [maxUsage, setMaxUsage] = useState<number | "">("");
  const [expirationDate, setExpirationDate] = useState("");
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (coupon?: any) => {
    if (coupon) {
      setEditingId(coupon._id);
      setCode(coupon.code);
      setDiscountType(coupon.discountType || "percentage");
      setDiscountValue(coupon.discountValue || coupon.percentage || 0); // Fallback for old data
      setMinimumPurchase(coupon.minimumPurchase || 0);
      setMaxUsage(coupon.maxUsage || "");
      setExpirationDate(coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : "");
      setActive(coupon.active !== false);
    } else {
      setEditingId(null);
      setCode("");
      setDiscountType("percentage");
      setDiscountValue(0);
      setMinimumPurchase(0);
      setMaxUsage("");
      setExpirationDate("");
      setActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      code,
      discountType,
      discountValue: Number(discountValue),
      minimumPurchase: Number(minimumPurchase),
      maxUsage: maxUsage ? Number(maxUsage) : null,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      active
    };

    const res = await saveCoupon(editingId, payload);
    
    if (res.success) {
      toast.success("Coupon saved successfully!");
      window.location.reload(); // Quick refresh to get true server state
    } else {
      toast.error(res.error);
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    const res = await deleteCoupons([id]);
    if (res.success) {
      toast.success("Deleted successfully");
      setCoupons(coupons.filter(c => c._id !== id));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair mb-1">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discounts and promotional codes.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <div className="bg-background p-4 border border-border rounded-lg shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search coupons..." 
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
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3 text-center">Usage</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">No coupons found.</td>
              </tr>
            ) : (
              filteredCoupons.map(coupon => (
                <tr key={coupon._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium uppercase">{coupon.code}</td>
                  <td className="px-4 py-3">
                    {coupon.discountType === "fixed" ? `EGP ${coupon.discountValue}` : `${coupon.discountValue}%`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {coupon.currentUsage} {coupon.maxUsage ? `/ ${coupon.maxUsage}` : '(Unlimited)'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {coupon.active ? (
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs border bg-muted text-muted-foreground">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(coupon)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(coupon._id, coupon.code)}>
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
            <DialogTitle>{editingId ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SUMMER26" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <select 
                  value={discountType} 
                  onChange={e => setDiscountType(e.target.value as "percentage" | "fixed")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (EGP)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input type="number" required min={0} max={discountType === "percentage" ? 100 : undefined} value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Purchase (EGP)</Label>
                <Input type="number" min={0} value={minimumPurchase} onChange={e => setMinimumPurchase(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Max Usage (Leave empty for unlimited)</Label>
                <Input type="number" min={1} value={maxUsage} onChange={e => setMaxUsage(e.target.value ? Number(e.target.value) : "")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="active" checked={active} onCheckedChange={(c) => setActive(!!c)} />
              <Label htmlFor="active">Coupon is active and can be used by customers</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Coupon"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
