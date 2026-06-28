import { getCollections } from "@/actions/category.actions";
import { CategoryManager } from "@/components/admin/categories/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  
  return (
    <div className="p-8">
      <CategoryManager type="collection" data={collections} />
    </div>
  );
}
