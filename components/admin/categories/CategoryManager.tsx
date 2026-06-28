"use client";

import { useState } from "react";
import { saveCategory, deleteCategory, saveCollection, deleteCollection } from "@/actions/category.actions";
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
import { Plus, Edit2, Trash2, Search } from "lucide-react";


interface CategoryManagerProps {
  type: "category" | "collection";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export function CategoryManager({ type, data }: CategoryManagerProps) {
  const [items, setItems] = useState(data);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item._id);
      setName(item.name);
      setSlug(item.slug);
      setDescription(item.description || "");
      setDisplayOrder(item.displayOrder || 0);
      // Collections use isFeatured, Categories use featured
      setFeatured(type === "collection" ? !!item.isFeatured : !!item.featured);
    } else {
      setEditingId(null);
      setName("");
      setSlug("");
      setDescription("");
      setDisplayOrder(0);
      setFeatured(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      name,
      slug,
      description,
      displayOrder: Number(displayOrder),
      ...(type === "collection" ? { isFeatured: featured } : { featured })
    };

    const action = type === "category" ? saveCategory : saveCollection;
    const res = await action(editingId, payload);
    
    if (res.success) {
      toast.success(`${type === "category" ? "Category" : "Collection"} saved!`);
      // Optimistic update locally
      if (editingId) {
        setItems(items.map(i => i._id === editingId ? { ...i, ...payload } : i));
      } else {
        // Just reload the page for creation to get the real ID, or mock it
        window.location.reload();
      }
      setIsModalOpen(false);
    } else {
      toast.error(res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    const action = type === "category" ? deleteCategory : deleteCollection;
    const res = await action(id);
    
    if (res.success) {
      toast.success("Deleted successfully");
      setItems(items.filter(i => i._id !== id));
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair capitalize mb-1">{type === "category" ? "Categories" : "Collections"}</h1>
          <p className="text-sm text-muted-foreground">Manage your product organization architecture.</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add {type === "category" ? "Category" : "Collection"}
        </Button>
      </div>

      <div className="bg-background p-4 border border-border rounded-lg shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={`Search ${type}s...`} 
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-center">Featured</th>
              <th className="px-4 py-3 text-center">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No records found.</td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.slug}</td>
                  <td className="px-4 py-3 text-center">
                    {(type === "collection" ? item.isFeatured : item.featured) ? (
                      <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-800 border-green-200">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs border bg-muted text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{item.displayOrder || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openModal(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item._id, item.name)}>
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
            <DialogTitle>{editingId ? 'Edit' : 'Create'} {type === "category" ? "Category" : "Collection"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={name} onChange={e => {
                setName(e.target.value);
                if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
              }} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input required value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label>Display Order</Label>
                <Input type="number" required value={displayOrder} onChange={e => setDisplayOrder(Number(e.target.value))} />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(!!c)} />
                <Label htmlFor="featured">Featured (Homepage)</Label>
              </div>
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
