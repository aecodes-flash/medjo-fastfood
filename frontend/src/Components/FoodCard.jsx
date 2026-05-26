// ─── FoodCard.js ─────────────────────────────────────────────
// Static menu data used by MenuPage.
//
// When backend is ready:
//   Replace this array with a fetch → GET /api/menu
//   Each item shape from backend should match:
//     { _id, name, price, category, bestSeller, image (URL string), description }
//   Then map _id → id so the rest of the app keeps working.
// ─────────────────────────────────────────────────────────────

import hotdeals from "../assets/hotdeals.jpg";
import hotdeals1 from "../assets/hotdeals1.jpg";
import burger1  from "../assets/burger1.png";
import burger2  from "../assets/burger2.png";
import burger3  from "../assets/burger3.png";
import burger4  from "../assets/burger4.jpeg";
import burger5 from "../assets/burger5.jpg";
import chicken3 from "../assets/chicken3.jpg";
import chicken4 from "../assets/chicken4.jpg";
import chicken1 from "../assets/chicken1.jpg";
import chicken2 from "../assets/chicken2.jpg";
import pizza1   from "../assets/pizza.jpg";
import pizza2   from "../assets/pizza2.jpg";
import pizza3    from "../assets/pizza3.jpg";
import pizza4   from "../assets/pizza4.jpg";
import cake     from "../assets/cake.jpeg";
import cake2     from "../assets/cake2.jpg";
import cake3     from "../assets/cake3.jpg";
import cake4     from "../assets/cake4.jpg";
import juice    from "../assets/juice.jpeg";
import milktea  from "../assets/milktea.jpeg";
import coke from "../assets/coke.jpg";
import orangejuice  from "../assets/juice.jpeg";
import coffee  from "../assets/coffee.jpg";
import halo from "../assets/halohalo.jpg";


export const FoodCard = [
  // ── Burgers ──────────────────────────────────────────────
  { id: 1,  name: "Classic Burger",       price: 130, category: "Burgers", bestSeller: false, img: burger1 },
  { id: 2,  name: "Double Smash Burger",  price: 175, category: "Burgers", bestSeller: true,  img: burger2 },
  { id: 3,  name: "Mega Burger",          price: 210, category: "Burgers", bestSeller: true,  img: burger3 },
  { id: 4,  name: "Cheesy Burger",        price: 149, category: "Burgers", bestSeller: false, img: burger4 },
  { id: 5,  name: "Houz Burger",          price: 160, category: "Burgers", bestSeller: false, img: burger5 },

  // ── Chicken ──────────────────────────────────────────────
  { id: 6,  name: "Crispy Chicken",       price: 130, category: "Chicken", bestSeller: true,  img: chicken3 },
  { id: 7,  name: "Spicy Chicken",        price: 130, category: "Chicken", bestSeller: false, img: chicken1 },
  { id: 8,  name: "Grilled Chicken",      price: 130, category: "Chicken", bestSeller: true,  img: chicken4 },
  { id: 9,  name: "Chicken Wings",        price: 130, category: "Chicken", bestSeller: true,  img: chicken2 },

  // ── Drinks ───────────────────────────────────────────────
  { id: 10, name: "Milk Tea",             price: 89,  category: "Drinks",  bestSeller: true,  img: milktea  },
  { id: 11, name: "Coke",                 price: 45,  category: "Drinks",  bestSeller: false, img: coke    },
  { id: 12, name: "Orange Juice",         price: 75,  category: "Drinks",  bestSeller: true,  img: orangejuice  },
  { id: 13, name: "Iced Coffee",          price: 80,  category: "Drinks",  bestSeller: false, img: coffee   },
  { id: 14, name: "Halo-Halo",            price: 110, category: "Drinks",  bestSeller: true,  img: halo     },

  // ── Pizza ────────────────────────────────────────────────
  { id: 17, name: "Cheese Pizza",         price: 199, category: "Pizza",   bestSeller: false, img: pizza1   },
  { id: 18, name: "Pepperoni Pizza",      price: 219, category: "Pizza",   bestSeller: false, img: pizza2   },
  { id: 19, name: "BBQ Chicken Pizza",    price: 229, category: "Pizza",   bestSeller: true,  img: pizza3   },
  { id: 20, name: "Hawaiian Pizza",       price: 209, category: "Pizza",   bestSeller: true,  img: pizza4   },

  // ── Cake ─────────────────────────────────────────────────
  { id: 22, name: "Chocolate Cake",       price: 130, category: "Cake",    bestSeller: false, img: cake4     },
  { id: 23, name: "Cheese Cake",          price: 130, category: "Cake",    bestSeller: false, img: cake2    },
  { id: 24, name: "Red Velvet Cake",      price: 130, category: "Cake",    bestSeller: false, img: cake3    },
  { id: 25, name: "Strawberry Cake",      price: 130, category: "Cake",    bestSeller: true,  img: cake    },

  // ── Hot Deals (special promo items) ──────────────────────
  { id: 15, name: "Hot Deal Meal A",      price: 199, category: "Burgers", bestSeller: true,  img: hotdeals1 },
  { id: 16, name: "Hot Deal Meal B",      price: 249, category: "Burgers", bestSeller: false, img: hotdeals },
];

export default FoodCard;
