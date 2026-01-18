// types/menu.ts
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  image: any;
  description: string;
  price: number;
  packs?: { type: string; price: number }[];
  drinks?: { name: string; price: number }[];
  allowedCustomizations?: string[];
  favoritesCount?: number;
}