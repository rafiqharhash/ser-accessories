/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormValues } from "@/validators/checkout.validator";
import { useCartStore } from "@/store/useCartStore";
import { getShippingRate, submitOrder, getPaymentSettings, validateCoupon } from "@/actions/checkout.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScreenshotUploader } from "@/components/checkout/ScreenshotUploader";
import { CheckCircle2, ChevronRight, Loader2, ShieldCheck, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EGYPTIAN_GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
  "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia", "New Valley", "Suez",
  "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai",
  "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<{ instapay?: string, vodafoneCash?: string } | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      governorate: "",
      city: "",
      address: "",
      notes: "",
      paymentMethod: "instapay",
      paymentReference: "",
    },
  });

  const governorate = form.watch("governorate");
  const paymentMethod = form.watch("paymentMethod");
  const screenshot = form.watch("paymentScreenshot");

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  // Fetch shipping rate when governorate changes
  useEffect(() => {
    if (governorate) {
      getShippingRate(governorate).then(rate => setShippingCost(rate));
    }
  }, [governorate]);

  // Fetch payment settings
  useEffect(() => {
    getPaymentSettings().then(settings => setPaymentSettings(settings));
  }, []);

  const total = subtotal + shippingCost - discount;

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsCheckingCoupon(true);
    const result = await validateCoupon(couponInput);
    if (result.success && result.discountPercentage) {
      setCouponCode(result.code!);
      setDiscount(subtotal * (result.discountPercentage / 100));
      toast.success("Coupon applied successfully!");
    } else {
      toast.error(result.error || "Invalid coupon");
    }
    setIsCheckingCoupon(false);
  };

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["customerName", "phone", "governorate", "city", "address"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (["instapay", "vodafone_cash"].includes(data.paymentMethod) && !data.paymentScreenshot) {
      toast.error("Please upload a payment screenshot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitOrder(data, cartItems, couponCode);
      if (response.success) {
        clearCart();
        router.push(`/checkout/success/${response.orderNumber}`);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) return null; // Prevent flash

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Checkout Flow */}
        <div className="flex-grow">
          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border -z-10" />
            {[
              { num: 1, label: "Information" },
              { num: 2, label: "Summary" },
              { num: 3, label: "Payment" }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step >= s.num ? "bg-black text-white" : "bg-muted text-muted-foreground border border-border"
                }`}>
                  {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                </div>
                <span className={`text-xs font-medium uppercase tracking-wider ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Information */}
            <div className={step === 1 ? "block animate-in fade-in slide-in-from-right-4" : "hidden"}>
              <h2 className="text-2xl font-playfair mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input id="customerName" placeholder="Enter your full name" {...form.register("customerName")} />
                  {form.formState.errors.customerName && <p className="text-destructive text-sm">{form.formState.errors.customerName.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="01X XXXX XXXX" {...form.register("phone")} />
                  {form.formState.errors.phone && <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Governorate</Label>
                  <Select onValueChange={(val) => form.setValue("governorate", val as string)} defaultValue={governorate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select governorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {EGYPTIAN_GOVERNORATES.map(gov => (
                        <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.governorate && <p className="text-destructive text-sm">{form.formState.errors.governorate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City / Area</Label>
                  <Input id="city" placeholder="e.g. Heliopolis" {...form.register("city")} />
                  {form.formState.errors.city && <p className="text-destructive text-sm">{form.formState.errors.city.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" placeholder="Street name, building, apartment" {...form.register("address")} />
                  {form.formState.errors.address && <p className="text-destructive text-sm">{form.formState.errors.address.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="Any special delivery instructions" {...form.register("notes")} />
                </div>
              </div>
              <Button type="button" size="lg" className="w-full mt-8 uppercase tracking-widest" onClick={nextStep}>
                Continue to Summary <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>

            {/* Step 2: Summary */}
            <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4" : "hidden"}>
              <h2 className="text-2xl font-playfair mb-6">Order Review</h2>
              
              <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8">
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">{item.quantity}x {item.name}</div>
                        <div className="text-muted-foreground">{item.selectedColor} | {item.selectedSize}</div>
                      </div>
                      <div>EGP {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Discount code" 
                      value={couponInput} 
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={!!couponCode || isCheckingCoupon}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleApplyCoupon}
                      disabled={!couponInput || !!couponCode || isCheckingCoupon}
                    >
                      {isCheckingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {couponCode && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <Tag size={14} /> Coupon {couponCode} applied (-EGP {discount.toLocaleString()})
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>EGP {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>EGP {shippingCost.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>- EGP {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-border mt-2">
                    <span>Total</span>
                    <span>EGP {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" size="lg" className="w-1/3 uppercase tracking-widest" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" size="lg" className="w-2/3 uppercase tracking-widest" onClick={nextStep}>
                  Continue to Payment <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className={step === 3 ? "block animate-in fade-in slide-in-from-right-4" : "hidden"}>
              <h2 className="text-2xl font-playfair mb-6">Payment Method</h2>
              
              <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8">
                <RadioGroup 
                  defaultValue="instapay" 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onValueChange={(val: any) => form.setValue("paymentMethod", val)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 border border-border p-4 rounded-md bg-background">
                    <RadioGroupItem value="instapay" id="instapay" />
                    <Label htmlFor="instapay" className="flex flex-col cursor-pointer">
                      <span className="font-semibold text-base">Instapay</span>
                      <span className="text-sm text-muted-foreground">Transfer to: <strong className="text-foreground">{paymentSettings?.instapay || "Loading..."}</strong></span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-border p-4 rounded-md bg-background">
                    <RadioGroupItem value="vodafone_cash" id="vodafone_cash" />
                    <Label htmlFor="vodafone_cash" className="flex flex-col cursor-pointer">
                      <span className="font-semibold text-base">Vodafone Cash</span>
                      <span className="text-sm text-muted-foreground">Transfer to: <strong className="text-foreground">{paymentSettings?.vodafoneCash || "Loading..."}</strong></span>
                    </Label>
                  </div>
                </RadioGroup>

                {["instapay", "vodafone_cash"].includes(paymentMethod) && (
                  <div className="mt-8 pt-8 border-t border-border animate-in fade-in">
                    <h3 className="font-medium mb-2">Upload Transfer Screenshot</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please transfer exactly <strong className="text-foreground">EGP {total.toLocaleString()}</strong> to the number/handle above and upload the receipt.
                    </p>
                    
                    <ScreenshotUploader 
                      onUploadSuccess={(data) => {
                        form.setValue("paymentScreenshot", data);
                      }}
                      onRemove={() => form.setValue("paymentScreenshot", undefined)}
                    />
                    
                    <div className="mt-6 space-y-2">
                      <Label htmlFor="paymentReference">Transaction Reference (Optional)</Label>
                      <Input 
                        id="paymentReference" 
                        placeholder="Last 4 digits of reference number" 
                        {...form.register("paymentReference")}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" size="lg" className="w-1/3 uppercase tracking-widest" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-2/3 uppercase tracking-widest flex items-center justify-center gap-2"
                  disabled={isSubmitting || (["instapay", "vodafone_cash"].includes(paymentMethod) && !screenshot)}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                  {isSubmitting ? "Processing..." : `Pay EGP ${total.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Trust & Info */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6 hidden lg:block">
          <div className="bg-muted/30 border border-border p-6 text-sm">
            <ShieldCheck className="w-8 h-8 mb-4 text-primary" />
            <h3 className="font-semibold uppercase tracking-wider mb-2">Secure Checkout</h3>
            <p className="text-muted-foreground">Your personal information and payments are fully encrypted and secured. We never share your data.</p>
          </div>
          <div className="bg-muted/30 border border-border p-6 text-sm">
            <h3 className="font-semibold uppercase tracking-wider mb-2">Customer Support</h3>
            <p className="text-muted-foreground mb-4">Need help with your order? Our team is available 24/7.</p>
            <p className="font-medium">support@serluxury.com</p>
          </div>
        </div>

      </div>
    </div>
  );
}
