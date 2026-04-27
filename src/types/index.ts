// ─── Category ───
export interface Category {
  id: string;
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── SubCategory ───
export interface SubCategory {
  id: string;
  _id: string;
  name: string;
  slug: string;
  category: string | Category;
  createdAt: string;
  updatedAt: string;
}

// ─── Brand ───
export interface Brand {
  id: string;
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ───
export interface Product {
  id: string;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  colors: string[];
  imageCover: string;
  image: string; // mapped from imageCover in frontend
  images: string[];
  category: string | Category;
  subcategories: string[] | SubCategory[];
  brand?: string | Brand;
  ratingsAverage?: number;
  ratingsQuantity: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───
export interface Review {
  id: string;
  _id: string;
  title?: string;
  ratings: number;
  user: string | User;
  product: string | Product;
  createdAt: string;
  updatedAt: string;
}

// ─── User ───
export interface User {
  id: string;
  _id: string;
  name: string;
  slug?: string;
  email: string;
  phone?: string;
  profileImg?: string;
  role: 'user' | 'admin';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ───
export interface CartItem {
  _id: string;
  product: Pick<Product, '_id' | 'title' | 'imageCover' | 'ratingsAverage' | 'price'>;
  quantity: number;
  color?: string;
  price: number;
}

export interface Cart {
  _id: string;
  cartItems: CartItem[];
  totalCartPrice: number;
  totalPriceAfterDiscount?: number;
  user: string;
}

// ─── Order ───
export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface Order {
  _id: string;
  user: User;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'vodafoneCash';
  isPaid: boolean;
  paidAt?: string;
  vodafoneCashNumber?: string;
  paymentScreenshot?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}
