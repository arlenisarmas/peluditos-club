export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  attributes?: Record<string, string>;
  colors?: ProductColor[];
  sizes?: string[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  bgClass: string;
  order: number;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}
