import { getTopProducts } from "@/actions/analytics.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export async function TopProductsTable({ searchParams }: { searchParams: { start?: string; end?: string } }) {
  const products = await getTopProducts(searchParams, 5);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No products sold in this period.</p>
        ) : (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {products.map((product: any) => (
              <Link key={product._id} href={`/admin/products/${product._id}`} className="flex items-center gap-4 group p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="w-12 h-16 relative bg-muted rounded overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <Image src={product.image.url} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted border flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:underline">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.unitsSold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">EGP {product.revenue.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
