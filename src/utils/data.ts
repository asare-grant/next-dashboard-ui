import {  CartCustomization, Category } from "../../type"; // make sure this path is correct
import { MenuItem } from "@/types/menu";
import { Order } from "@/types/order";
import { Staff } from "@/types/staff";

export const CATEGORY_DATA: Category[] = [
  {
    id: "cat-1",
    name: "Waakye",
    description: "Traditional Ghanaian waakye served with sides",
    image: "/images/raajwaakye.jpeg",
  },
  {
    id: "cat-2",
    name: "Jollof",
    description: "Classic Ghana jollof rice with rich tomato base",
    image: "/images/raajjollof.jpeg",
  },
  {
    id: "cat-3",
    name: "Plain Rice",
    description: "Steamed white rice served with sauces",
    image: "/images/raajrice.jpeg",
  },
  {
    id: "cat-4",
    name: "RAAJ Juice",
    description: "Freshly prepared natural fruit drinks",
    image: "/images/drinks.jpeg",
  },
];



export const MENU_DATA: MenuItem[] = [
  {
    id: "1",
    name: "Waakye Student Pack",
    category: "Waakye",
    image: "/raajwaakye-1.png",
    description: "Gari - Macaroni - Egg - Sausage - Plantain",
    price: 25,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
    drinks: [
      { name: "Coke", price: 5 },
      { name: "Fanta", price: 5 },
    ],
   allowedCustomizations: ["salad", "macroni", "wele", "egg", "gari", "meat"],
  },
  {
    id: "2",
    name: "Waakye Corporate Pack",
    category: "Waakye",
    image:"/raajwaakye-1.png",
    description: "Gari - Macaroni - Egg/Sausage - Plantain - Meat/Fish - Wele - Pack",
    price: 45,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
    drinks: [
      { name: "Coke", price: 5 },
      { name: "Fanta", price: 5 },
    ],
   allowedCustomizations: ["salad", "macroni", "wele", "egg", "gari", "meat"],
  },
  {
    id: "3",
    name: "Waakye Oga Pack",
    category: "Waakye",
    image: "/raajwaakye-1.png",
    description: " Gari - Macaroni - Egg - Sausage - Plantain - Meat - Fish - Wele - Salad - Pack",
    price: 60,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },
  {
    id: "4",
    name: "Waakye RAAJ Pack",
    category: "Waakye",
    image: "/raajwaakye-1.png",
    description: "OGA Pack + Fish - Meat - Egg - Wele - Water",
    price: 100,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },

  // Jollof
  {
    id: "5",
    name: "Jollof Student Pack",
    category: "Jollof",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg - Sausage - Plantain",
    price: 25,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
    allowedCustomizations: ["meat", "macroni", "chicken"],
  },
  {
    id: "6",
    name: "Jollof Corporate Pack",
    category: "Jollof",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg/Sausage - Plantain - Meat/Fish - Wele - Pack",
    price: 45,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },
  {
    id: "7",
    name: "Jollof Oga Pack",
    category: "Jollof",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg - Sausage - Plantain - Meat - Fish - Wele - Salad - Pack",
    price: 60,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  allowedCustomizations: ["meat", "chicken"],
  },
  {
    id: "8",
    name: "Jollof RAAJ Pack",
    category: "Jollof",
    image: "/raajwaakye-1.png",
    description: "OGA Pack + Fish - Meat - Egg - Wele - Water",
    price: 100,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },

  // Plain Rice
  {
    id: "9",
    name: "Plain Rice Student Pack",
    category: "Plain Rice",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg - Sausage - Plantain",
    price: 25,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },
  {
    id: "10",
    name: "Plain Rice Corporate Pack",
    category: "Plain Rice",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg/Sausage - Plantain - Meat/Fish - Wele - Pack",
    price: 45,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },
  {
    id: "11",
    name: "Plain Rice Oga Pack",
    category: "Plain Rice",
    image: "/raajwaakye-1.png",
    description: "Macaroni - Egg - Sausage - Plantain - Meat - Fish - Wele - Salad - Pack",
    price: 60,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
  },
  {
    id: "12",
    name: "Plain Rice RAAJ Pack",
    category: "Plain Rice",
    image: "/raajwaakye-1.png",
    description: "OGA Pack + Fish - Meat - Egg - Wele - Water",
    price: 100,
    packs: [
      { type: "Student", price: 25 },
      { type: "Corporate", price: 45 },
      { type: "Oga", price: 60 },
      { type: "RAAJ", price: 100 },
    ],
    allowedCustomizations: ["salad", "macroni", "wele", "egg", "gari", "meat"],
  },

  // RAAJ Juice
  {
    id: "13",
    name: "Beetpine",
    category: "RAAJ Juice",
    image: "/raajwaakye-1.png",
    description: "Beetroot - Pineapple - Ginger",
    price: 18,
    packs: [{ type: "Student", price: 18 }],
  },
  {
    id: "14",
    name: "Pineginger",
    category: "RAAJ Juice",
    image: "/raajwaakye-1.png",
    description: "Pineapple - Ginger",
    price: 18,
    packs: [{ type: "Student", price: 18 }],
    allowedCustomizations: [],
  },
  {
    id: "15",
    name: "Pineapple",
    category: "RAAJ Juice",
    image: "/raajwaakye-1.png",
    description: "Pineapple only",
    price: 18,
    packs: [{ type: "Student", price: 18 }],
  },
  {
    id: "16",
    name: "Cocktail",
    category: "RAAJ Juice",
    image: "/raajwaakye-1.png",
    description: "Pineapple - Watermelon - Orange",
    price: 18,
    packs: [{ type: "Student", price: 18 }],
  },
];



// export const ORDERS_DATA: Order[] = [
//   {
//     id: "FD-9KQ2M7A",
//     customerName: "Prince Asare",
//     customerPhone: "0241234567",
//     items: [
//       {
//         id: "1",
//         name: "Waakye Student Pack",
//         quantity: 2,
//         unitPrice: 25,
//         pack: "Student",
//         drinks: ["Coke"],
//         customizations: ["egg", "gari"],
//       },
//     ],
//     total: 50,
//     deliveryFee: 10,
//     paymentMethod: "momo",
//     paymentStatus: "paid",
//     orderStatus: "preparing",
//     createdAt: new Date().toISOString(),
//   },

//   {
//     id: "FD-8A2MPL9",
//     customerName: "Ama Boateng",
//     customerPhone: "0209876543",
//     items: [
//       {
//         id: "2",
//         name: "Waakye Oga Pack",
//         quantity: 1,
//         unitPrice: 60,
//         pack: "Oga",
//         drinks: ["Fanta"],
//       },
//     ],
//     total: 60,
//     deliveryFee: 10,
//     paymentMethod: "cash",
//     paymentStatus: "pending",
//     orderStatus: "pending",
//     createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
//   },
// ];


export const STAFF_DATA: Staff[] = [
  {
    id: "STF-001",
    fullName: "Kwame Mensah",
    email: "kwame@fooddash.com",
    phone: "0241234567",
    role: "manager",
    status: "active",
    shift: "morning",
    branch: "East Legon",
    joinedAt: "2024-02-15T08:30:00Z",
  },
  {
    id: "STF-002",
    fullName: "Ama Boateng",
    email: "ama@fooddash.com",
    phone: "0559876543",
    role: "chef",
    status: "active",
    shift: "evening",
    branch: "Osu",
    joinedAt: "2023-10-04T09:00:00Z",
  },
  {
    id: "STF-003",
    fullName: "Yaw Asante",
    email: "yaw@fooddash.com",
    phone: "0205566778",
    role: "rider",
    status: "suspended",
    shift: "night",
    branch: "Airport",
    joinedAt: "2023-05-20T14:20:00Z",
  },
];
