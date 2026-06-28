"use server";

import { z } from "zod";
import { checkoutSchema } from "@/validators/checkout.validator";
// import { Order } from "@/models/order.model";
// import { Shipping } from "@/models/shipping.model";
// import { Settings } from "@/models/settings.model";
// import { Product } from "@/models/product.model";

// Generate signature for Cloudinary upload
export async function generateUploadSignature() {
  // In a real implementation:
  // const timestamp = Math.round((new Date).getTime()/1000);
  // const signature = cloudinary.utils.api_sign_request({ timestamp, folder: 'receipts' }, process.env.CLOUDINARY_API_SECRET!);
  // return { signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY };
  
  return {
    signature: "mock_signature",
    timestamp: Date.now(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloud",
    apiKey: process.env.CLOUDINARY_API_KEY || "mock_key",
  };
}

// Get Dynamic Shipping Rate based on Governorate
export async function getShippingRate(governorate: string) {
  try {
    // const shipping = await Shipping.findOne({ governorate: new RegExp(`^${governorate}$`, 'i') });
    // return shipping ? shipping.shippingPrice : 150; // Fallback to 150 if not found
    
    // Mock for UI
    if (governorate.toLowerCase() === "cairo" || governorate.toLowerCase() === "giza") {
      return 100;
    }
    return 150;
  } catch (error) {
    console.error("Error fetching shipping rate:", error);
    return 150;
  }
}

// Get Dynamic Payment Numbers
export async function getPaymentSettings() {
  try {
    // const settings = await Settings.findOne();
    // return { instapay: settings?.instapayNumber, vodafoneCash: settings?.vodafoneCashNumber };
    
    // Mock for UI
    return {
      instapay: "user@instapay",
      vodafoneCash: "01000000000",
    };
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return null;
  }
}

// Validate Coupon
export async function validateCoupon(code: string) {
  try {
    // Mock Validation
    if (code.toUpperCase() === "WELCOME10") {
      return { success: true, discountPercentage: 10, code: "WELCOME10" };
    }
    return { success: false, error: "Invalid or expired coupon" };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Error validating coupon" };
  }
}

// Submit Order (Idempotent & Validated)
export async function submitOrder(
  formData: z.infer<typeof checkoutSchema>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[], // Would type as CartItem[]
  couponCode?: string | null
) {
  try {
    // 1. Validate Form Data strictly on server
    const validatedData = checkoutSchema.parse(formData);

    // 2. Validate Cart is not empty
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    // 3. Check for Payment Screenshot if required
    if (["instapay", "vodafone_cash"].includes(validatedData.paymentMethod) && !validatedData.paymentScreenshot) {
      return { success: false, error: "Payment screenshot is required for this payment method." };
    }

    // 5. Apply Shipping & Coupon to get final Total
    await getShippingRate(validatedData.governorate);
    
    if (couponCode) {
      const couponValid = await validateCoupon(couponCode);
      if (couponValid.success && couponValid.discountPercentage) {
        // Apply discount logic here in production
      }
    }

    // 6. Generate Order Number
    const mockOrderNumber = `SER-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(6, '0')}`;

    return { 
      success: true, 
      orderId: `mock-id-${Date.now()}`, 
      orderNumber: mockOrderNumber 
    };

  } catch (error) {
    console.error("Order submission failed:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data submitted." };
    }
    return { success: false, error: "Failed to process order. Please try again." };
  }
}
