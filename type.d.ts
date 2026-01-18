import { Models } from "react-native-appwrite";
import { ImageSourcePropType } from "react-native";

export interface PackOption {
  type: "Student" | "Corporate" | "Oga" | "RAAJ";
  price: number;
}

export interface DrinkOption {
  name: string;
  price: number;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: 
    | "salad"
    | "macroni"
    | "meat"
    | "chicken"
    | "wele"
    | "egg"
    | "gari" 
    |  string;
}

// export interface PackOption {
//   id: string;
//   name: string;
//   price: number;
// }

// export interface DrinkOption {
//   id: string;
//   name: string;
//   price: number;
// }


export interface MenuItem {
  id: string;
  name: string;
  category: "Waakye" | "Jollof" | "Plain Rice" | "RAAJ Juice";
  image: any;
  description: string;
  price;
  packs?: PackOption[];
  drinks?: DrinkOption[];
  allowedCustomizations?: string[]; // List of customization IDs
  favoritesCount?: number;
}


export interface Category extends Models.Document {
  id: string;
  name: string;
  description: string;
  image?: any;
}



// =======================
// User
// =======================
// export interface Address {
//   id: string;
//   label: string;
//   details: string;
// }


export interface User extends Models.Document {
  $id: string;
  name: string;
  email: string;
  avatar?: URL;
  phone?: string;
  accountId: string;
  avatarFileId: string;
  // ✅ NEW FIELDS
  addresses?: Address[];
  activeAddressId?: string | null;
}



export interface CartItemType {
  id: string;                 // menu item id
  name: string;
  image: any;
  pack: string;
  drinks: string[];
  quantity: number;
  unitPrice: number;          // price for ONE item
  customizations?: string[]; // optional list of customization IDs
  // customizations?: CartCustomization[];
}

export interface CartStore {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
}

interface CustomHeaderProps {
  title?: string;
}

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface GetMenuParams {
  category: string;
  query: string;
}
