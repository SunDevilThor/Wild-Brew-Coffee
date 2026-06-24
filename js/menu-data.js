"use strict";

window.WildBrewMenuData = {
  products: [
    {
      id: "small-latte",
      name: "Small Iced Latte",
      category: "Individual Lattes",
      price: 6.5,
      description: "One handcrafted small iced latte with your flavor and cold foam choice.",
      image: "assets/images/coffee-cup-1.jpeg",
      drinkCount: 1,
      sizeLabel: "Small"
    },
    {
      id: "large-latte",
      name: "Large Iced Latte",
      category: "Individual Lattes",
      price: 7.5,
      description: "One handcrafted large iced latte with your flavor and cold foam choice.",
      image: "assets/images/coffee-cups-2.jpeg",
      drinkCount: 1,
      sizeLabel: "Large"
    },
    {
      id: "small-tray",
      name: "Small Tray",
      category: "Trays",
      price: 20,
      description: "Four small iced coffees. Each drink can be customized separately.",
      image: "assets/images/wild-brew-coffee-1-tray.jpeg",
      drinkCount: 4,
      sizeLabel: "Small"
    },
    {
      id: "large-tray",
      name: "Large Tray",
      category: "Trays",
      price: 25,
      description: "Four large iced coffees. Each drink can be customized separately.",
      image: "assets/images/wild-brew-coffee-many-trays.jpeg",
      drinkCount: 4,
      sizeLabel: "Large"
    }
  ],
  flavors: [
    "Mocha",
    "Vanilla",
    "Caramel",
    "S'mores",
    "Pistachio",
    "Coconut",
    "Tiramisu",
    "White Chocolate"
  ],
  coldFoamFlavors: [
    "None",
    "Salted Vanilla",
    "Chocolate",
    "White Chocolate",
    "Caramel"
  ],
  addOns: [
    {
      id: "extra-shot",
      name: "Extra Shot",
      price: 1.5,
      pricingLabel: "$1.50 per shot"
    },
    {
      id: "extra-cold-foam",
      name: "Extra Cold Foam",
      price: 1,
      pricingLabel: "$1.00"
    },
    {
      id: "extra-syrup",
      name: "Extra Syrup",
      price: 0.5,
      pricingLabel: "$0.50"
    },
    {
      id: "extra-topping",
      name: "Extra Topping",
      price: 0.5,
      pricingLabel: "$0.50"
    }
  ]
};
