"use client";

import { useEffect, useState } from "react";
import { getStoreSettings, updateStoreSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <div className="p-8 flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateStoreSettings(settings);
    if (result.success) {
      toast.success("Settings saved successfully.");
    } else {
      toast.error(result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair mb-2">Store Settings</h1>
          <p className="text-muted-foreground">Manage global store configurations, branding, and maintenance.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Settings */}
        <div className="bg-background border border-border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Website Name</Label>
              <Input 
                value={settings.websiteName || ""} 
                onChange={e => setSettings({ ...settings, websiteName: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input 
                value={settings.contactEmail || ""} 
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input 
                value={settings.contactPhone || ""} 
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Store Address</Label>
              <Input 
                value={settings.address || ""} 
                onChange={e => setSettings({ ...settings, address: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* Maintenance & Inventory Defaults */}
        <div className="bg-background border border-border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">System Configuration</h2>
          <div className="flex items-center justify-between p-4 border border-border rounded-md mb-6 bg-muted/20">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">When enabled, the storefront will be hidden from customers.</p>
            </div>
            <Switch 
              checked={settings.maintenanceMode} 
              onCheckedChange={(c: boolean) => setSettings({ ...settings, maintenanceMode: c })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Low Stock Threshold</Label>
              <Input 
                type="number"
                value={settings.lowStockThreshold || 5} 
                onChange={e => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })} 
              />
              <p className="text-xs text-muted-foreground">Products below this stock level will trigger warnings.</p>
            </div>
          </div>
        </div>

        {/* Payment Numbers */}
        <div className="bg-background border border-border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Payment Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Instapay Number</Label>
              <Input 
                value={settings.instapayNumber || ""} 
                onChange={e => setSettings({ ...settings, instapayNumber: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Vodafone Cash Number</Label>
              <Input 
                value={settings.vodafoneCashNumber || ""} 
                onChange={e => setSettings({ ...settings, vodafoneCashNumber: e.target.value })} 
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="bg-background border border-border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Default SEO Configuration</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Default Title</Label>
              <Input 
                value={settings.seo?.defaultTitle || ""} 
                onChange={e => setSettings({ ...settings, seo: { ...settings.seo, defaultTitle: e.target.value }})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Default Description</Label>
              <Input 
                value={settings.seo?.defaultDescription || ""} 
                onChange={e => setSettings({ ...settings, seo: { ...settings.seo, defaultDescription: e.target.value }})} 
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
