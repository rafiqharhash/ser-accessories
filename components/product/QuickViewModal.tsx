"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductClientWrapper } from "./ProductClientWrapper";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any; // Ideally typed to IProduct
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Quick View for {product.name}</DialogTitle>

        <div className="p-6">
          <ProductClientWrapper product={product} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
