"use server";

import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/product.model";
import { Order } from "@/models/order.model";
import { Category } from "@/models/category.model";
import { Collection } from "@/models/collection.model";
import { Coupon } from "@/models/coupon.model";

export async function globalAdminSearch(query: string) {
  if (!query || query.length < 2) return { products: [], orders: [], categories: [], collections: [], coupons: [] };

  await connectToDatabase();
  
  const regex = new RegExp(query, "i");

  // Parallel searching
  const [products, orders, categories, collections, coupons] = await Promise.all([
    Product.find({ name: regex }).limit(5).select("name slug status").lean(),
    Order.find({ 
      $or: [
        { "customer.name": regex },
        { "customer.phone": regex },
        { "customer.email": regex },
        // If orderNumber was implemented, it would be here
      ] 
    }).limit(5).select("customer status totalAmount").lean(),
    Category.find({ name: regex }).limit(5).select("name slug").lean(),
    Collection.find({ name: regex }).limit(5).select("name slug").lean(),
    Coupon.find({ code: regex }).limit(5).select("code active").lean()
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    orders: JSON.parse(JSON.stringify(orders)),
    categories: JSON.parse(JSON.stringify(categories)),
    collections: JSON.parse(JSON.stringify(collections)),
    coupons: JSON.parse(JSON.stringify(coupons))
  };
}
