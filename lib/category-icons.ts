import {
  Fuel,
  Coffee,
  Utensils,
  ShoppingBag,
  Wifi,
  Car,
  Train,
  Plane,
  Film,
  Home,
  Zap,
  HeartPulse,
  Wrench,
  Receipt,
  LucideIcon,
} from "lucide-react";

export interface CategoryMatch {
  category: string;
  iconName: string;
  IconComponent: LucideIcon;
}

const KEYWORD_MAP: Array<{
  category: string;
  iconName: string;
  IconComponent: LucideIcon;
  keywords: string[];
}> = [
  {
    category: "fuel",
    iconName: "Fuel",
    IconComponent: Fuel,
    keywords: ["petrol", "fuel", "gas", "diesel", "cng", "shell", "hp", "indian oil", "bpcl"],
  },
  {
    category: "cafe",
    iconName: "Coffee",
    IconComponent: Coffee,
    keywords: ["coffee", "tea", "chai", "latte", "starbucks", "cafe", "cappuccino", "brew", "ccd"],
  },
  {
    category: "food",
    iconName: "Utensils",
    IconComponent: Utensils,
    keywords: [
      "dinner", "lunch", "breakfast", "swiggy", "zomato", "restaurant", "food", "burger", "pizza",
      "biryani", "dhaba", "snack", "mcdonalds", "kfc", "dominos", "meal", "eating",
    ],
  },
  {
    category: "groceries",
    iconName: "ShoppingBag",
    IconComponent: ShoppingBag,
    keywords: [
      "grocery", "groceries", "supermarket", "blinkit", "zepto", "instamart", "milk", "vegetables",
      "fruits", "bread", "eggs", "mart", "dmart", "provisions",
    ],
  },
  {
    category: "utilities",
    iconName: "Wifi",
    IconComponent: Wifi,
    keywords: ["wifi", "internet", "broadband", "fiber", "recharge", "airtel", "jio", "act"],
  },
  {
    category: "taxi",
    iconName: "Car",
    IconComponent: Car,
    keywords: ["uber", "ola", "auto", "taxi", "rapido", "cab", "ride", "drive"],
  },
  {
    category: "train",
    iconName: "Train",
    IconComponent: Train,
    keywords: ["train", "metro", "irctc", "railway", "subway"],
  },
  {
    category: "flight",
    iconName: "Plane",
    IconComponent: Plane,
    keywords: ["flight", "indigo", "air", "airline", "airport", "air india", "vistara"],
  },
  {
    category: "entertainment",
    iconName: "Film",
    IconComponent: Film,
    keywords: ["movie", "cinema", "theatre", "netflix", "prime", "hotstar", "spotify", "ticket", "pvr", "imax"],
  },
  {
    category: "housing",
    iconName: "Home",
    IconComponent: Home,
    keywords: ["rent", "apartment", "flat", "room", "maintenance", "pg", "society"],
  },
  {
    category: "bills",
    iconName: "Zap",
    IconComponent: Zap,
    keywords: ["electricity", "power", "bescom", "water", "bill", "current", "cylinder", "lpg"],
  },
  {
    category: "medical",
    iconName: "HeartPulse",
    IconComponent: HeartPulse,
    keywords: ["doctor", "medicine", "pharmacy", "apollo", "hospital", "clinic", "meds", "tablets"],
  },
  {
    category: "vehicle_service",
    iconName: "Wrench",
    IconComponent: Wrench,
    keywords: ["service", "mechanic", "puncture", "repair", "oil change", "chain lube", "wash", "spares", "bike repair"],
  },
];

/**
 * Match expense title dynamically to category and Lucide icon
 */
export function matchCategoryFromTitle(title: string): CategoryMatch {
  if (!title || !title.trim()) {
    return {
      category: "general",
      iconName: "Receipt",
      IconComponent: Receipt,
    };
  }

  const normalized = title.toLowerCase();

  for (const item of KEYWORD_MAP) {
    for (const keyword of item.keywords) {
      if (normalized.includes(keyword)) {
        return {
          category: item.category,
          iconName: item.iconName,
          IconComponent: item.IconComponent,
        };
      }
    }
  }

  return {
    category: "general",
    iconName: "Receipt",
    IconComponent: Receipt,
  };
}
