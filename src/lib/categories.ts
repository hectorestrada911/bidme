export const CATEGORY_OPTIONS = [
  { value: "products", label: "Products", icon: "ShoppingBag" },
  { value: "electronics", label: "Electronics", icon: "Cpu" },
  { value: "clothing", label: "Clothing", icon: "Shirt" },
  { value: "accessories", label: "Accessories", icon: "Gem" },
  { value: "wholesale", label: "Wholesale", icon: "Package" },
  { value: "jewelry", label: "Jewelry", icon: "Diamond" }
]

export type CategoryOption = typeof CATEGORY_OPTIONS[number]
