import { getCategories } from "@/actions/category.actions";
import { CategoryManager } from "@/components/admin/categories/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="p-8">
      <CategoryManager type="category" data={categories} />
    </div>
  );
}
