"use server";

import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/order.model";
import { Product } from "@/models/product.model";
import { dateRangeValidator } from "@/utils/validators/analytics.validator";
import { subDays, differenceInDays } from "date-fns";

// Helper to get previous period
const getPreviousPeriod = (start: Date, end: Date) => {
  const days = differenceInDays(end, start) || 1;
  return {
    start: subDays(start, days),
    end: subDays(end, days)
  };
};

export async function getRevenueKPIs(searchParams: { start?: string; end?: string }) {
  await connectToDatabase();
  const { start, end } = dateRangeValidator.parse(searchParams);
  const prevPeriod = getPreviousPeriod(start, end);

  // Current Period Pipeline
  const currentPipeline = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: { $nin: ["cancelled", "refunded"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } }
  ]);

  // Previous Period Pipeline
  const prevPipeline = await Order.aggregate([
    { $match: { createdAt: { $gte: prevPeriod.start, $lte: prevPeriod.end }, status: { $nin: ["cancelled", "refunded"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } }
  ]);

  const current = currentPipeline[0] || { totalRevenue: 0, orderCount: 0 };
  const prev = prevPipeline[0] || { totalRevenue: 0, orderCount: 0 };

  const currentAOV = current.orderCount > 0 ? current.totalRevenue / current.orderCount : 0;
  const prevAOV = prev.orderCount > 0 ? prev.totalRevenue / prev.orderCount : 0;

  const calculateGrowth = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  return {
    revenue: {
      value: current.totalRevenue,
      growth: calculateGrowth(current.totalRevenue, prev.totalRevenue)
    },
    orders: {
      value: current.orderCount,
      growth: calculateGrowth(current.orderCount, prev.orderCount)
    },
    aov: {
      value: currentAOV,
      growth: calculateGrowth(currentAOV, prevAOV)
    }
  };
}

export async function getRevenueChartData(searchParams: { start?: string; end?: string }) {
  await connectToDatabase();
  const { start, end } = dateRangeValidator.parse(searchParams);

  // Group by day
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: { $nin: ["cancelled", "refunded"] } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return data.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders }));
}

export async function getGovernorateDistribution(searchParams: { start?: string; end?: string }) {
  await connectToDatabase();
  const { start, end } = dateRangeValidator.parse(searchParams);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: { $nin: ["cancelled", "refunded"] } } },
    {
      $group: {
        _id: "$shippingAddress.governorate",
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  return data.map(d => ({ governorate: d._id || "Unknown", revenue: d.revenue, orders: d.orders }));
}

export async function getTopProducts(searchParams: { start?: string; end?: string }, limit = 5) {
  await connectToDatabase();
  const { start, end } = dateRangeValidator.parse(searchParams);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end }, status: { $nin: ["cancelled", "refunded"] } } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product", // This is the ObjectId
        unitsSold: { $sum: "$products.quantity" },
        revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 1,
        unitsSold: 1,
        revenue: 1,
        name: "$productDetails.name",
        slug: "$productDetails.slug",
        image: { $arrayElemAt: ["$productDetails.images", 0] }
      }
    }
  ]);

  return JSON.parse(JSON.stringify(data));
}

export async function getLowStockAlerts() {
  await connectToDatabase();
  // Using a static threshold for simplicity, ideally fetched from Settings
  const threshold = 5;

  const products = await Product.find({
    $or: [
      { stockMode: "simple", stock: { $lte: threshold } },
      { stockMode: "variant", "variantStock.availableStock": { $lte: threshold } }
    ],
    status: { $ne: "archived" }
  })
  .select("name slug stock stockMode variantStock")
  .limit(10)
  .lean();

  return JSON.parse(JSON.stringify(products));
}
