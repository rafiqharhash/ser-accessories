import { create } from 'zustand';

export interface CartItem {
  cartItemId: string; // Unique ID for this exact variant configuration
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  oldPrice?: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedMaterial?: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => set((state) => {
    // Generate a unique ID based on product and selected variants
    const cartItemId = `${item.productId}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}-${item.selectedMaterial || 'default'}`;
    
    const existingItemIndex = state.items.findIndex(i => i.cartItemId === cartItemId);
    
    if (existingItemIndex > -1) {
      const newItems = [...state.items];
      const existingItem = newItems[existingItemIndex];
      // Do not exceed maxStock
      const newQuantity = Math.min(existingItem.quantity + item.quantity, existingItem.maxStock);
      
      newItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity
      };
      
      return { items: newItems };
    }
    
    return { items: [...state.items, { ...item, cartItemId }] };
  }),
  
  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter(i => i.cartItemId !== cartItemId)
  })),
  
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map(item => {
      if (item.cartItemId === cartItemId) {
        // Ensure quantity remains between 1 and maxStock
        const validQuantity = Math.max(1, Math.min(quantity, item.maxStock));
        return { ...item, quantity: validQuantity };
      }
      return item;
    })
  })),
  
  clearCart: () => set({ items: [] }),
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
