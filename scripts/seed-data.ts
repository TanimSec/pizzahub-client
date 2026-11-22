const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const DEMO_PASSWORD = "Pizza123";

export const vendors = [
  { name: "Giuseppe Romano", email: "giuseppe@pizzahub.demo", businessName: "Romano's Wood Fire", premium: true },
  { name: "Sofia Bianchi", email: "sofia@pizzahub.demo", businessName: "Slice & Co.", premium: false },
  { name: "Marco Esposito", email: "marco@pizzahub.demo", businessName: "Crust Brothers", premium: false },
];

export const customers = [{ name: "Demo Customer", email: "customer@pizzahub.demo" }];

export interface SeedItem {
  vendor: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export const items: SeedItem[] = [
  { vendor: "giuseppe@pizzahub.demo", itemName: "Margherita Classica", category: "Classic Pizzas", description: "San Marzano tomato, fior di latte mozzarella, fresh basil and extra virgin olive oil on a 48-hour fermented dough.", price: 12.5, location: "Brooklyn, NY", images: [img("photo-1574071318508-1cdbab80d002"), img("photo-1513104890138-7c749659a591")] },
  { vendor: "giuseppe@pizzahub.demo", itemName: "Pepperoni Inferno", category: "Meat Lovers", description: "Double cup-and-char pepperoni, spicy honey drizzle, mozzarella and chili flakes. Baked at 480C for a crisp, leopard-spotted crust.", price: 15.9, location: "Brooklyn, NY", images: [img("photo-1628840042765-356cda07504e"), img("photo-1565299624946-b28f40a0ae38")] },
  { vendor: "giuseppe@pizzahub.demo", itemName: "Truffle Funghi Gourmet", category: "Specialty / Gourmet Pizzas", description: "Roasted wild mushrooms, black truffle cream, fontina and thyme finished with shaved parmesan.", price: 19.5, location: "Brooklyn, NY", images: [img("photo-1513104890138-7c749659a591")] },
  { vendor: "giuseppe@pizzahub.demo", itemName: "Garlic Knots (6 pcs)", category: "Sides & Appetizers", description: "Hand-tied dough knots brushed with garlic butter and parsley, served with warm marinara.", price: 6.5, location: "Brooklyn, NY", images: [img("photo-1619531040576-f9416740661b")] },
  { vendor: "sofia@pizzahub.demo", itemName: "Garden Veggie Delight", category: "Vegetarian Pizzas", description: "Roasted peppers, red onion, olives, baby spinach and cherry tomatoes over basil pesto and mozzarella.", price: 13.9, location: "Queens, NY", images: [img("photo-1571407970349-bc81e7e96d47")] },
  { vendor: "sofia@pizzahub.demo", itemName: "Four Cheese Bianca", category: "Vegetarian Pizzas", description: "Mozzarella, gorgonzola, parmesan and ricotta on a garlic-olive oil base with a drizzle of honey.", price: 14.5, location: "Queens, NY", images: [img("photo-1604382354936-07c5d9983bd3")] },
  { vendor: "sofia@pizzahub.demo", itemName: "Classic Cheese Pizza", category: "Classic Pizzas", description: "Our everyday favorite: tangy tomato sauce, whole milk mozzarella and a crisp, chewy crust.", price: 10.9, location: "Queens, NY", images: [img("photo-1513104890138-7c749659a591")] },
  { vendor: "sofia@pizzahub.demo", itemName: "Tiramisu Cup", category: "Beverages & Desserts", description: "Espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.", price: 5.9, location: "Queens, NY", images: [img("photo-1571877227200-a0d98ea607e9")] },
  { vendor: "marco@pizzahub.demo", itemName: "BBQ Chicken Supreme", category: "Specialty / Gourmet Pizzas", description: "Smoky BBQ sauce, grilled chicken, red onion, cilantro and smoked gouda.", price: 16.5, location: "Manhattan, NY", images: [img("photo-1593560708920-61dd98c46a4e")] },
  { vendor: "marco@pizzahub.demo", itemName: "Meat Feast", category: "Meat Lovers", description: "Italian sausage, bacon, ham and pepperoni layered over mozzarella and rich tomato sauce.", price: 17.9, location: "Manhattan, NY", images: [img("photo-1534308983496-4fabb1a015ee")] },
  { vendor: "marco@pizzahub.demo", itemName: "Crispy Buffalo Wings", category: "Sides & Appetizers", description: "Twelve oven-crisped wings tossed in house buffalo sauce with ranch and celery.", price: 11.5, location: "Manhattan, NY", images: [img("photo-1567620832903-9fc6debc209f")] },
  { vendor: "marco@pizzahub.demo", itemName: "Craft Lemonade (500ml)", category: "Beverages & Desserts", description: "Fresh-squeezed lemons, mint and cane sugar served over ice.", price: 3.9, location: "Manhattan, NY", images: [img("photo-1621263764928-df1444c5e859")] },
];
