"use server";

import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";

// We'll create an AuditLog model later, for now we return mock data or empty array
export async function getDashboardStats() {
  await connectToDatabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Today's Orders & Revenue
  const todaysOrdersPromise = Order.find({ createdAt: { $gte: today } }).lean();
  
  // 2. Pending Orders
  const pendingOrdersCountPromise = Order.countDocuments({ orderStatus: "pending" });

  // 3. Products Stock (Need to aggregate across simple stock and variants)
  const productsPromise = Product.find({}).lean();

  // 4. Latest Orders
  const latestOrdersPromise = Order.find({}).sort({ createdAt: -1 }).limit(5).lean();

  const [todaysOrders, pendingOrdersCount, products, latestOrdersRaw] = await Promise.all([
    todaysOrdersPromise,
    pendingOrdersCountPromise,
    productsPromise,
    latestOrdersPromise
  ]);

  const todaysRevenue = todaysOrders.reduce((acc, order) => acc + order.total, 0);
  const todaysOrdersCount = todaysOrders.length;

  let lowStockCount = 0;
  let outOfStockCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lowStockProducts: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const outOfStockProducts: any[] = [];

  const LOW_STOCK_THRESHOLD = 5; // Eventually move to Settings

  products.forEach((p) => {
    let totalStock = 0;
    if (p.stockMode === "single") {
      totalStock = p.stock;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalStock = p.variants.reduce((acc: number, v: any) => acc + v.stock, 0);
    }

    if (totalStock === 0) {
      outOfStockCount++;
      outOfStockProducts.push(p);
    } else if (totalStock <= LOW_STOCK_THRESHOLD) {
      lowStockCount++;
      lowStockProducts.push(p);
    }
  });

  // Convert latestOrders ObjectIds to strings
  const latestOrders = JSON.parse(JSON.stringify(latestOrdersRaw));

  // Placeholder for Admin Activity & Inventory changes until those models are built
  const latestActivity = [
    { action: "Logged in", admin: "Administrator", time: "10 mins ago" }
  ];

  const bestSellingProducts = [
    { name: "Placeholder Best Seller", sold: 120 }
  ];

  return {
    todaysRevenue,
    todaysOrdersCount,
    pendingOrdersCount,
    lowStockCount,
    outOfStockCount,
    latestOrders,
    lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts.slice(0, 5))),
    outOfStockProducts: JSON.parse(JSON.stringify(outOfStockProducts.slice(0, 5))),
    bestSellingProducts,
    latestActivity
  };
}
