"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productValidator } from "@/utils/validators/product.validator";
import { saveProduct } from "@/actions/admin-product.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce"; // Will create this

interface ProductFormClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
}

export function ProductFormClient({ product }: ProductFormClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date(product.updatedAt));

  const form = useForm({
    resolver: zodResolver(productValidator),
    defaultValues: product,
  });

  const formValues = useWatch({ control: form.control });
  const debouncedValues = useDebounce(formValues, 3000); // 3 seconds

  // Auto-Save Effect
  useEffect(() => {
    const autoSave = async () => {
      // Only auto-save if it's currently a draft to avoid accidentally publishing changes prematurely
      if (product.status === "draft" && form.formState.isDirty) {
        setIsSaving(true);
        // Note: In a true prod app, we'd validate here first, but drafts might be incomplete.
        // We bypass full Zod validation for pure "save as draft" if we implement a separate relaxed endpoint, 
        // but for now we'll attempt standard save.
        const res = await saveProduct(product._id, debouncedValues);
        if (res.success) {
          setLastSaved(new Date());
          form.reset(debouncedValues, { keepValues: true, keepDirty: false });
        }
        setIsSaving(false);
      }
    };
    
    if (Object.keys(debouncedValues).length > 0) {
      autoSave();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues]);

  // Unsaved Changes Guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  // Inside the component...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const res = await saveProduct(product._id, data);
    if (res.success) {
      toast.success("Product saved successfully.");
      setLastSaved(new Date());
      form.reset(data);
    } else {
      toast.error(res.error || "Failed to save product.");
      if (res.issues) console.error(res.issues);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 border border-border rounded-lg sticky top-16 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">{form.getValues("name")}</h1>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full border ${form.getValues("status") === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {form.getValues("status")}
              </span>
              <span>•</span>
              <span>{lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : 'Not saved'}</span>
              {form.formState.isDirty && <span className="text-orange-500 font-medium">(Unsaved changes)</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {form.getValues("status") === "published" && (
            <Link href={`/product/${form.getValues("slug")}`} target="_blank" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Eye className="w-4 h-4 mr-2" /> View Live
            </Link>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-background border border-border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input {...form.register("name")} placeholder="Signature Silk Gown" />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message as string}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input {...form.register("slug")} placeholder="signature-silk-gown" />
              <p className="text-xs text-muted-foreground">The URL path for this product. Auto-redirects are created if changed after publishing.</p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...form.register("description")} rows={8} placeholder="Full product description..." />
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (EGP)</Label>
                <Input type="number" {...form.register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Compare at Price (Optional)</Label>
                <Input type="number" {...form.register("oldPrice")} />
              </div>
              <div className="space-y-2">
                <Label>Master SKU</Label>
                <Input {...form.register("SKU")} />
              </div>
              <div className="space-y-2">
                <Label>Base Stock</Label>
                {/* eslint-disable-next-line react-hooks/incompatible-library */}
                <Input type="number" {...form.register("stock")} disabled={form.watch("stockMode") === "variant"} />
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6 space-y-4 shadow-sm">
             <h2 className="text-lg font-semibold">SEO Optimization</h2>
             <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>SEO Title</Label>
                <span className="text-xs text-muted-foreground">{form.watch("seo.title")?.length || 0} / 60</span>
              </div>
              <Input {...form.register("seo.title")} placeholder={form.watch("name")} />
             </div>
             <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>SEO Description</Label>
                <span className="text-xs text-muted-foreground">{form.watch("seo.description")?.length || 0} / 160</span>
              </div>
              <Textarea {...form.register("seo.description")} rows={3} placeholder="Brief summary for search engines..." />
             </div>
          </div>

        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold">Publishing</h2>
            <div className="space-y-2">
              <Label>Status</Label>
              <select {...form.register("status")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            {/* Version Log Info */}
            <div className="pt-4 mt-4 border-t border-border">
              <p className="text-sm font-medium">Version {product.version}</p>
              <p className="text-xs text-muted-foreground mt-1">Last edited by {product.historyLog?.[product.historyLog.length-1]?.changedBy || "Admin"}</p>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold">Media</h2>
            <p className="text-xs text-muted-foreground">Main featured image (3:4 ratio recommended).</p>
            {/* Will integrate MediaSelectorModal here shortly */}
            <div className="aspect-[3/4] bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
               {form.watch("featuredImage.secureUrl") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.watch("featuredImage.secureUrl")} alt="Featured" className="w-full h-full object-cover rounded-lg" />
               ) : (
                  <span className="text-sm text-muted-foreground">Select Image</span>
               )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
