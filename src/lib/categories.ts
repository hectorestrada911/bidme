export const CATEGORY_OPTIONS = [
  { value: "business-services", label: "Business Services", icon: "Briefcase" },
  { value: "products", label: "Products", icon: "ShoppingBag" },
  { value: "home-services", label: "Home Services", icon: "Home" },
  { value: "professional-work", label: "Professional Work", icon: "Wrench" },
  { value: "creative-services", label: "Creative Services", icon: "Camera" },
  { value: "technology", label: "Technology", icon: "Laptop" }
]

export type CategoryOption = typeof CATEGORY_OPTIONS[number]
